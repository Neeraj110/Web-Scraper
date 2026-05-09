import { useEffect, useMemo, useState } from "react";

import api from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";
import StoryCard from "../components/StoryCard.jsx";
import StorySkeleton from "../components/StorySkeleton.jsx";

const Bookmarks = () => {
  const { user, updateBookmarks } = useAuth();
  const [stories, setStories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bookmarkBusyId, setBookmarkBusyId] = useState(null);

  const bookmarkIds = useMemo(
    () => new Set((user?.bookmarks || []).map(String)),
    [user],
  );

  useEffect(() => {
    const loadBookmarks = async () => {
      setLoading(true);

      try {
        const { data } = await api.get("/stories", {
          params: { page: 1, limit: 50 },
        });
        const savedStories = (data.stories || []).filter((story) =>
          bookmarkIds.has(String(story._id)),
        );

        setStories(savedStories);
        setError("");
      } catch (requestError) {
        setError(
          requestError.response?.data?.message || "Failed to load bookmarks",
        );
      } finally {
        setLoading(false);
      }
    };

    loadBookmarks();
  }, [bookmarkIds]);

  const handleBookmark = async (storyId) => {
    setBookmarkBusyId(storyId);

    try {
      const { data } = await api.post(`/stories/${storyId}/bookmark`);
      updateBookmarks(data.bookmarks || []);
      setStories((currentStories) =>
        currentStories.filter((story) => String(story._id) !== storyId),
      );
    } finally {
      setBookmarkBusyId(null);
    }
  };

  return (
    <div className="space-y-6 pb-12">
      <section className="rounded-[2rem] border border-black/8 bg-white/85 p-6 shadow-soft sm:p-8">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-ember">
          Your shelf
        </p>
        <h1 className="mt-3 font-serif text-4xl font-black tracking-tight text-ink">
          Saved stories
        </h1>
        <p className="mt-3 max-w-2xl text-ink/70">
          Bookmarked stories stay attached to your account and are removed
          automatically when the feed refreshes them away.
        </p>
      </section>

      {loading ? (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <StorySkeleton key={index} />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-[1.5rem] border border-red-200 bg-red-50 px-6 py-5 text-red-800 shadow-soft">
          <p className="font-semibold">Unable to load bookmarks</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : stories.length === 0 ? (
        <div className="rounded-[1.5rem] border border-black/8 bg-white/80 px-6 py-12 text-center shadow-soft">
          <h2 className="text-2xl font-black text-ink">No bookmarks yet</h2>
          <p className="mt-2 text-ink/65">
            Open the home feed and save a few stories to build this list.
          </p>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {stories.map((story) => (
            <StoryCard
              key={story._id}
              story={story}
              isBookmarked
              onBookmark={handleBookmark}
              busy={bookmarkBusyId === story._id}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Bookmarks;
