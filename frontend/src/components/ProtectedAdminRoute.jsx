import { Navigate } from "react-router-dom";

const ProtectedAdminRoute = ({ children }) => {
  const userInfo = JSON.parse(localStorage.getItem("userInfo") || "null");

  if (!userInfo) {
    return <Navigate to="/login" replace />;
  }

  if (!userInfo.isAdmin) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedAdminRoute;
