import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import ROUTES from "../enum/routes";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";

const PublicRoute = () => {
  const navigate = useNavigate();
  const isAuthenticated = useIsAuthenticated();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD);
    }
  }, [isAuthenticated, navigate]);

  return <Outlet />;
};

export default PublicRoute;
