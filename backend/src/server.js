import dotenv from 'dotenv';

import app from './app.js';
import connectDB from './config/db.js';
import { scrapeAndStoreStories } from './services/scraperService.js';

dotenv.config();

const port = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(port, async () => {
      console.log(`Server running on port ${port}`);

      try {
        await scrapeAndStoreStories();
        console.log('Initial Hacker News scrape completed');
      } catch (error) {
        console.error('Initial scrape failed:', error.message);
      }
    });
  } catch (error) {
    console.error('Server startup failed:', error.message);
    process.exit(1);
  }
};

startServer();