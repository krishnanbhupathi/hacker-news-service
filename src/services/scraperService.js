const axios = require('axios');
const cheerio = require('cheerio');
const { HN_BASE_URL } = require('../config/constants');
const logger = require('../utils/logger');

class ScraperService {
  async scrapeStories() {
    try {
      const response = await axios.get(HN_BASE_URL);
      const $ = cheerio.load(response.data);
      const stories = [];

      $('.athing').each((i, element) => {
        const id = $(element).attr('id');
        const title = $(element).find('.titleline > a').first().text();
        const url = $(element).find('.titleline > a').first().attr('href');
        const story_rank = $(element).find('.rank').text().replace('.', '');

        // Create timestamp in IST
        const now = new Date();
        const istTime = new Date(now.getTime() + (5.5 * 60 * 60 * 1000)); // Add 5 hours and 30 minutes for IST

        stories.push({
          id,
          title,
          url,
          story_rank,
          timestamp: istTime
        });
      });

      return stories;
    } catch (error) {
      logger.error('Error scraping Hacker News:', error);
      return [];
    }
  }
}

module.exports = new ScraperService();