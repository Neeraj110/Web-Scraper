import { Link, NavLink, Outlet } from 'react-router-dom';

import { useAuth } from '../context/AuthContext.jsx';

const Layout = () => {
  const { hydrated, isAuthenticated, user, logout } = useAuth();

  return (
    <div className="min-h-screen text-ink">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_left,_rgba(214,165,49,0.22),_transparent_30%),radial-gradient(circle_at_top_right,_rgba(15,76,92,0.18),_transparent_28%),linear-gradient(180deg,_#f9f5ef_0%,_#f4efe8_100%)]" />
      <header className="sticky top-0 z-30 border-b border-black/5 bg-paper/85 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <Link to="/" className="group flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-ink text-sm font-bold text-paper shadow-soft transition-transform duration-300 group-hover:-rotate-6 group-hover:scale-105">
              HN
            </span>
            <div>
              <p className="font-serif text-lg font-black tracking-tight">Hacker News Story Hub</p>
              <p className="text-xs uppercase tracking-[0.25em] text-ink/55">Top stories, fast access</p>
            </div>
          </Link>

          <nav className="flex items-center gap-2 sm:gap-4">
            <NavLink
              to="/"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-ink text-paper' : 'text-ink/70 hover:bg-black/5 hover:text-ink'
                }`
              }
            >
              Home
            </NavLink>
            <NavLink
              to="/bookmarks"
              className={({ isActive }) =>
                `rounded-full px-4 py-2 text-sm font-semibold transition ${
                  isActive ? 'bg-ink text-paper' : 'text-ink/70 hover:bg-black/5 hover:text-ink'
                }`
              }
            >
              Bookmarks
            </NavLink>

            {hydrated && isAuthenticated ? (
              <div className="flex items-center gap-3 rounded-full border border-black/10 bg-white/70 px-3 py-2 shadow-sm">
                <span className="hidden text-sm font-medium text-ink/70 sm:inline">
                  {user?.name || 'Reader'}
                </span>
                <button
                  type="button"
                  onClick={logout}
                  className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white transition hover:opacity-90"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="rounded-full px-4 py-2 text-sm font-semibold text-ink/70 transition hover:bg-black/5 hover:text-ink"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="rounded-full bg-ink px-4 py-2 text-sm font-semibold text-paper shadow-soft transition hover:translate-y-[-1px]"
                >
                  Sign up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;