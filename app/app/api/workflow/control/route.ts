
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { createAuditLog } from '@/lib/audit';

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { action } = await request.json();

    if (!['start', 'stop', 'pause', 'restart'].includes(action)) {
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

    let workflowStatus = await prisma.workflowStatus.findUnique({
      where: {
        workflowId: '1747c5e50',
      },
    });

    if (!workflowStatus) {
      // Create default workflow status if it doesn't exist
      workflowStatus = await prisma.workflowStatus.create({
        data: {
          workflowId: '1747c5e50',
          status: 'stopped',
          executionCount: 0,
          errorCount: 0,
        }
      });
    }

    let updateData: any = {
      updatedAt: new Date(),
    };

    switch (action) {
      case 'start':
        if (workflowStatus.status === 'running') {
          return NextResponse.json({ error: 'Workflow is already running' }, { status: 400 });
        }
        updateData.status = 'running';
        updateData.lastStarted = new Date();
        updateData.executionCount = workflowStatus.executionCount + 1;
        break;
      
      case 'stop':
        if (workflowStatus.status === 'stopped') {
          return NextResponse.json({ error: 'Workflow is already stopped' }, { status: 400 });
        }
        updateData.status = 'stopped';
        updateData.lastStopped = new Date();
        break;
      
      case 'pause':
        if (workflowStatus.status !== 'running') {
          return NextResponse.json({ error: 'Can only pause a running workflow' }, { status: 400 });
        }
        updateData.status = 'paused';
        break;
      
      case 'restart':
        updateData.status = 'running';
        updateData.lastStarted = new Date();
        updateData.executionCount = workflowStatus.executionCount + 1;
        updateData.lastError = null; // Clear any previous errors
        break;
    }

    const updatedStatus = await prisma.workflowStatus.update({
      where: { workflowId: '1747c5e50' },
      data: updateData,
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: `workflow_${action}`,
      resource: 'workflow',
      resourceId: '1747c5e50',
      details: { action, previousStatus: workflowStatus.status, newStatus: updateData.status },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(updatedStatus);
  } catch (error) {
    console.error('Error controlling workflow:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
