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
import AlertasEnviados from './components/AlertasEnviados';

var url_api = 'http://ec2-18-219-163-218.us-east-2.compute.amazonaws.com:3000/api';
if(process.env.NODE_ENV == 'development' ){
  url_api = 'http://localhost:3000/api';
}



function App() {


  

  return (

    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Menu url={url_api} />}>
          <Route index element={<Home  />} />

          <Route exact path='/Processos' element={<PrivateRoute> <ProcessosLicitatorios url={url_api}/> </PrivateRoute> }/>


          <Route path='/ConfigurarAlerta' element={<PrivateRoute><ConfigurarAlerta url={url_api}/> </PrivateRoute>}  />

          <Route path='/AlertasEnviados' element={<PrivateRoute><AlertasEnviados url={url_api}/> </PrivateRoute>}  />
            

          <Route path="/Login" element={
            <Login
              url={url_api}
            />
          }/>     
                  
          <Route path="/Cadastro" element={<Cadastro url={url_api}/>} />

          
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
