import { memo, useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useIsAuthenticated from "react-auth-kit/hooks/useIsAuthenticated";
import ROUTES from "../enum/routes";

const ProtectedRoute = () => {
  const isAuthenticated = useIsAuthenticated();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate, isAuthenticated]);

  return <Outlet />;
};

export default memo(ProtectedRoute);
