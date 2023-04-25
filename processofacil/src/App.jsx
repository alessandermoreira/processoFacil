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
import PrivateRoute from './components/PrivateRoute';

var url_api = 'http://ec2-18-219-163-218.us-east-2.compute.amazonaws.com:3000/api';
if(process.env.NODE_ENV == 'development' ){
  url_api = 'http://localhost:3000/api';
}


function App() {

  const [usuarioLogado, setUsuarioLogado] = useState({});

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu url={url_api} usuarioLogado={usuarioLogado} setUsuarioLogado={setUsuarioLogado}/>}>
          <Route index element={<Home />} />

          <Route path='/ConfigurarAlerta' element={<PrivateRoute/>}>
            <Route exact path="/ConfigurarAlerta" element={<ConfigurarAlerta url={url_api}/>} />
          </Route>

          <Route path="/Login" element={
            <Login
              url={url_api}
              usuarioLogado={usuarioLogado}
              setUsuarioLogado={setUsuarioLogado}
            />
          }/>     
                  
          <Route path="/Cadastro" element={<Cadastro url={url_api}/>} />

          <Route exact path='/Processos' element={<PrivateRoute/>}>
            <Route path="/Processos" element={<ProcessosLicitatorios url={url_api}/>} />
          </Route>
          
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
