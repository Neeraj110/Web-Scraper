import { useEffect, useMemo, useState } from "react";
import toast from "react-hot-toast";

import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import StoryCard from "../components/StoryCard.jsx";
import StorySkeleton from "../components/StorySkeleton.jsx";
import Pagination from "../components/Pagination.jsx";

const Home = () => {
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);
  const [bookmarkBusyId, setBookmarkBusyId] = useState(null);
  const [scrapeBusy, setScrapeBusy] = useState(false);
  const { user, isAuthenticated, updateBookmarks } = useAuth();

  const bookmarkSet = useMemo(
    () => new Set((user?.bookmarks || []).map(String)),
    [user],
  );

  const loadStories = async (targetPage = 1, silent = false) => {
    if (!silent) {
      setLoading(true);
    } else {
      setRefreshing(true);
    }

    try {
      const { data } = await api.get("/stories", {
        params: {
          page: targetPage,
          limit: 10,
        },
      });

      setStories(data.stories || []);
      setPage(data.page || targetPage);
      setPages(data.pages || 1);
      setError("");
    } catch (requestError) {
      setError(
        requestError.response?.data?.message || "Failed to load stories",
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadStories(1);
  }, []);

  const handleBookmark = async (storyId) => {
    if (!isAuthenticated) {
      toast.error("Sign in to bookmark stories");
      return;
    }

    setBookmarkBusyId(storyId);

    try {
      const { data } = await api.post(`/stories/${storyId}/bookmark`);
      updateBookmarks(data.bookmarks || []);
      toast.success(data.bookmarked ? "Bookmark saved" : "Bookmark removed");
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Bookmark update failed",
      );
    } finally {
      setBookmarkBusyId(null);
    }
  };

  const handleRefresh = async () => {
    setScrapeBusy(true);

    try {
      await api.post("/scrape");
      toast.success("Stories refreshed from Hacker News");
      await loadStories(page, true);
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Scrape failed");
    } finally {
      setScrapeBusy(false);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      <section className="overflow-hidden rounded-[2rem] border border-black/8 bg-[linear-gradient(135deg,_rgba(255,255,255,0.92),_rgba(255,244,229,0.82))] p-6 shadow-soft sm:p-8">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_0.8fr] lg:items-end">
          <div>
            <p className="inline-flex rounded-full border border-ember/20 bg-ember/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-ember">
              Curated from Hacker News
            </p>
            <h1 className="mt-4 max-w-3xl font-serif text-4xl font-black leading-tight tracking-tight text-ink sm:text-5xl lg:text-6xl">
              Top stories with fast bookmarking, clean auth, and a live scrape
              refresh.
            </h1>
            <p className="mt-4 max-w-2xl text-base leading-7 text-ink/75 sm:text-lg">
              Browse the top 10 stories, keep your favorites, and refresh the
              feed from the source without leaving the app.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
            <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">
                Feed
              </p>
              <p className="mt-2 text-3xl font-black text-ink">
                {stories.length}
              </p>
              <p className="text-sm text-ink/65">stories on page</p>
            </div>
            <div className="rounded-3xl bg-white/80 p-4 shadow-sm ring-1 ring-black/5">
              <p className="text-xs font-bold uppercase tracking-[0.22em] text-ink/45">
                Bookmarks
              </p>
              <p className="mt-2 text-3xl font-black text-ink">
                {bookmarkSet.size}
              </p>
              <p className="text-sm text-ink/65">saved by you</p>
            </div>
            <button
              type="button"
              onClick={handleRefresh}
              disabled={scrapeBusy}
              className="rounded-3xl bg-ink px-4 py-4 text-left text-paper shadow-soft transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <span className="block text-xs font-bold uppercase tracking-[0.22em] text-paper/60">
                Refresh
              </span>
              <span className="mt-2 block text-lg font-black">
                {scrapeBusy ? "Updating feed..." : "Scrape latest stories"}
              </span>
            </button>
          </div>
        </div>
      </section>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 6 }).map((_, index) => (
            <StorySkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-6 py-5 text-red-800 shadow-soft">
          <p className="font-semibold">Unable to load stories</p>
          <p className="mt-1 text-sm">{error}</p>
          <button
            type="button"
            onClick={() => loadStories(page)}
            className="mt-4 rounded-full bg-red-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-800"
          >
            Try again
          </button>
        </div>
      ) : (
        <>
          {refreshing ? (
            <div className="rounded-2xl border border-black/8 bg-white/75 px-4 py-3 text-sm font-medium text-ink/70">
              Updating stories in the background...
            </div>
          ) : null}

          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {stories.map((story) => (
              <StoryCard
                key={story._id}
                story={story}
                isBookmarked={bookmarkSet.has(String(story._id))}
                onBookmark={handleBookmark}
                busy={bookmarkBusyId === story._id}
              />
            ))}
          </div>

          <Pagination page={page} pages={pages} onPageChange={loadStories} />
        </>
      )}
    </div>
  );
};

export default Home;
