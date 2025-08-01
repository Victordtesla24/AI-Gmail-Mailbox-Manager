
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

    const emailLogs = await prisma.emailProcessingLog.findMany({
      include: {
        gmailAccount: {
          select: {
            email: true,
            displayName: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 100, // Limit to 100 most recent logs
    });

    return NextResponse.json(emailLogs);
  } catch (error) {
    console.error('Error fetching email processing logs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
