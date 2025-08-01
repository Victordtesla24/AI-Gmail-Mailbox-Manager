
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create test user
  const existingUser = await prisma.user.findUnique({
    where: { email: 'john@doe.com' }
  });

  if (!existingUser) {
    const user = await prisma.user.create({
      data: {
        name: 'John Doe',
        email: 'john@doe.com',
        role: 'admin',
        isActive: true,
      },
    });

    console.log('✅ Created test user:', user.email);
  } else {
    console.log('✅ Test user already exists:', existingUser.email);
  }

  // Create Gmail accounts
  const gmailAccounts = [
    {
      email: 'melbvicduque@gmail.com',
      displayName: 'Melbourne Victoria Duque',
      isConnected: true,
      syncStatus: 'active',
      totalEmails: 1250,
      processedEmails: 1180,
    },
    {
      email: 'sarkar.vikram@gmail.com', 
      displayName: 'Vikram Sarkar',
      isConnected: true,
      syncStatus: 'active',
      totalEmails: 890,
      processedEmails: 850,
    }
  ];

  for (const account of gmailAccounts) {
    const existing = await prisma.gmailAccount.findUnique({
      where: { email: account.email }
    });

    if (!existing) {
      await prisma.gmailAccount.create({ data: account });
      console.log('✅ Created Gmail account:', account.email);
    } else {
      console.log('✅ Gmail account already exists:', account.email);
    }
  }

  // Create workflow status
  const existingWorkflow = await prisma.workflowStatus.findUnique({
    where: { workflowId: '1747c5e50' }
  });

  if (!existingWorkflow) {
    await prisma.workflowStatus.create({
      data: {
        workflowId: '1747c5e50',
        status: 'running',
        executionCount: 156,
        errorCount: 3,
        lastStarted: new Date(),
        configuration: {
          processingInterval: 300,
          maxEmailsPerBatch: 50,
          enableSmartReplies: true,
          notificationsEnabled: true,
        }
      }
    });
    console.log('✅ Created workflow status');
  } else {
    console.log('✅ Workflow status already exists');
  }

  // Create system configurations
  const configs = [
    {
      key: 'processing_interval',
      value: '300',
      description: 'Email processing interval in seconds',
      dataType: 'number',
      category: 'processing'
    },
    {
      key: 'enable_smart_replies',
      value: 'true',
      description: 'Enable AI-generated smart replies',
      dataType: 'boolean',
      category: 'processing'
    },
    {
      key: 'notification_methods',
      value: JSON.stringify(['email', 'sms', 'push']),
      description: 'Enabled notification methods',
      dataType: 'json',
      category: 'notification'
    },
    {
      key: 'classification_threshold',
      value: '0.75',
      description: 'Minimum confidence threshold for email classification',
      dataType: 'number',
      category: 'classification'
    }
  ];

  for (const config of configs) {
    const existing = await prisma.systemConfig.findUnique({
      where: { key: config.key }
    });

    if (!existing) {
      await prisma.systemConfig.create({ data: config });
      console.log('✅ Created system config:', config.key);
    } else {
      console.log('✅ System config already exists:', config.key);
    }
  }

  // Create sample system metrics
  const today = new Date();
  const existingMetrics = await prisma.systemMetrics.findUnique({
    where: { 
      date: new Date(today.getFullYear(), today.getMonth(), today.getDate()) 
    }
  });

  if (!existingMetrics) {
    await prisma.systemMetrics.create({
      data: {
        date: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
        emailsProcessed: 245,
        emailsClassified: 238,
        smartRepliesGenerated: 89,
        notificationsSent: 34,
        averageProcessingTime: 1250.5,
        classificationAccuracy: 96.8,
        systemUptime: 99.2,
        errorRate: 0.8,
      }
    });
    console.log('✅ Created sample system metrics');
  } else {
    console.log('✅ System metrics already exist for today');
  }

  console.log('🎉 Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
