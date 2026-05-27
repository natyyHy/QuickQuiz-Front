import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

interface PublicRouteProps {
  children: React.ReactNode;
}

export const PublicRoute: React.FC<PublicRouteProps> = ({ children }) => {
  const token = localStorage.getItem("@App:token");

  if (token) {
    return <Navigate to="/professor/dashboard" replace />;
  }

  return <>{children}</>;
};

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem("@App:token");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to="/professor/login" state={{ from: location }} replace />
    );
  }

  return <>{children}</>;
};
