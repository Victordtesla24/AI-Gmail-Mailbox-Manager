
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

    const { searchParams } = new URL(request.url);
    const range = searchParams.get('range') || '7d';

    // Calculate date range based on the range parameter
    const now = new Date();
    let startDate = new Date();
    
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(now.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(now.getDate() - 90);
        break;
      default:
        startDate.setDate(now.getDate() - 7);
    }

    // Get email processing metrics
    const emailLogs = await prisma.emailProcessingLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });

    const totalEmails = emailLogs.length;
    const processedEmails = emailLogs.filter(log => log.processed).length;
    const smartReplies = emailLogs.filter(log => log.replyGenerated).length;
    const avgProcessingTime = emailLogs
      .filter(log => log.processingTime)
      .reduce((sum, log) => sum + (log.processingTime || 0), 0) / emailLogs.filter(log => log.processingTime).length || 0;

    // Get classification accuracy
    const classifiedEmails = emailLogs.filter(log => log.classification && log.confidence);
    const avgAccuracy = classifiedEmails.length > 0 
      ? classifiedEmails.reduce((sum, log) => sum + (log.confidence || 0), 0) / classifiedEmails.length * 100
      : 0;

    // Get error rate
    const errorLogs = await prisma.errorLog.findMany({
      where: {
        createdAt: {
          gte: startDate,
        },
      },
    });
    const errorRate = totalEmails > 0 ? (errorLogs.length / totalEmails) * 100 : 0;

    // System uptime (mock data)
    const uptime = 99.7;
    const throughput = totalEmails / ((now.getTime() - startDate.getTime()) / (1000 * 60 * 60)); // emails per hour

    const metrics = {
      totalEmails,
      processedEmails,
      avgAccuracy: Math.round(avgAccuracy * 10) / 10,
      avgResponseTime: Math.round(avgProcessingTime),
      smartReplies,
      errorRate: Math.round(errorRate * 10) / 10,
      uptime,
      throughput: Math.round(throughput * 10) / 10,
    };

    return NextResponse.json(metrics);
  } catch (error) {
    console.error('Error fetching analytics:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
