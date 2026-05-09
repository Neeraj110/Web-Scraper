import { Navigate, useLocation } from "react-router-dom";

import { useAuth } from "../context/AuthContext.jsx";

const ProtectedRoute = ({ children }) => {
  const { hydrated, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!hydrated) {
    return (
      <div className="grid min-h-[50vh] place-items-center rounded-[1.5rem] border border-black/8 bg-white/80 px-6 py-12 text-center shadow-soft">
        <div>
          <div className="mx-auto h-12 w-12 animate-pulse rounded-full bg-ink/15" />
          <p className="mt-4 text-sm font-semibold text-ink/65">
            Loading your session...
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
};

export default ProtectedRoute;
