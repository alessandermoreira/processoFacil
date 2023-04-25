import React, { useState, useEffect } from "react";
import { Route, useNavigate, Outlet, Link  } from 'react-router-dom';


function PrivateRoute({ component: Component, ...rest }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  // const navigate = useNavigate();

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
        
      setIsAuthenticated(false);
      // navigate("/login");
      window.location.href = "/login"
    } else {
      // Verifique o token JWT no servidor
      fetch("/api/auth/verify", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      })
        .then((res) => {
          if (res.ok) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
            // navigate("/login");
            window.location.href = "/login"            
          }
        })
        .catch((err) => {
          setIsAuthenticated(false);
          // navigate("/login");
          window.location.href = "/login"
        });
    }
  }, []);

//   return auth ? <Outlet /> : <Navigate to="/login" />;

  return isAuthenticated ? <Outlet /> : <Link to="/login" />;
}

export default PrivateRoute;
