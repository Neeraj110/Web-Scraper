const formatPostedAt = (postedAt) => postedAt || 'Recently';

const StoryCard = ({ story, isBookmarked, onBookmark, busy }) => {
  return (
    <article className="group flex h-full flex-col rounded-[1.5rem] border border-black/8 bg-white/85 p-5 shadow-soft transition duration-300 hover:-translate-y-1 hover:shadow-[0_28px_70px_rgba(15,23,42,0.15)]">
      <div className="flex items-start justify-between gap-4">
        <span className="rounded-full bg-deep/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.22em] text-deep">
          {story.points} points
        </span>
        <button
          type="button"
          onClick={() => onBookmark(story._id)}
          disabled={busy}
          className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
            isBookmarked
              ? 'bg-gold text-ink hover:opacity-90'
              : 'bg-ink text-paper hover:bg-ember'
          } disabled:cursor-not-allowed disabled:opacity-60`}
        >
          {isBookmarked ? 'Bookmarked' : 'Bookmark'}
        </button>
      </div>

      <h2 className="mt-5 text-xl font-black leading-tight tracking-tight text-ink group-hover:text-ember">
        <a href={story.url} target="_blank" rel="noreferrer" className="hover:underline">
          {story.title}
        </a>
      </h2>

      <div className="mt-4 flex flex-wrap items-center gap-3 text-sm text-ink/70">
        <span className="rounded-full bg-black/5 px-3 py-1">By {story.author}</span>
        <span className="rounded-full bg-black/5 px-3 py-1">{formatPostedAt(story.postedAt)}</span>
      </div>

      <div className="mt-auto pt-5">
        <a
          href={story.url}
          target="_blank"
          rel="noreferrer"
          className="text-sm font-semibold text-deep transition hover:text-ember"
        >
          Open story →
        </a>
      </div>
    </article>
  );
};

export default StoryCard;