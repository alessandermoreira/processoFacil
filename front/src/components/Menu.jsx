import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button, Offcanvas } from "react-bootstrap";
import { useReducer, useState } from 'react';
import {BagFill, GeoAlt, GeoAlt as List} from 'react-bootstrap-icons'
import "./css/Menu.css"
import axios from 'axios';
import React from 'react';
import Cesta from './Cesta';
// import logo from '../imgs/logo.png';
import {Helmet} from 'react-helmet';



const Menu = ({products, show,setShow}) => {

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('id_user');   
    localStorage.removeItem('permissoes');     
  }

  const location = useLocation();


  const handleShow = () => setShow(true);
  const temProduto = products && products.some((product) => product.qtd > 0);
  const [piscando, setPiscando] = useState(true);
  const [Clicou, setClicou] = useState(false);
  const handleHidden = () => {
    setClicou(true);
  }

  setTimeout(() => {
    setPiscando(!piscando);
  }, 400); // Alterne a cada 1 segundo (1000 milissegundos)

  const isPaymentPage = location.pathname === "/Payment"

  return (
    <>
      <Helmet>
        <title>Entrega Aki Online</title>
        {/* <link rel="icon" type="image/png" href='../src/imgs/icone.png' sizes="16x16" /> */}
      </Helmet>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark"  >
     
      <Container>
        { temProduto && !isPaymentPage &&
          <BagFill color={piscando ? 'yellow' : 'white'}  size={20}  onClick={handleShow}> Cesta </BagFill>
        }
      
        <Navbar.Brand style={{color:"yellow"}} href="/">
          {/* <img style={{ width: '100px', height: 'auto' }}
              src={logo}></img> */}
              
          <Link  style={{color:'yellow', textDecoration: 'none' }} to="/">
            Entrega Aki
          </Link>
          {" "}<GeoAlt style={{fontSize:"2em"}}/>
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            {/* <Nav.Link to="/CriarOrcamento" href="/CriarOrcamento">
                Crie um Orçamento
            </Nav.Link> */}
            <Nav.Link >
              {temProduto && <Link style={{ color: "white" }} to="/Payment">Fechar Pedido</Link>}
            </Nav.Link>
            <Nav.Link>
              <Link to={"/Produtos"} style={{color:'yellow', textDecoration: 'none' }} > Produtos</Link>
            </Nav.Link>           
            {/* <Nav.Link>
              <Link to={"/RaffleTicket"} style={{ color: "white" }}>RaffleTicket</Link>
            </Nav.Link> */}
            {/* <Nav.Link>
              <Link to={"/Produtos_Importar"} style={{ color: "white" }}>Produtos Importar</Link>
            </Nav.Link>  */}
          </Nav>
          <Nav>
          { localStorage.user || (  <>
                                      {location.pathname !== '/Cadastro' && ( // Verifica se a rota atual não é /Cadastro
                                        <Nav.Link>
                                          <Link to="/Cadastro" style={{ color: "white" }}>Entrar</Link>
                                        </Nav.Link>
                                      )}   
                                    </>
            )}            
            {localStorage.user && (
              <NavDropdown title={localStorage.user}id="collasible-nav-dropdown">
                <NavDropdown.Divider />
                <NavDropdown.Item href="Pedidos"> Pedidos </NavDropdown.Item>
                <NavDropdown.Item href="MeuCadastro"> Meu Cadastro </NavDropdown.Item>                
                <NavDropdown.Item onClick={handleLogout} href="Produtos"> Sair </NavDropdown.Item>
                { localStorage.getItem('permissoes') == 'admin' 
                  && <NavDropdown.Item href="Produtos_Importar"> Produtos_Importar </NavDropdown.Item>
                }
                { localStorage.getItem('permissoes') == 'admin' 
                  && <NavDropdown.Item href="Entregar"> Entregar </NavDropdown.Item>
                }                
              </NavDropdown>
            )}

          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>


    <Outlet />

    <br />
    <br />                
    <p className='text-center'>&copy; 2024 Entrega Aki, Legumes e Frutas. Todos os direitos reservados.</p>

    <hr style={{marginLeft:"10%",width:"80%"}} />

    {temProduto && window.location.pathname=="/Produtos" && (
      <Link
        className="following-button"
        variant={'primary'} 
        style={{float:"right"}} 
        onClick={handleHidden}
        to="/Payment" >
            Fechar Pedido
      </Link>
    )}
    
    </>
  )
};

export default Menu;