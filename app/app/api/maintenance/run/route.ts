
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

    const { taskType } = await request.json();

    if (!taskType) {
      return NextResponse.json({ error: 'Task type is required' }, { status: 400 });
    }

    // Create a new maintenance task
    const task = await prisma.maintenanceTask.create({
      data: {
        name: getTaskName(taskType),
        description: getTaskDescription(taskType),
        taskType,
        status: 'running',
        scheduledAt: new Date(),
        startedAt: new Date(),
      },
    });

    // Simulate task execution
    setTimeout(async () => {
      const duration = Math.random() * 10000 + 2000; // 2-12 seconds
      const success = Math.random() > 0.1; // 90% success rate
      
      await prisma.maintenanceTask.update({
        where: { id: task.id },
        data: {
          status: success ? 'completed' : 'failed',
          completedAt: new Date(),
          duration: Math.round(duration),
          result: success 
            ? `${taskType} completed successfully`
            : `${taskType} failed due to an error`,
          errorMessage: success ? null : 'Simulated error for demo purposes',
        },
      });
    }, 1000);

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'maintenance_task_started',
      resource: 'maintenance_task',
      resourceId: task.id,
      details: { taskType },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(task);
  } catch (error) {
    console.error('Error running maintenance task:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function getTaskName(taskType: string): string {
  switch (taskType) {
    case 'cleanup':
      return 'Database Cleanup';
    case 'sync':
      return 'Force Gmail Sync';
    case 'backup':
      return 'System Backup';
    case 'health_check':
      return 'System Health Check';
    default:
      return `${taskType} Task`;
  }
}

function getTaskDescription(taskType: string): string {
  switch (taskType) {
    case 'cleanup':
      return 'Clean up old logs and temporary data';
    case 'sync':
      return 'Force synchronization with all Gmail accounts';
    case 'backup':
      return 'Create backup of system data and configurations';
    case 'health_check':
      return 'Perform comprehensive system health check';
    default:
      return `Execute ${taskType} maintenance task`;
  }
}
