import { Link } from 'react-router-dom';

const NotFound = () => (
  <div className="mx-auto max-w-2xl rounded-[2rem] border border-black/8 bg-white/85 p-10 text-center shadow-soft">
    <p className="text-xs font-bold uppercase tracking-[0.24em] text-ember">404</p>
    <h1 className="mt-4 font-serif text-4xl font-black tracking-tight text-ink">Page not found</h1>
    <p className="mt-3 text-ink/70">The route you tried to open does not exist.</p>
    <Link to="/" className="mt-6 inline-flex rounded-full bg-ink px-5 py-3 font-semibold text-paper">
      Back home
    </Link>
  </div>
);

export default NotFound;