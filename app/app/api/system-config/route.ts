
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configs = await prisma.systemConfig.findMany({
      orderBy: [
        { category: 'asc' },
        { key: 'asc' },
      ],
    });

    return NextResponse.json(configs);
  } catch (error) {
    console.error('Error fetching system config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const configValues = await request.json();

    // Update each configuration
    const updatePromises = Object.entries(configValues).map(async ([key, value]) => {
      let stringValue: string;
      
      if (typeof value === 'boolean') {
        stringValue = value.toString();
      } else if (typeof value === 'object') {
        stringValue = JSON.stringify(value);
      } else {
        stringValue = String(value);
      }

      return prisma.systemConfig.update({
        where: { key },
        data: {
          value: stringValue,
          updatedAt: new Date(),
        },
      });
    });

    await Promise.all(updatePromises);

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'system_config_updated',
      resource: 'system_config',
      details: { updatedKeys: Object.keys(configValues) },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({ message: 'Configuration updated successfully' });
  } catch (error) {
    console.error('Error updating system config:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
