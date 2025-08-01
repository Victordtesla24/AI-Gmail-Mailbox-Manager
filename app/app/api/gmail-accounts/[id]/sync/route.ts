
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

    const accountId = params.id;

    const account = await prisma.gmailAccount.findUnique({
      where: { id: accountId },
    });

    if (!account) {
      return NextResponse.json({ error: 'Account not found' }, { status: 404 });
    }

    // Simulate sync operation
    const updatedAccount = await prisma.gmailAccount.update({
      where: { id: accountId },
      data: {
        lastSyncAt: new Date(),
        syncStatus: 'active',
        errorMessage: null,
        // Simulate processing some emails
        processedEmails: account.processedEmails + Math.floor(Math.random() * 20) + 5,
        updatedAt: new Date(),
      },
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'gmail_account_sync',
      resource: 'gmail_account',
      resourceId: accountId,
      details: { email: account.email },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json(updatedAccount);
  } catch (error) {
    console.error('Error syncing Gmail account:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
