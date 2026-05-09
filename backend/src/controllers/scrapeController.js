import asyncHandler from '../utils/asyncHandler.js';
import { scrapeAndStoreStories } from '../services/scraperService.js';

const triggerScrape = asyncHandler(async (_req, res) => {
  const stories = await scrapeAndStoreStories();

  res.json({
    status: 'success',
    message: 'Stories scraped successfully',
    count: stories.length,
    stories,
  });
});

export { triggerScrape };