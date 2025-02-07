import React, { useEffect } from "react";
import "../node_modules/bootstrap/dist/css/bootstrap.min.css";
import "../node_modules/bootstrap/dist/js/bootstrap.min.js";
// import Login from './components/Login';
import { BrowserRouter, Link, Route, Routes, useNavigate } from 'react-router-dom';
import CriarOrcamento from "./components/CriarOrcamento";
import Menu from "./components/Menu";
import SemPagina from "./components/SemPagina";
import Home from "./components/Home";
import Cadastro from "./components/Cadastro";
import Payment from "./components/Payment";
import Produtos from "./components/Produtos.jsx";
import Cesta from "./components/Cesta.jsx";
import { useState } from "react";
import { useReducer } from "react";
import { Button, Offcanvas } from "react-bootstrap";
import { BlockquoteLeft, BagFill } from "react-bootstrap-icons";
import axios from "axios";
import RaffleTicket from "./components/RaffleTicket.jsx";
import ProdutosImportar from "./components/ProdutosImportar.jsx";
import Pedidos from "./components/Pedidos.jsx";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import MeuCadastro from "./components/MeuCadastro.jsx";
import Entregar from "./components/Entregar.jsx";
import { AuthProvider, useAuth } from './components/AuthContext';
import PrivateRoute from "./components/PrivateRoute.jsx";



// const { createProxyMiddleware } = require('http-proxy-middleware');
const apiUrl = process.env.REACT_APP_API_URL;


const App = () => {
     
  const api = axios.create({
    baseURL : apiUrl
  });

  // Adiciona um interceptor de requisição
  api.interceptors.request.use(config => {
 
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, error => {
    return Promise.reject(error);
  });  
  console.log("apiUrl")
  console.log(apiUrl)

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);


  const formReducer = (state, event) => {
    return {...state,
            [event.name] : event.value
    }
  }

  // const [cesta, setCesta] = useState( 
  //     [
  //       { id: 1, name: 'Product 1', price: 10.99, qtd: 0, category: 'limpeza' },
  //       { id: 2, name: 'Product 2', price: 20.99, qtd: 0, category: 'alimentação' },
  //       { id: 3, name: 'Product 3', price: 30.99, qtd: 0, category: 'beleza' },
  //       { id: 4, name: 'Product 4', price: 40.99, qtd: 1, category: 'limpeza' },
  //       { id: 5, name: 'Product 5', price: 50.99, qtd: 1, category: 'alimentação' },
  //       { id: 6, name: 'Product 6', price: 60.99, qtd: 1, category: 'beleza' },
  //     ]
  //   )

// const [products, setProducts] = useReducer(formReducer, {})
  // const [cesta, setCesta] = useState([
  //   { id: 1, name: 'Product 1', price: 10.99, qtd: 1, category: 'limpeza' },
  //   { id: 2, name: 'Product 2', price: 20.99, qtd: 1, category: 'alimentação' },
  //   { id: 3, name: 'Product 3', price: 30.99, qtd: 1, category: 'beleza' },
  //   { id: 4, name: 'Product 4', price: 40.99, qtd: 1, category: 'limpeza' },
  //   { id: 5, name: 'Product 5', price: 50.99, qtd: 1, category: 'alimentação' },
  //   { id: 6, name: 'Product 6', price: 60.99, qtd: 1, category: 'beleza' },
  // ])

  const [cesta, setCesta] = useState([]);


  useEffect(() => {
    // document.title = "Entrega Aki Online";

    const fetchProducts = async () => {
      try {
        const response = await api.get('/get-produtos-venda'); // replace with your endpoint URL

        const products = response.data.map((product) => {
          const productLowerCase = Object.keys(product).reduce((acc, key) => {
            acc[key.toLowerCase()] = product[key]; // Converte a chave para minúsculas
            return acc;
          }, {});
        
          return { ...productLowerCase, qtd: 0 };
          //add coluna qtd = 0
        }).map((product) => ({...product, qtd: 0 }));

        // const products = ;
        setCesta(products);
        console.log(products);
        console.log('products');

      } catch (error) {
        console.error(error);
        if(error.response.data == "Token inválido ou expirado"){      
          localStorage.clear();
          window.location.href = '/Cadastro';
        }        
      }
    };
    fetchProducts();
  }, []); 

  var vr = cesta.reduce((total, product) => total + (product.qtd * product.price), 0);

  const totalValue = vr;

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Menu products={cesta} setProducts={setCesta} show={show} setShow={setShow}/> }>
            <Route index element={<Home />} />
            <Route path="/CriarOrcamento" element={<CriarOrcamento />} />
            <Route path="/Login" element={<Cadastro />} />
            <Route path="/Cadastro" element={<Cadastro />} />
            <Route path="/Payment"  element={<Payment products={cesta} setProducts={setCesta}/>} />
            {/* <Route path="/Produtos" element={<Produtos products={cesta} setProducts={setCesta}/>} /> */}
            <Route
              path="/Produtos"
              element={
                <PrivateRoute>
                  <Produtos products={cesta} setProducts={setCesta} />
                </PrivateRoute>
              }
            />
            <Route path="/RaffleTicket" element={<RaffleTicket/>} />
            <Route path='/Produtos_Importar' element={ <ProdutosImportar products={cesta} setProducts={setCesta} />  }/>
            <Route path='/MeuCadastro' element={ <MeuCadastro />  }/>
            <Route path="/Entregar" element={<Entregar/>} />
            <Route path="/Pedidos" element={<Pedidos/>} />

            <Route path="*" element={<SemPagina />} />
          </Route>
        </Routes>
        <Offcanvas show={show} onHide={handleClose}>
              <Offcanvas.Header closeButton>
                  <Offcanvas.Title> Minha Sacola <BagFill style={{marginBottom:"5px"}}/> </Offcanvas.Title> 
              </Offcanvas.Header>
              <Offcanvas.Body>
                <Cesta products={cesta} setProducts={setCesta}/>
                  {/* <Button href="/Payment" products={cesta} setProducts={setCesta} >Fechar Pedido</Button> */}
                  {
                    (totalValue > 0) &&
                    <Link  style={{float:"right"}} to="/Payment" onClick={handleClose} >Fechar Pedido </Link>
                    ||
                    <span>Nenhum produto adicionado... <Link onClick={handleClose} to={"/Produtos"}>Veja Produtos</Link> </span>
                  }

              </Offcanvas.Body>
        </Offcanvas>
      </BrowserRouter>
    </AuthProvider>
  );

}

export default App;
