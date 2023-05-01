import React, { useState, useEffect, Component } from "react";
import { Route, useNavigate, Outlet, Link, Navigate  } from 'react-router-dom';

const PrivateRoute = (  { children: children, ...rest } ) => {

  // <Route
  //   {...rest}
  //   render={props => {
  //     const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  //     if (usuarioLogado.token) {
  //       return <Component {...props} />;
  //     } else {
  //       return <Navigate to="/login" />;
  //     }
  //   }}
  // />

  const usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  const isAuthenticated = usuarioLogado.token;

  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
