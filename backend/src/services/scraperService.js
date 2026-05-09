import axios from "axios";
import * as cheerio from "cheerio";
import Story from "../models/Story.js";

const HN_URL = "https://news.ycombinator.com";

const normalizeUrl = (href) => {
  if (!href) {
    return HN_URL;
  }

  if (href.startsWith("http://") || href.startsWith("https://")) {
    return href;
  }

  try {
    return new URL(href, HN_URL).toString();
  } catch (_error) {
    console.warn(`Failed to normalize URL: ${href}`);
    return HN_URL;
  }
};

const validateStoryData = (story) => {
  if (!story.title || story.title.trim().length === 0) return false;
  if (!story.author || story.author.trim().length === 0) return false;
  if (!story.postedAt || story.postedAt.trim().length === 0) return false;
  return true;
};

const upsertStories = async (stories) => {
  const upsertedStories = [];
  const errors = [];

  for (const story of stories) {
    try {
      const upserted = await Story.findOneAndUpdate(
        { url: story.url },
        { $set: story },
        { upsert: true, returnDocument: "after" },
      );
      upsertedStories.push(upserted);
    } catch (error) {
      errors.push({ story, error: error.message });
      console.error(`Failed to upsert story ${story.url}:`, error.message);
    }
  }

  if (errors.length > 0) {
    console.warn(`[Scraper] ${errors.length} story(ies) failed to upsert`);
  }

  return upsertedStories;
};

const cleanupOldStories = async (currentUrls) => {
  try {
    const result = await Story.deleteMany({
      url: { $nin: currentUrls },
    });

    if (result.deletedCount > 0) {
      console.log(
        `[Scraper] Cleaned up ${result.deletedCount} outdated story(ies)`,
      );
    }

    return result.deletedCount;
  } catch (error) {
    console.error("[Scraper] Failed to cleanup old stories:", error.message);
    return 0;
  }
};

const scrapeAndStoreStories = async () => {
  try {
    console.log("[Scraper] Starting Hacker News scrape...");

    const response = await axios.get(HN_URL, {
      timeout: 15000,
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; HackerNewsStoryHub/1.0)",
      },
    });

    const $ = cheerio.load(response.data);
    const rows = $(".athing").slice(0, 10);
    const stories = [];

    rows.each((_index, element) => {
      const row = $(element);
      const subtextRow = row.next();
      const titleLink = row.find(".titleline a").first();
      const scoreText = subtextRow.find(".score").text();
      const author = subtextRow.find(".hnuser").text().trim();
      const postedAt = subtextRow.find(".age").text().trim();
      const title = titleLink.text().trim();
      const url = normalizeUrl(titleLink.attr("href"));
      const points = parseInt(scoreText, 10) || 0;

      const story = {
        title,
        url,
        points,
        author,
        postedAt,
      };

      if (!validateStoryData(story)) {
        console.warn("[Scraper] Skipping invalid story", story);
        return;
      }

      stories.push(story);
    });

    if (stories.length === 0) {
      console.warn("[Scraper] No valid stories found in scrape");
      return [];
    }

    console.log(`[Scraper] Found ${stories.length} valid story(ies)`);

    const upsertedStories = await upsertStories(stories);
    const currentUrls = stories.map((s) => s.url);
    await cleanupOldStories(currentUrls);

    console.log(
      `[Scraper] Successfully upserted ${upsertedStories.length} story(ies)`,
    );

    return upsertedStories;
  } catch (error) {
    console.error("[Scraper] Fatal error during scrape:", error.message);
    throw error;
  }
};

export { scrapeAndStoreStories };
