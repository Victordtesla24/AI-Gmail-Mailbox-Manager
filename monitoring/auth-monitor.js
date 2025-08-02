#!/usr/bin/env node

const fs = require('fs');
const { spawn } = require('child_process');

// Enhanced authentication monitoring
const authLogFile = '/tmp/auth.log';
const productionLogFile = '/tmp/production.log';

// Create auth log file if it doesn't exist
if (!fs.existsSync(authLogFile)) {
    fs.writeFileSync(authLogFile, '');
}

console.log('🔐 Starting Authentication Monitor...');
console.log('📊 Monitoring production logs for auth events...');
console.log('🌐 Production URL: https://six-suns-fold.loca.lt');
console.log('📈 Monitoring Dashboard: http://localhost:3002');

// Monitor production logs for authentication events
const tail = spawn('tail', ['-f', productionLogFile]);

tail.stdout.on('data', (data) => {
    const logLine = data.toString();
    const timestamp = new Date().toISOString();
    
    // Check for authentication-related events
    if (isAuthEvent(logLine)) {
        const authLog = `[${timestamp}] AUTH_EVENT: ${logLine.trim()}\n`;
        fs.appendFileSync(authLogFile, authLog);
        console.log(`🔐 ${authLog.trim()}`);
    }
    
    // Check for errors
    if (isErrorEvent(logLine)) {
        const errorLog = `[${timestamp}] ERROR: ${logLine.trim()}\n`;
        fs.appendFileSync(authLogFile, errorLog);
        console.log(`❌ ${errorLog.trim()}`);
    }
    
    // Check for API calls
    if (isApiEvent(logLine)) {
        const apiLog = `[${timestamp}] API: ${logLine.trim()}\n`;
        fs.appendFileSync(authLogFile, apiLog);
        console.log(`📡 ${apiLog.trim()}`);
    }
});

tail.stderr.on('data', (data) => {
    console.error(`Tail error: ${data}`);
});

function isAuthEvent(logLine) {
    const authPatterns = [
        /auth/i,
        /login/i,
        /signin/i,
        /session/i,
        /credential/i,
        /nextauth/i,
        /jwt/i,
        /token/i
    ];
    
    return authPatterns.some(pattern => pattern.test(logLine));
}

function isErrorEvent(logLine) {
    const errorPatterns = [
        /error/i,
        /err/i,
        /fail/i,
        /exception/i,
        /500/,
        /404/,
        /unauthorized/i,
        /forbidden/i
    ];
    
    return errorPatterns.some(pattern => pattern.test(logLine));
}

function isApiEvent(logLine) {
    const apiPatterns = [
        /GET \/api/,
        /POST \/api/,
        /PUT \/api/,
        /DELETE \/api/,
        /api\/auth/,
        /callback/,
        /providers/,
        /csrf/
    ];
    
    return apiPatterns.some(pattern => pattern.test(logLine));
}

// Monitor network requests to production URL
setInterval(async () => {
    try {
        const { spawn } = require('child_process');
        const curl = spawn('curl', ['-s', '-I', 'https://six-suns-fold.loca.lt']);
        
        curl.stdout.on('data', (data) => {
            const response = data.toString();
            if (response.includes('200 OK')) {
                const timestamp = new Date().toISOString();
                const healthLog = `[${timestamp}] HEALTH_CHECK: Production URL responding - 200 OK\n`;
                fs.appendFileSync(authLogFile, healthLog);
            }
        });
    } catch (error) {
        const timestamp = new Date().toISOString();
        const errorLog = `[${timestamp}] HEALTH_CHECK_ERROR: ${error.message}\n`;
        fs.appendFileSync(authLogFile, errorLog);
    }
}, 30000); // Check every 30 seconds

// Graceful shutdown
process.on('SIGTERM', () => {
    console.log('🛑 Stopping authentication monitor...');
    tail.kill();
    process.exit(0);
});

process.on('SIGINT', () => {
    console.log('🛑 Stopping authentication monitor...');
    tail.kill();
    process.exit(0);
});
