
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

    const gmailAccounts = await prisma.gmailAccount.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json(gmailAccounts);
  } catch (error) {
    console.error('Error fetching Gmail accounts:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
