import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Outlet } from 'react-router-dom';
import { Button, Offcanvas } from "react-bootstrap";
import { useState } from 'react';
import {ArrowRight, List} from 'react-bootstrap-icons'
import "./css/Menu.css"

const Menu = ({url, usuarioLogado, setUsuarioLogado}) => {


  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);


  const handleSair = () => {
    console.log(usuarioLogado)
    setUsuarioLogado({});
    window.location.href = "/Login"
    }

  return (
    <>
    <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark"  >
     
      <Container >
      <List id = "ListaIcon" color="white"  size={40}  onClick={handleShow} />
        <Navbar.Brand  style={{color:"yellow"}} href="/">
          
         Processo Facil</Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link to="/Processos" href="/Processos">
                Processos
            </Nav.Link>
            <Nav.Link to="/ConfigurarAlerta" href="/ConfigurarAlerta">
                Configurar Alerta
            </Nav.Link>
            <Nav.Link to="/CriarOrcamento" href="/CriarOrcamento">
                Cadastrar Empresa
            </Nav.Link>                      
            <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
              <NavDropdown.Item href="/Login">Login</NavDropdown.Item>
              <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="#action/3.4">
                Separated link
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
          <Nav>
            <Nav.Link href="/Login">Login</Nav.Link>
            <Nav.Link onClick={handleSair}>Sair</Nav.Link>
            <Nav.Link href="/Cadastro">Cadastrar-se</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    <Outlet />

    <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title>Offcanvas</Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
                Some text as placeholder. In real life you can have the elements you
                have chosen. Like, text, images, lists, etc.
            </Offcanvas.Body>
            </Offcanvas>
    </>
  )
};

export default Menu;