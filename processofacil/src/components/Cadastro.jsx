import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from "axios";


const Cadastro = ({url}) => {
  
  const [formData, setFormData] = useState({
    nome: '',
    sobrenome: '',
    email: '',
    telefone: '',
    endereco: '',
    cep: '',
    senha: '',
    confirmaSenha: ''
  });

  const { nome, sobrenome, email, telefone, endereco, cep, senha, confirmaSenha } = formData;
  const [showErroEmail, setShowErroEmail] = useState(false); 
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();


    registerUser({cep :formData.cep,email: formData.email, endereco: formData.endereco, nome: formData.nome, 
      senha : formData.senha, sobrenome : formData.sobrenome,  telefone : formData.telefone,
  });
  }

// Front-end: cadastro de usuário
const registerUser = async (userData) => {
  try {
    console.log("userData");
    console.log(userData);
    const response = await axios.post(url + '/register', userData,{params: userData});
    if(response.data.message){
      alert(response.data.message)
      if( response.data.message == "Usuário cadastrado com sucesso"){
        window.location.href = "/login"
      }
    }

    return ;

    
  } catch (error) {
    console.error(error);
  }
}


const verifyEmail = async (email) => {

    await 
    // axios.get(
    //     "http://localhost:3001/api/clientes/verificar-email-disponivel?email=" + email,
    //   );
    axios.get( url + `/verificarEmailDisponivel/` + email)
    .then(response => {
        console.log(response.data);
        if(response.data.disponivel == false){
            setShowErroEmail(true)
        }else{
            setShowErroEmail(false) 
        }
        
    })
    .catch(error => {
        console.error(error);
    });
};

  const handleEmailBlur = (event) => {

    const email = event.target.value;
    console.log("Verifica Email " + email);
    const emailExistente = verifyEmail(email);




    // Faz a chamada ao backend para verificar se o email existe
    // Aqui você pode utilizar o axios ou o fetch para fazer a requisição
    // E tratar a resposta do servidor para atualizar o estado do componente

  }

  return (
    <Container>
        <Row className="justify-content-md-center">
            <Col md={6}>
                <br/>
                  <h1>Cadastre-se</h1>
                <br/>
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNome">
                  {/* <Form.Label>Nome</Form.Label> */}
                  <Form.Control type="text" placeholder="Nome" name="nome" value={nome} onChange={handleChange} />
                </Form.Group>
                <br/>
                <Form.Group controlId="formSobrenome">
                  {/* <Form.Label>Sobrenome</Form.Label> */}
                  <Form.Control type="text" placeholder="Sobrenome" name="sobrenome" value={sobrenome} onChange={handleChange} />
                </Form.Group>
                <br/>
                <Form.Group controlId="formEmail">
                  {/* <Form.Label>Email</Form.Label> */}
                  <Form.Control type="email" onBlur={handleEmailBlur} placeholder="Email" name="email" value={email} onChange={handleChange} />
                </Form.Group>
                <br/>
                <Alert show={showErroEmail} key={'danger'} variant={'warning'}>
                    Email já cadastrado.  <a href="#" style={{ color: 'blue', textDecoration: 'underline' }}>Recuperar a senha</a>
                </Alert>
                <Form.Group controlId="formTelefone">
                  {/* <Form.Label>Telefone</Form.Label> */}
                  <Form.Control type="tel" placeholder="Telefone" name="telefone" value={telefone} onChange={handleChange} />
                </Form.Group>
                <br/>
                <Form.Group controlId="formEndereco">
                  {/* <Form.Label>Endereço</Form.Label> */}
                  <Form.Control type="text" placeholder="Endereço" name="endereco" value={endereco} onChange={handleChange} />
                </Form.Group>
                <br/>
                <Form.Group controlId="formCEP">
                  {/* <Form.Label>CEP</Form.Label> */}
                  <Form.Control type="text" placeholder="CEP" name="cep" value={cep} onChange={handleChange} />
                </Form.Group>
                <br/>
                <Form.Group controlId="formSenha">
                  {/* <Form.Label>Senha</Form.Label> */}
                  <Form.Control type="password" placeholder="Senha" name="senha" value={senha} onChange={handleChange} />
                </Form.Group>
                <br />
                <Button variant="primary" type="submit">
                    Avançar
                </Button>
                <Button href="/Login" style={{float:"right"}} variant="default" className="ml-2">
                    Já tenho uma conta. Login
                </Button>
                <br />
                <hr />
                <br />
                
                </Form>
            </Col>
        </Row>
    </Container>
  )}

export default Cadastro;
