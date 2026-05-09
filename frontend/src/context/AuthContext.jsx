import { createContext, useContext, useEffect, useMemo, useState } from "react";

import api from "../api/client.js";

const TOKEN_KEY = "hacker-news-story-hub-token";
const USER_KEY = "hacker-news-story-hub-user";

const AuthContext = createContext(null);

const readUser = () => {
  try {
    const stored = localStorage.getItem(USER_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (_error) {
    return null;
  }
};

const normalizeBookmarks = (bookmarks = []) =>
  bookmarks.map((bookmark) => bookmark.toString());

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const [user, setUser] = useState(() => readUser());
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []); // Run once on mount to indicate hydration is complete

  const persistSession = (nextToken, nextUser) => {
    if (nextToken) {
      localStorage.setItem(TOKEN_KEY, nextToken);
    } else {
      localStorage.removeItem(TOKEN_KEY);
    }

    if (nextUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(nextUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }

    setToken(nextToken);
    setUser(nextUser);
  };

  const syncUser = (nextUser) => {
    const normalizedUser = nextUser
      ? { ...nextUser, bookmarks: normalizeBookmarks(nextUser.bookmarks || []) }
      : null;

    setUser(normalizedUser);

    if (normalizedUser) {
      localStorage.setItem(USER_KEY, JSON.stringify(normalizedUser));
    } else {
      localStorage.removeItem(USER_KEY);
    }
  };

  const login = async (credentials) => {
    const { data } = await api.post("/auth/login", credentials);
    const nextUser = {
      ...data.user,
      bookmarks: normalizeBookmarks(data.user.bookmarks || []),
    };
    persistSession(data.token, nextUser);
    return data;
  };

  const register = async (payload) => {
    const { data } = await api.post("/auth/register", payload);
    const nextUser = {
      ...data.user,
      bookmarks: normalizeBookmarks(data.user.bookmarks || []),
    };
    persistSession(data.token, nextUser);
    return data;
  };

  const logout = () => {
    persistSession(null, null);
  };

  const updateBookmarks = (bookmarks) => {
    if (!user) {
      return;
    }

    syncUser({
      ...user,
      bookmarks: normalizeBookmarks(bookmarks),
    });
  };

  const value = useMemo(
    () => ({
      token,
      user,
      hydrated,
      isAuthenticated: Boolean(token && user),
      login,
      register,
      logout,
      updateBookmarks,
      syncUser,
    }),
    [hydrated, token, user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
};
