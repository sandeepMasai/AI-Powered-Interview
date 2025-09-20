import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useInterview } from "../../context/InterviewContext"; 

const ProtectedRoute = ({ children }) => {
  const { user } = useInterview();
  const location = useLocation();

 
  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;
