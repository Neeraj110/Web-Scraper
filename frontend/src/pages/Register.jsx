import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

import { useAuth } from "../context/AuthContext.jsx";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    try {
      await register(form);
      toast.success("Account created");
      navigate("/", { replace: true });
    } catch (requestError) {
      toast.error(
        requestError.response?.data?.message || "Registration failed",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
      <form
        onSubmit={handleSubmit}
        className="rounded-[2rem] border border-black/8 bg-white/90 p-8 shadow-soft"
      >
        <h1 className="font-serif text-3xl font-black tracking-tight text-ink">
          Create your account
        </h1>
        <p className="mt-2 text-sm text-ink/65">
          Bookmark stories, keep your feed state, and sign in anywhere.
        </p>

        <label className="mt-6 block">
          <span className="text-sm font-semibold text-ink">Name</span>
          <input
            type="text"
            required
            value={form.name}
            onChange={(event) => setForm({ ...form, name: event.target.value })}
            className="mt-2 w-full rounded-2xl border border-black/10 bg-paper/70 px-4 py-3 outline-none transition focus:border-ink"
            placeholder="Jane Reader"
          />
        </label>

        <label className="mt-5 block">
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
            minLength="6"
            value={form.password}
            onChange={(event) =>
              setForm({ ...form, password: event.target.value })
            }
            className="mt-2 w-full rounded-2xl border border-black/10 bg-paper/70 px-4 py-3 outline-none transition focus:border-ink"
            placeholder="Choose a strong password"
          />
        </label>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full rounded-2xl bg-ink px-5 py-3 font-semibold text-paper transition hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <div className="rounded-[2rem] border border-black/8 bg-deep p-8 text-paper shadow-soft">
        <p className="text-xs font-bold uppercase tracking-[0.24em] text-paper/60">
          Why register
        </p>
        <h2 className="mt-4 font-serif text-4xl font-black tracking-tight">
          Keep the stories that matter.
        </h2>
        <ul className="mt-6 space-y-3 text-paper/80">
          <li>• Toggle bookmarks and store them on the backend.</li>
          <li>• Preserve login state with Context and localStorage.</li>
          <li>• Switch between devices without reconfiguring your feed.</li>
        </ul>

        <div className="mt-8 rounded-[1.5rem] bg-white/10 p-5 ring-1 ring-white/10">
          <p className="text-sm font-semibold text-paper/80">
            Already have an account?
          </p>
          <Link
            to="/login"
            className="mt-2 inline-block text-sm font-bold text-gold hover:underline"
          >
            Go to login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
