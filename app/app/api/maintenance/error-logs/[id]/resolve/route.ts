
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const errorId = params.id;

    const errorLog = await prisma.errorLog.findUnique({
      where: { id: errorId },
    });

    if (!errorLog) {
      return NextResponse.json({ error: 'Error log not found' }, { status: 404 });
    }

    if (errorLog.resolved) {
      return NextResponse.json({ error: 'Error is already resolved' }, { status: 400 });
    }

    const updatedErrorLog = await prisma.errorLog.update({
      where: { id: errorId },
      data: {
        resolved: true,
        resolvedAt: new Date(),
        resolvedBy: session.user.id,
      },
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'error_log_resolved',
      resource: 'error_log',
      resourceId: errorId,
      details: { component: errorLog.component, errorType: errorLog.errorType },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(updatedErrorLog);
  } catch (error) {
    console.error('Error resolving error log:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
