import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext.jsx";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await login(form);
      toast.success("Logged in successfully");
      navigate(location.state?.from || "/", { replace: true });
    } catch (requestError) {
      toast.error(requestError.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
      <div className="rounded-[2rem] border border-black/8 bg-ink p-8 text-paper shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-paper/60">
          Welcome back
        </p>
        <h1 className="mt-4 font-serif text-4xl font-black tracking-tight">
          Sign in to save stories.
        </h1>
        <p className="mt-4 max-w-xl text-paper/75">
          Your bookmarks are synced with the backend, so you can move across
          devices without losing your saved reads.
        </p>
        <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/10">
          <p className="text-sm font-semibold text-paper/80">New here?</p>
          <Link
            to="/register"
            className="mt-2 inline-block text-sm font-bold text-gold hover:underline"
          >
            Create an account
          </Link>
        </div>
      </div>

      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-black/8 bg-white/90 p-8 shadow-soft"
      >
        <h2 className="font-serif text-3xl font-black tracking-tight text-ink">
          Login
        </h2>
        <p className="mt-2 text-sm text-ink/65">
          Use the email and password you registered with.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-semibold text-ink">Email</span>
          <input
            type="email"
            required
            value={form.email}
            onChange={(event) =>
              setForm({ ...form, email: event.target.value })
            }
            className="mt-2 w-full rounded-2xl border border-black/10 bg-paper/70 px-4 py-3 outline-none transition focus:border-ink"
            placeholder="you@example.com"
          />
        </label>

        <label className="mt-5 block">
          <span className="text-sm font-semibold text-ink">Password</span>
          <input
            type="password"
            required
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            className="mt-2 w-full rounded-2xl border border-black/10 bg-paper/70 px-4 py-3 outline-none transition focus:border-ink"
            placeholder="••••••••"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-2xl bg-ember px-5 py-3 font-semibold text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;
