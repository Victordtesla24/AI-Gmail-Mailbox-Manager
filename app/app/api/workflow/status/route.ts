
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

    const workflowStatus = await prisma.workflowStatus.findUnique({
      where: {
        workflowId: '1747c5e50',
      },
    });

    if (!workflowStatus) {
      // Create default workflow status if it doesn't exist
      const newStatus = await prisma.workflowStatus.create({
        data: {
          workflowId: '1747c5e50',
          status: 'stopped',
          executionCount: 0,
          errorCount: 0,
          configuration: {
            processingInterval: 300,
            maxEmailsPerBatch: 50,
            enableSmartReplies: true,
            notificationsEnabled: true,
          }
        }
      });
      return NextResponse.json(newStatus);
    }

    return NextResponse.json(workflowStatus);
  } catch (error) {
    console.error('Error fetching workflow status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
