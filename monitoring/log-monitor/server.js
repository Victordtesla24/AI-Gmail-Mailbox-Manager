
const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const fs = require('fs');
const path = require('path');
const { Tail } = require('tail');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

const PORT = 3002;

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Log files to monitor
const logFiles = [
  '/tmp/localtunnel.log',
  '/tmp/production.log',
  '/tmp/auth.log',
  '/tmp/nextjs.log'
];

// Store active tails
const tails = {};

// Initialize log monitoring
function initializeLogMonitoring() {
  logFiles.forEach(logFile => {
    if (fs.existsSync(logFile)) {
      const tail = new Tail(logFile);
      tails[logFile] = tail;
      
      tail.on('line', (data) => {
        const logEntry = {
          file: path.basename(logFile),
          timestamp: new Date().toISOString(),
          message: data,
          level: detectLogLevel(data)
        };
        
        io.emit('log', logEntry);
        
        // Check for critical events
        if (isCriticalEvent(data)) {
          io.emit('alert', {
            type: 'critical',
            message: data,
            file: path.basename(logFile),
            timestamp: new Date().toISOString()
          });
        }
      });
      
      tail.on('error', (error) => {
        console.error('Tail error:', error);
      });
    }
  });
}

function detectLogLevel(message) {
  const msg = message.toLowerCase();
  if (msg.includes('error') || msg.includes('err') || msg.includes('fail')) return 'error';
  if (msg.includes('warn')) return 'warning';
  if (msg.includes('auth') || msg.includes('login')) return 'auth';
  return 'info';
}

function isCriticalEvent(message) {
  const criticalPatterns = [
    /authentication failed/i,
    /login error/i,
    /session error/i,
    /database error/i,
    /server error/i,
    /500/,
    /404.*auth/i
  ];
  
  return criticalPatterns.some(pattern => pattern.test(message));
}

// Socket connection handling
io.on('connection', (socket) => {
  console.log('Client connected for log monitoring');
  
  // Send recent logs on connection
  logFiles.forEach(logFile => {
    if (fs.existsSync(logFile)) {
      try {
        const recentLogs = fs.readFileSync(logFile, 'utf8')
          .split('\n')
          .slice(-50)
          .filter(line => line.trim())
          .map(line => ({
            file: path.basename(logFile),
            timestamp: new Date().toISOString(),
            message: line,
            level: detectLogLevel(line)
          }));
        
        socket.emit('initial-logs', recentLogs);
      } catch (error) {
        console.error('Error reading log file:', error);
      }
    }
  });
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from log monitoring');
  });
});

// API endpoints
app.get('/api/status', (req, res) => {
  res.json({
    status: 'running',
    monitored_files: logFiles.filter(file => fs.existsSync(file)),
    active_tails: Object.keys(tails).length
  });
});

app.get('/api/logs/:file', (req, res) => {
  const filename = req.params.file;
  const filepath = `/tmp/${filename}`;
  
  if (fs.existsSync(filepath)) {
    const logs = fs.readFileSync(filepath, 'utf8')
      .split('\n')
      .slice(-100)
      .filter(line => line.trim());
    res.json(logs);
  } else {
    res.status(404).json({ error: 'Log file not found' });
  }
});

// Start server
server.listen(PORT, () => {
  console.log(`Log monitoring server running on port ${PORT}`);
  initializeLogMonitoring();
});

// Graceful shutdown
process.on('SIGTERM', () => {
  Object.values(tails).forEach(tail => tail.unwatch());
  server.close();
});
