import React, { useMemo } from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../store/store";

interface PrivateRouteProps {
  children: React.ReactNode;
  redirectTo?: string; // dynamic redirect path
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({
  children,
  redirectTo = "/login",
}) => {
  const token = useSelector((state: RootState) => state.auth.token);

  // Memoize access check for performance
  const hasAccess = useMemo(() => !!token, [token]);

  if (!hasAccess) {
    return <Navigate to={redirectTo} replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
