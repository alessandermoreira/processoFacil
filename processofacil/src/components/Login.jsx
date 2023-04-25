import React, { useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const Login = ({url, usuarioLogado, setUsuarioLogado}) => {


    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(email, password);
        const credenciais = {email, password};
        const response = await axios.post(url + '/api/login', credenciais,{params: credenciais});
        localStorage.setItem('user', response.data);
        setUsuarioLogado(response.data);
        console.log(response.data);
        navigate("/Processos")
    };

return (

<Container>
    
    <Row className="justify-content-md-center mt-5">
        <Col md="5">
            <h2>Fazer Login</h2>
            <br></br>
            <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formBasicEmail">
                    {/* <Form.Label>Email</Form.Label> */}
                        <Form.Control
                            type="email"
                            placeholder="Digite o e-mail"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                </Form.Group>
                <br />
                <Form.Group controlId="formBasicPassword">
                    {/* <Form.Label>Senha</Form.Label> */}
                    <Form.Control
                        type="password"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                Avançar
                </Button>
                <Button style={{float:"right"}} variant="default" className="ml-2">
                Esqueci minha senha
                </Button>
            </Form>
        </Col>
    </Row>
    <Row className="justify-content-md-center mt-2">
        <Col md="5">
            <Button href="/Cadastro" variant="link">Ainda não tem conta? Cadastre-se</Button>
        </Col>
    </Row>
</Container>);
};

export default Login;