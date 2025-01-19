const WebSocket = require('ws');
const logger = require('../utils/logger');

class WebSocketService {
  constructor() {
    this.wss = null;
  }

  initialize(server) {
    this.wss = new WebSocket.Server({ server });
    this.setupWebSocketHandlers();
  }

  setupWebSocketHandlers() {
    this.wss.on('connection', async (ws) => {
      logger.info('Client connected');

      ws.on('error', (error) => logger.error('WebSocket error:', error));
      ws.on('close', () => logger.info('Client disconnected'));
    });
  }


  formatTimestamp(date) {
    return date.toLocaleString('en-US', {
      timeZone: 'Asia/Kolkata',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }

  broadcastUpdates(stories) {
    if (!this.wss) return;

    const formattedStories = stories.map(story => ({
      ...story,
      timestamp: this.formatTimestamp(story.timestamp)
    }));

    this.wss.clients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify({
          type: 'update',
          stories: formattedStories
        }));
      }
    });
  }
}

module.exports = new WebSocketService();

