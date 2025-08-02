# 🤖 AI Gmail Mailbox Manager

[![GitHub license](https://img.shields.io/github/license/Victordtesla24/AI-Gmail-Mailbox-Manager)](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/blob/main/LICENSE)
[![GitHub stars](https://img.shields.io/github/stars/Victordtesla24/AI-Gmail-Mailbox-Manager)](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/stargazers)
[![GitHub issues](https://img.shields.io/github/issues/Victordtesla24/AI-Gmail-Mailbox-Manager)](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/issues)
[![GitHub forks](https://img.shields.io/github/forks/Victordtesla24/AI-Gmail-Mailbox-Manager)](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/network)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.28-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

> 🚀 **Fully automated & autonomous AI-driven Gmail mailbox management system** with intelligent email processing, smart replies, and comprehensive workflow automation.

## 📋 Table of Contents

- [✨ Features](#-features)
- [🏗️ Architecture](#️-architecture)
- [🛠️ Tech Stack](#️-tech-stack)
- [📋 Prerequisites](#-prerequisites)
- [⚡ Quick Start](#-quick-start)
- [🔧 Installation](#-installation)
- [⚙️ Configuration](#️-configuration)
- [🚀 Usage](#-usage)
- [📚 API Documentation](#-api-documentation)
- [🖥️ UI Features](#️-ui-features)
- [🔒 Security](#-security)
- [📊 Monitoring](#-monitoring)
- [🤝 Contributing](#-contributing)
- [📝 License](#-license)
- [💬 Support](#-support)

## ✨ Features

### 🧠 **AI-Powered Intelligence**
- **Smart Email Classification**: Automatically categorize emails (work, personal, promotions, spam)
- **Intelligent Replies**: Generate contextual responses using advanced AI
- **Sentiment Analysis**: Analyze email tone and prioritize accordingly
- **Auto-Summarization**: Generate concise summaries for long email threads

### 🔄 **Automation & Workflow**
- **Autonomous Processing**: Fully automated email handling every hour
- **Smart Filtering**: Advanced rule-based email organization
- **Batch Operations**: Process multiple emails efficiently
- **Scheduled Tasks**: Automated maintenance and cleanup

### 📧 **Email Management**
- **Multi-Account Support**: Manage multiple Gmail accounts simultaneously
- **Smart Labeling**: Automatic email categorization and tagging
- **Priority Detection**: Identify and highlight important emails
- **Thread Management**: Intelligent conversation threading

### 🔔 **Notification System**
- **Multi-Channel Alerts**: SMS, push notifications, and email alerts
- **Custom Rules**: Set personalized notification preferences
- **Priority Notifications**: Immediate alerts for critical emails
- **Digest Reports**: Daily/weekly email summaries

### 📊 **Analytics & Insights**
- **Email Metrics**: Track email volume, response times, and patterns
- **Performance Analytics**: Monitor system efficiency and accuracy
- **Trend Analysis**: Identify email patterns and behaviors
- **Custom Dashboards**: Personalized reporting views

### 🛡️ **Security & Privacy**
- **OAuth 2.0 Authentication**: Secure Gmail API access
- **2FA Support**: Enhanced security with two-factor authentication
- **Data Encryption**: End-to-end encryption for sensitive data
- **Privacy Controls**: Granular permission management

## 🏗️ Architecture

```mermaid
graph TB
    A[Gmail API] --> B[Email Processor]
    B --> C[AI Classifier]
    C --> D[Smart Reply Generator]
    D --> E[Notification System]
    E --> F[Analytics Engine]
    F --> G[Web Dashboard]
    B --> H[Database]
    H --> G
```

### **Core Components**
- **Frontend**: Next.js 14 with TypeScript and Tailwind CSS
- **Backend**: Node.js with Next.js API routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with OAuth 2.0
- **AI Integration**: Abacus.AI for intelligent processing
- **Monitoring**: Real-time system monitoring and logging

## 🛠️ Tech Stack

### **Frontend**
- ![Next.js](https://img.shields.io/badge/Next.js-14.2.28-black?logo=next.js&logoColor=white) **Next.js 14** - React framework with App Router
- ![TypeScript](https://img.shields.io/badge/TypeScript-5.2.2-3178C6?logo=typescript&logoColor=white) **TypeScript** - Type-safe development
- ![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-3.3.3-06B6D4?logo=tailwindcss&logoColor=white) **Tailwind CSS** - Utility-first styling
- ![Radix UI](https://img.shields.io/badge/Radix%20UI-Latest-8B5CF6?logo=radixui&logoColor=white) **Radix UI** - Accessible components

### **Backend**
- ![Node.js](https://img.shields.io/badge/Node.js-Latest-339933?logo=node.js&logoColor=white) **Node.js** - JavaScript runtime
- ![Prisma](https://img.shields.io/badge/Prisma-6.7.0-2D3748?logo=prisma&logoColor=white) **Prisma** - Database ORM
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-4169E1?logo=postgresql&logoColor=white) **PostgreSQL** - Primary database
- ![NextAuth.js](https://img.shields.io/badge/NextAuth.js-4.24.11-purple?logo=next.js&logoColor=white) **NextAuth.js** - Authentication

### **External Services**
- ![Gmail API](https://img.shields.io/badge/Gmail%20API-Latest-EA4335?logo=gmail&logoColor=white) **Gmail API** - Email access
- [![Abacus.AI](https://img.shields.io/badge/Powered%20by-Abacus.AI-FF6B35)](https://abacus.ai)
- ![SMS API](https://img.shields.io/badge/SMS%20API-Latest-00D4AA?logoColor=white) **SMS Services** - Notifications

## 📋 Prerequisites

Before installing, ensure you have:

- ![Node.js](https://img.shields.io/badge/Node.js-v18.0+-339933?logo=node.js&logoColor=white) **Node.js 18.0+**
- ![npm](https://img.shields.io/badge/npm-v9.0+-CB3837?logo=npm&logoColor=white) **npm 9.0+** or ![Yarn](https://img.shields.io/badge/Yarn-v1.22+-2C8EBB?logo=yarn&logoColor=white) **Yarn 1.22+**
- ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-v14+-4169E1?logo=postgresql&logoColor=white) **PostgreSQL 14+**
- ![Git](https://img.shields.io/badge/Git-Latest-F05032?logo=git&logoColor=white) **Git**

### **Required API Keys**
- **Gmail API credentials** (OAuth 2.0)
- **Abacus.AI API key** (for AI processing)
- **SMS service credentials** (optional, for SMS notifications)

## ⚡ Quick Start

Get up and running in under 5 minutes:

```bash
# 1. Clone the repository
git clone https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager.git
cd AI-Gmail-Mailbox-Manager

# 2. Navigate to app directory
cd app

# 3. Install dependencies
npm install

# 4. Set up environment variables
cp .env.example .env.local
# Edit .env.local with your credentials

# 5. Set up the database
npx prisma migrate dev
npx prisma db seed

# 6. Start development server
npm run dev
```

🎉 **That's it!** Open [http://localhost:3000](http://localhost:3000) to see your application.

## 🔧 Installation

### **1. Clone the Repository**
```bash
git clone https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager.git
cd AI-Gmail-Mailbox-Manager/app
```

### **2. Install Dependencies**
```bash
# Using npm
npm install

# Using yarn
yarn install

# Using pnpm
pnpm install
```

### **3. Database Setup**
```bash
# Initialize Prisma
npx prisma generate

# Run migrations
npx prisma migrate dev --name init

# Seed the database (optional)
npx prisma db seed
```

### **4. Environment Configuration**
Create a `.env.local` file in the `app` directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/gmail_manager"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-nextauth-secret"

# Gmail API
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Abacus.AI
ABACUSAI_API_KEY="your-abacus-ai-api-key"

# Optional: SMS Notifications
SMS_API_KEY="your-sms-api-key"
SMS_API_SECRET="your-sms-api-secret"
```

## ⚙️ Configuration

### **Gmail API Setup**

1. **Google Cloud Console**:
   - Create a new project or select existing
   - Enable Gmail API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs

2. **OAuth Scopes Required**:
   ```
   https://www.googleapis.com/auth/gmail.readonly
   https://www.googleapis.com/auth/gmail.send
   https://www.googleapis.com/auth/gmail.modify
   ```

3. **Redirect URIs**:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google
   ```

### **Database Configuration**

```sql
-- Example PostgreSQL setup
CREATE DATABASE gmail_manager;
CREATE USER gmail_user WITH ENCRYPTED PASSWORD 'secure_password';
GRANT ALL PRIVILEGES ON DATABASE gmail_manager TO gmail_user;
```

### **Abacus.AI Integration**

1. Sign up at [Abacus.AI](https://abacus.ai)
2. Create an API key with appropriate permissions
3. Configure the AI models for:
   - Email classification
   - Smart reply generation
   - Sentiment analysis

## 🚀 Usage

### **Development**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # Run TypeScript check
```

### **Production Deployment**

#### **Using Vercel** (Recommended)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod
```

#### **Using Docker**
```bash
# Build image
docker build -t gmail-manager .

# Run container
docker run -p 3000:3000 gmail-manager
```

#### **Using PM2**
```bash
# Install PM2
npm install -g pm2

# Build and start
npm run build
pm2 start npm --name "gmail-manager" -- start
```

## 📚 API Documentation

### **Authentication Endpoints**

#### `POST /api/auth/signin`
Initiate user authentication
```typescript
// Request
{
  "email": "user@example.com",
  "password": "securepassword"
}

// Response
{
  "user": { "id": "123", "email": "user@example.com" },
  "token": "jwt-token"
}
```

### **Email Processing Endpoints**

#### `GET /api/emails`
Retrieve processed emails
```typescript
// Query Parameters
?page=1&limit=20&category=work&priority=high

// Response
{
  "emails": [...],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "pages": 8
  }
}
```

#### `POST /api/emails/process`
Manually trigger email processing
```typescript
// Request
{
  "accountId": "gmail-account-id",
  "forceSync": true
}

// Response
{
  "processed": 25,
  "classified": 23,
  "errors": 2,
  "duration": "00:02:15"
}
```

### **Analytics Endpoints**

#### `GET /api/analytics/dashboard`
Get dashboard analytics
```typescript
// Response
{
  "totalEmails": 1500,
  "processedToday": 45,
  "averageResponseTime": "2.5 hours",
  "categories": {
    "work": 60,
    "personal": 25,
    "promotions": 15
  }
}
```

## 🖥️ UI Features

### **Dashboard Overview**
- 📊 **Real-time metrics** and email statistics
- 📈 **Interactive charts** showing email trends
- 🎯 **Quick actions** for common tasks
- ⚡ **Live updates** with real-time notifications

### **Email Management**
- 📧 **Email list view** with smart filtering
- 🏷️ **Automatic categorization** and labeling
- ⭐ **Priority indicators** for important emails
- 🔍 **Advanced search** with AI-powered suggestions

### **Settings & Configuration**
- ⚙️ **Account management** for multiple Gmail accounts
- 🔔 **Notification preferences** and custom rules
- 🤖 **AI model configuration** and fine-tuning
- 📊 **Analytics customization** and report settings

### **Monitoring & Logs**
- 📈 **System performance** metrics
- 📋 **Processing logs** with detailed information
- 🚨 **Error tracking** and alerting
- 📊 **Usage analytics** and insights

## 🔒 Security

### **Authentication & Authorization**
- 🔐 **OAuth 2.0** integration with Google
- 🛡️ **JWT tokens** for session management
- 🔑 **Two-factor authentication** support
- 👤 **Role-based access control**

### **Data Protection**
- 🔒 **End-to-end encryption** for sensitive data
- 🗃️ **Secure database** connections
- 🔐 **API key encryption** and rotation
- 📋 **Audit logging** for all operations

### **Privacy Compliance**
- 📜 **GDPR compliance** with data portability
- 🇺🇸 **CCPA compliance** for California users
- 🗑️ **Data retention** policies
- 📊 **Privacy dashboard** for user control

## 📊 Monitoring

### **System Metrics**
- ⚡ **Performance monitoring** with real-time dashboards
- 📈 **Usage analytics** and trend analysis
- 🚨 **Error tracking** and automated alerting
- 📊 **Custom metrics** and KPI tracking

### **Health Checks**
```bash
# API health endpoint
curl http://localhost:3000/api/health

# Database connectivity
curl http://localhost:3000/api/health/database

# External services
curl http://localhost:3000/api/health/services
```

### **Logging**
- 📋 **Structured logging** with JSON format
- 🔍 **Log aggregation** and search capabilities
- 📊 **Log analytics** and pattern detection
- 🚨 **Automated alerting** on critical errors

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### **Development Workflow**

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Make your changes** with proper tests
4. **Run the test suite**: `npm test`
5. **Commit your changes**: `git commit -m 'Add amazing feature'`
6. **Push to the branch**: `git push origin feature/amazing-feature`
7. **Open a Pull Request**

### **Code Standards**
- ✅ **TypeScript** for all new code
- 📏 **ESLint** and **Prettier** for code formatting
- 🧪 **Jest** for unit testing
- 📖 **JSDoc** for documentation
- 🔄 **Conventional commits** for commit messages

### **Testing**
```bash
npm test              # Run all tests
npm run test:watch    # Run tests in watch mode
npm run test:coverage # Generate coverage report
npm run test:e2e      # Run end-to-end tests
```

## 📝 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 AI Gmail Mailbox Manager

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

## 💬 Support

### **Getting Help**
- 📚 **Documentation**: [Full documentation](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/wiki)
- 🐛 **Bug Reports**: [Create an issue](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/issues/new?template=bug_report.md)
- 💡 **Feature Requests**: [Request a feature](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/issues/new?template=feature_request.md)
- 💬 **Discussions**: [GitHub Discussions](https://github.com/Victordtesla24/AI-Gmail-Mailbox-Manager/discussions)

### **Community**
- 🌟 **Star this repo** if you find it helpful
- 🍴 **Fork and contribute** to make it better
- 📢 **Share with others** who might benefit
- 🐦 **Follow updates** on social media

### **Enterprise Support**
For enterprise support, custom development, or professional services, please contact:
- 📧 **Email**: support@ai-gmail-manager.com
- 🌐 **Website**: [ai-gmail-manager.com](https://ai-gmail-manager.com)
- 💼 **LinkedIn**: [AI Gmail Manager](https://linkedin.com/company/ai-gmail-manager)

---

<div align="center">

**Made with ❤️ by the AI Gmail Manager Team**

[![GitHub](https://img.shields.io/badge/GitHub-Victordtesla24-181717?logo=github)](https://github.com/Victordtesla24)
[[![Abacus.AI](https://img.shields.io/badge/Powered%20by-Abacus.AI-FF6B35)](https://abacus.ai)

*Building the future of intelligent email management, one algorithm at a time.*

</div>
