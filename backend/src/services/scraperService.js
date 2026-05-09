import axios from 'axios';
import cheerio from 'cheerio';

import Story from '../models/Story.js';
import User from '../models/User.js';

const HN_URL = 'https://news.ycombinator.com';

const normalizeUrl = (href) => {
  if (!href) {
    return HN_URL;
  }

  if (href.startsWith('http://') || href.startsWith('https://')) {
    return href;
  }

  return new URL(href, HN_URL).toString();
};

const scrapeAndStoreStories = async () => {
  const response = await axios.get(HN_URL, {
    timeout: 15000,
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; HackerNewsStoryHub/1.0)',
    },
  });

  const $ = cheerio.load(response.data);
  const rows = $('.athing').slice(0, 10);
  const previousStories = await Story.find({}, { _id: 1 }).lean();
  const previousStoryIds = previousStories.map((story) => story._id);
  const stories = [];

  rows.each((index, element) => {
    const row = $(element);
    const subtextRow = row.next();
    const titleLink = row.find('.titleline a').first();
    const scoreText = subtextRow.find('.score').text();
    const author = subtextRow.find('.hnuser').text().trim();
    const postedAt = subtextRow.find('.age').text().trim();
    const title = titleLink.text().trim();
    const url = normalizeUrl(titleLink.attr('href'));
    const points = parseInt(scoreText, 10) || 0;

    if (!title || !author || !postedAt) {
      return;
    }

    stories.push({
      title,
      url,
      points,
      author,
      postedAt,
    });
  });

  await Story.deleteMany({});

  if (previousStoryIds.length > 0) {
    await User.updateMany(
      {},
      {
        $pull: {
          bookmarks: { $in: previousStoryIds },
        },
      }
    );
  }

  if (stories.length === 0) {
    return [];
  }

  const insertedStories = await Story.insertMany(stories, {
    ordered: false,
  });

  return insertedStories;
};

export { scrapeAndStoreStories };