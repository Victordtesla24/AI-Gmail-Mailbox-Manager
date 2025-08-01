
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { encrypt } from '@/lib/encryption';
import { createAuditLog } from '@/lib/audit';

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const apiKeys = await prisma.apiKey.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // Don't return the actual encrypted keys in the list
    const sanitizedKeys = apiKeys.map(key => ({
      ...key,
      encryptedKey: key.encryptedKey // This will be handled by the frontend for display
    }));

    return NextResponse.json(sanitizedKeys);
  } catch (error) {
    console.error('Error fetching API keys:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { service, keyName, apiKey, description } = await request.json();

    if (!service || !keyName || !apiKey) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if a key with the same service and name already exists
    const existingKey = await prisma.apiKey.findUnique({
      where: {
        userId_service_keyName: {
          userId: session.user.id,
          service,
          keyName,
        },
      },
    });

    if (existingKey) {
      return NextResponse.json({ error: 'API key with this name already exists for this service' }, { status: 400 });
    }

    // Encrypt the API key
    const encryptedKey = encrypt(apiKey);

    const newApiKey = await prisma.apiKey.create({
      data: {
        userId: session.user.id,
        service,
        keyName,
        encryptedKey,
        isActive: true,
      },
    });

    // Create audit log
    await createAuditLog({
      userId: session.user.id,
      action: 'api_key_created',
      resource: 'api_key',
      resourceId: newApiKey.id,
      details: { service, keyName },
      ipAddress: request.headers.get('x-forwarded-for') || 'unknown',
      userAgent: request.headers.get('user-agent') || 'unknown',
    });

    return NextResponse.json({
      id: newApiKey.id,
      service: newApiKey.service,
      keyName: newApiKey.keyName,
      isActive: newApiKey.isActive,
      createdAt: newApiKey.createdAt,
      updatedAt: newApiKey.updatedAt,
    }, { status: 201 });
  } catch (error) {
    console.error('Error creating API key:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
