import React, { useState, useEffect, Component } from "react";
import { Route, useNavigate, Outlet, Link, Navigate  } from 'react-router-dom';
import { useAuth } from '../components/AuthContext.jsx';


const PrivateRoute = ({ children }) => {
  const { token } = useAuth();

  return token ? children : <Navigate to="/Cadastro" replace />;
};

export default PrivateRoute;

// const PrivateRoute = (  { children: children, ...rest } ) => {

//   <Route
//     {...rest}
//     render={props => {
//       const permissoes = localStorage.getItem('permissoes');
//       console.log('permissoes');
//       console.log(permissoes);
//       if (permissoes == 'admin') {
//         return <Component {...props} />;
//       } else {
//         return <Navigate to="/login" />;
//       }
//     }}
//   />
// };
//   const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
//   const isAuthenticated = usuarioLogado.token;

//   return isAuthenticated ? children : <Navigate to="/login" />;


// export default PrivateRoute;
