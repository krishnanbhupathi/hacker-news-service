const mysql = require('mysql2/promise');
const dbConfig = require('../config/database');
const logger = require('../utils/logger');

class DatabaseService {
  constructor() {
    this.pool = mysql.createPool(dbConfig);
  }

  async getRecentStoriesCount() {
    try {
      const [rows] = await this.pool.execute(
        `SELECT COUNT(*) as count
         FROM stories
         WHERE timestamp > DATE_SUB(CONVERT_TZ(NOW(), 'UTC', '+05:30'), INTERVAL 5 MINUTE)`
      );
      return rows[0].count;
    } catch (error) {
      logger.error('Error getting recent stories count:', error);
      return 0;
    }
  }

  async saveStories(stories) {
    const connection = await this.pool.getConnection();
    try {
      await connection.beginTransaction();

      for (const story of stories) {
        await connection.execute(
          `INSERT IGNORE INTO stories
           (id, title, url, story_rank, timestamp)
           VALUES (?, ?, ?, ?, ?)`,
          [story.id, story.title, story.url, story.story_rank, story.timestamp]
        );
      }

      await connection.commit();
    } catch (error) {
      await connection.rollback();
      logger.error('Error saving stories:', error);
    } finally {
      connection.release();
    }
  }
}

// Create and export an instance of the class
const databaseService = new DatabaseService();
module.exports = databaseService;