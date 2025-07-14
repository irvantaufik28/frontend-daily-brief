/* eslint-disable react/prop-types */
import {jwtDecode} from "jwt-decode";
import { useEffect, useState } from "react";
import { useCookies } from "react-cookie";
import { Outlet, useNavigate } from "react-router-dom";
import PageNotFound from "../components/page-not-found/PageNotFound";

const PrivateRoute = ({ allowedRoles }) => {
  const [cookies] = useCookies(["token"]);
  const token = cookies.token;
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const validateToken = () => {
      if (!token) {
        navigate("/");
        return;
      }

      try {
        const decoded = jwtDecode(token);
        const currentTime = Date.now();

        if (decoded.exp * 1000 < currentTime) {
          navigate("/");
        } else {
          setUser(decoded);
        }
      } catch (error) {
        navigate("/");
      } finally {
        setCheckingAuth(false);
      }
    };

    validateToken();
  }, [token, navigate]);

  if (checkingAuth) return null;

  const isAuthorized = user && allowedRoles.includes(user.role?.toUpperCase());

  return isAuthorized ? <Outlet /> : <PageNotFound />;
};

PrivateRoute.defaultProps = {
  allowedRoles: [],
};

export default PrivateRoute;
