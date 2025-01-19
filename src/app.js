require('dotenv').config();
const express = require('express');
const http = require('http');
const { PORT, SCRAPE_INTERVAL } = require('./config/constants');
const scraperService = require('./services/scraperService');
const websocketService = require('./services/websocketService');
const databaseService = require('./services/databaseService');
const logger = require('./utils/logger');

const app = express();
const server = http.createServer(app);

// Initialize WebSocket service
websocketService.initialize(server);

// Start periodic scraping
async function runScraper() {
  const stories = await scraperService.scrapeStories();
  if (stories.length > 0) {
    await databaseService.saveStories(stories);
    websocketService.broadcastUpdates(stories);
  }
}

// Initial scrape
runScraper();

// Set up periodic scraping
setInterval(runScraper, SCRAPE_INTERVAL);

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok' });
});

// Start server
server.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

// Error handling
process.on('unhandledRejection', (error) => {
  logger.error('Unhandled rejection:', error);
});

process.on('uncaughtException', (error) => {
  logger.error('Uncaught exception:', error);
  process.exit(1);
});

const mysql = require('mysql2/promise');
const dbConfig = require('./config/database');

async function testConnection() {
  try {
    const connection = await mysql.createConnection({
      host: dbConfig.host,
      user: dbConfig.user,
      password: dbConfig.password
    });
    console.log('Successfully connected to MySQL');
    await connection.end();
  } catch (error) {
    console.error('Error connecting to MySQL:', error);
  }
}

testConnection();

