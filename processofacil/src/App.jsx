import React, { useState } from 'react';
import axios from 'axios';
import ProcessosLicitatorios from './ProcessosLicitatorios';
import Menu from './components/Menu';
import Home from './components/Home';
import Login from './components/Login';
import SemPagina from './components/SemPagina';
import Cadastro from './components/Cadastro';
import ConfigurarAlerta from './components/ConfigurarAlerta';

import { BrowserRouter, Route, Routes } from 'react-router-dom';

function App() {

  const url = 'http://ec2-18-219-163-218.us-east-2.compute.amazonaws.com:3000';
  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu />}>
          <Route index element={<Home />} />
          <Route path="/ConfigurarAlerta" element={<ConfigurarAlerta url={url}/>} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Cadastro" element={<Cadastro />} />
          <Route path="/Processos" element={<ProcessosLicitatorios url={url}/>} />
          
          <Route path="*" element={<SemPagina />} />
        </Route>
      </Routes>
    </BrowserRouter>


    // <div>
    //   <ProcessosLicitatorios
    //     url={url}
    //     ></ProcessosLicitatorios>

    // </div>
  );
}

export default App;
