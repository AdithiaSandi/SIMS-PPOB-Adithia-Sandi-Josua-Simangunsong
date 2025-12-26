import type { ReactNode } from "react";
import { useAppSelector } from "../store/hooks";
import { Navigate, useLocation } from "react-router-dom";
import { selectAuth } from "../store/selectors";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated } = useAppSelector(selectAuth);
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
