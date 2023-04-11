import React from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
import Login from './components/Login';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import CriarOrcamento from "./components/CriarOrcamento";
import Menu from "./components/Menu";
import SemPagina from "./components/SemPagina";
import Home from "./components/Home";
import Cadastro from "./components/Cadastro";

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route index element={<Home />} />
          <Route path="/CriarOrcamento" element={<CriarOrcamento />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          
          <Route path="*" element={<SemPagina />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );

}

export default App;
