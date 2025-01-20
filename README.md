# Hacker News Real-time Scraping Service

A Node.js service that scrapes Hacker News in real-time, stores stories in MySQL, and broadcasts updates via WebSocket. The service provides real-time updates and statistics about recently published stories.

## Features
- 🔄 Real-time scraping of Hacker News front page every 5 minutes
- 📡 WebSocket streaming of new stories to connected clients
- 💾 MySQL storage for data persistence
- 📊 Initial statistics on stories published in last 5 minutes
- 🔍 Health check endpoint

## Prerequisites
- Node.js (v14 or higher)
- MySQL (v8.0 or higher)
- npm

## Project Structure
```
hacker-news-service/
├── src/
│   ├── config/         # Configuration files
│   ├── services/       # Core services
│   ├── utils/          # Utility functions
│   └── app.js         # Main application file
├── sql/               # SQL initialization scripts
└── package.json
```

## Installation

1. **Clone the Repository**
```bash
git clone https://github.com//hacker-news-service.git
cd hacker-news-service
```

2. **Install Dependencies**
```bash
npm install
```

3. **Database Setup**
```bash
# Log into MySQL
mysql -u root -p

# Run the following commands
CREATE DATABASE hacker_news;
USE hacker_news;

CREATE TABLE stories (
    id VARCHAR(20) PRIMARY KEY,
    title TEXT NOT NULL,
    url TEXT,
    story_rank INT,
    timestamp DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_timestamp ON stories(timestamp);
```

4. **Environment Configuration**
Create a `.env` file in the root directory:
```
PORT=3000
DB_HOST=localhost
DB_USER=your_mysql_username
DB_PASSWORD=your_mysql_password
DB_NAME=hacker_news
```

5. **Start the Service**
```bash
# Development mode
npm run dev

# Production mode
npm start
```

## API Documentation

### WebSocket API

Connect to the WebSocket server at `ws://localhost:3000`

#### Message Types

1. **Initial Connection Response**
```javascript
{
  "type": "initial",
  "count": number // Stories published in last 5 minutes
}
```

2. **Story Updates**
```javascript
{
  "type": "update",
  "stories": [
    {
      "id": string,
      "title": string,
      "url": string,
      "story_rank": number,
      "timestamp": string
    }
  ]
}
```

### REST API Endpoints

#### Health Check
```
GET /health
```
Response:
```json
{
  "status": "ok"
}
```

## WebSocket Client Example

### Node.js
```javascript
const WebSocket = require('ws');
const ws = new WebSocket('ws://localhost:3000');

ws.on('open', () => {
  console.log('Connected to server');
});

ws.on('message', (data) => {
  const parsedData = JSON.parse(data);
  
  if (parsedData.type === 'initial') {
    console.log(`Stories in last 5 minutes: ${parsedData.count}`);
  } else if (parsedData.type === 'update') {
    console.log('New stories:', parsedData.stories);
  }
});

ws.on('error', (error) => {
  console.error('WebSocket error:', error);
});

ws.on('close', () => {
  console.log('Disconnected from server');
});
```

## Configuration Options

The service can be configured through environment variables:

| Variable | Description | Default |
|----------|-------------|---------|
| PORT | Server port | 3000 |
| DB_HOST | MySQL host | localhost |
| DB_USER | MySQL username | root |
| DB_PASSWORD | MySQL password | - |
| DB_NAME | Database name | hacker_news |

## Development

Run in development mode with nodemon:
```bash
npm run dev
```

## Error Handling
The service includes comprehensive error handling:
- Automatic reconnection for WebSocket clients
- Database connection pooling
- Request timeouts
- Logging of all errors

## Logging
Logs are written to:
- `error.log`: Error-level logs
- `combined.log`: All logs
- Console (in development mode)

## Contributing
1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request
