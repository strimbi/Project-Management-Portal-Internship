import { useEffect, useState, type ReactNode } from "react";
import { Navigate } from "react-router";
import { isUserLoggedIn } from "../services/authService";
import ErrorBar from "./ErrorBar";
import handleError from "../util/handleError";

interface ProtectedRouteProps {
  children: ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    isUserLoggedIn()
      .then((status) => {
        setIsAuthenticated(status);
      })
      .catch((error) => handleError(error, setError))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <ErrorBar error={error} />;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

export default ProtectedRoute;
