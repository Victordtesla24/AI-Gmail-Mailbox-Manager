
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const errorLogs = await prisma.errorLog.findMany({
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to 100 most recent logs
    });

    return NextResponse.json(errorLogs);
  } catch (error) {
    console.error('Error fetching error logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
