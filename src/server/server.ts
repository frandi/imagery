import app from './app';
import { config } from './config/env.config';

const PORT = config.port;

const server = app.listen(PORT, () => {
  console.log(`
╔════════════════════════════════════════╗
║       IMAGERY SERVER RUNNING           ║
╠════════════════════════════════════════╣
║  Environment: ${config.env.padEnd(24)} ║
║  Port:        ${PORT.toString().padEnd(24)} ║
║  API:         http://localhost:${PORT}/api ║
╚════════════════════════════════════════╝
  `);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('SIGINT signal received: closing HTTP server');
  server.close(() => {
    console.log('HTTP server closed');
    process.exit(0);
  });
});

export default server;
