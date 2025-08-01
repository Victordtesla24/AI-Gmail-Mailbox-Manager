
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/encryption';
import { createAuditLog } from '@/lib/audit';

export const dynamic = "force-dynamic";

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { keyName, apiKey } = await request.json();
    const keyId = params.id;

    // Verify the API key belongs to the user
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: session.user.id,
      },
    });

    if (!existingKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    const updateData: any = {
      updatedAt: new Date(),
    };

    if (keyName && keyName !== existingKey.keyName) {
      updateData.keyName = keyName;
    }

    if (apiKey) {
      updateData.encryptedKey = encrypt(apiKey);
    }

    const updatedKey = await prisma.apiKey.update({
      where: { id: keyId },
      data: updateData,
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'api_key_updated',
      resource: 'api_key',
      resourceId: keyId,
      details: { service: updatedKey.service, keyName: updatedKey.keyName },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      id: updatedKey.id,
      service: updatedKey.service,
      keyName: updatedKey.keyName,
      isActive: updatedKey.isActive,
      createdAt: updatedKey.createdAt,
      updatedAt: updatedKey.updatedAt,
    });
  } catch (error) {
    console.error('Error updating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const keyId = params.id;

    // Verify the API key belongs to the user
    const existingKey = await prisma.apiKey.findFirst({
      where: {
        id: keyId,
        userId: session.user.id,
      },
    });

    if (!existingKey) {
      return NextResponse.json({ error: 'API key not found' }, { status: 404 });
    }

    await prisma.apiKey.delete({
      where: { id: keyId },
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'api_key_deleted',
      resource: 'api_key',
      resourceId: keyId,
      details: { service: existingKey.service, keyName: existingKey.keyName },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({ message: 'API key deleted successfully' });
  } catch (error) {
    console.error('Error deleting API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
