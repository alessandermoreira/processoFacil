import React, { useState } from 'react';
import { Form, Button, Container, Row, Col, Alert } from 'react-bootstrap';
import axios from "axios";
import InputMask from 'react-input-mask';
import { cpf as cpfValidate } from 'cpf-cnpj-validator';
import validator from "validator";
const apiUrl = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL : apiUrl
});

const Cadastro = () => {

  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    celular: '',
    cidade:'',
    bairro: '',
    rua: '',
    numero: '',
    cpf: '',
    senha: '',
    confirmaSenha: '',
    cpf_login: "",
    senha_login: "",
    mostrarLogin:true

  });

  const [formStatus, setFormStatus] = useState({
    className : "",
    message : ""
  })

  const { nome, email, celular, cidade, bairro, rua, numero, cpf, senha, confirmaSenha, cpf_login, senha_login, mostrarLogin } = formData;
  const [showErroEmail, setShowErroEmail] = useState(false); 
  const handleChange = (e) => {
    const { name, value } = e.target;
  
    // Verifica se o campo é o CPF e aplica a máscara
    if (name === 'cpf' || name ==='cpf_login') {
      const formattedValue = value.replace(/\D/g, ''); // Remove caracteres não numéricos
      console.log(formattedValue);
      setFormData({ ...formData, [name]: formattedValue });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const validaFormulario = (data) => {

   // validar cpf 
    const cpfValue = data.cpf.replace(/[^\d]+/g, ''); // remove non-numeric characters
    if (!cpfValidate.isValid(cpfValue)){
      setFormStatus({className:"alert alert-danger", message: "O CPF informado é inválido."})
      return false;
    }
    if(data.senha != data.confirmaSenha){
      setFormStatus({className:"alert alert-danger", message: "A confirmação da senha deve ser identica a senha."})
      return false;
    }

    if( validator.isEmail(data.email) == false ){
      setFormStatus({className:"alert alert-danger", message: "Precisa inserir um e-mail válido."})
      return false;
    }

    return true;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();

    if(!validaFormulario(formData)){
      return
    }

    await api.post("/usuarios",  formData,{params: formData} ).then(response => {

      console.log("response usuarios");
      console.log(response.data);
      if(response.data.Inserido > 0){
        setFormData({ ...formData, mostrarLogin: true, cpf_login:cpf })
        setFormStatus({className:"alert alert-success", message:'Usuário cadastrado com sucesso! Faça Login para continuar...'})

      }
    }).catch(err => {

      if(err.response.data){

        const texto = err.response.data.error;
        console.log(texto) 

        if (texto.includes("Duplicate entry") && texto.includes("usuarios.email")) {
          const mensagem = `Email ${formData.email} já cadastrado!`;
          setFormStatus({className:"alert alert-danger", message: mensagem})
        } else if (texto.includes("Duplicate entry") && texto.includes("usuarios.cpf")) {
          const mensagem = `CPF ${formData.cpf} já cadastrado!`;
          setFormStatus({className:"alert alert-danger", message: mensagem})
        } else{
          setFormStatus({className:"alert alert-danger", message: texto})
        }

      }else{
        console.log(err)
      }
    })

  }


  // const verifyEmail = async (email) => {

  //     await 
  //     // api.get(
  //     //     "http://localhost:3001/api/clientes/verificar-email-disponivel?email=" + email,
  //     //   );
  //     api.get(`http://localhost:3001/api/clientes/verificarEmailDisponivel/` + email)
  //     .then(response => {
  //         console.log(response.data);
  //         if(response.data.disponivel == false){
  //             setShowErroEmail(true)
  //         }else{
  //             setShowErroEmail(false) 
  //         }
          
  //     })
  //     .catch(error => {
  //         console.error(error);
  //     });
  // };

  const handleLogin = async () => {
    console.log(formData);

    const credenciais = {cpf:formData.cpf_login, senha:formData.senha_login};

    await api.post("/login", credenciais ,{params: credenciais} ).then(response => {

      console.log("response login");
      console.log(response.data);
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', response.data.nome);
      localStorage.setItem('id_user', response.data.id);     
      localStorage.setItem('permissoes', response.data.permissoes);

      window.location.href = '/Produtos';
      // if(response.data.insertId > 0){
      //   setFormData({ ...formData, mostrarLogin: true })
      //   setFormStatus({className:"alert alert-success", message:'Usuário cadastrado com sucesso! Faça Login para continuar...'})

      // }
    }).catch(err => {

      if(err.response.data){
        console.log(err.response.data)
        setFormStatus({className:"alert alert-danger", message: err.response.data.message})
      }else{
        console.log(err)
      }
    })
  }

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleLogin();
    }
  };

  const handleBlur = () => {
    const cpfValue = formData.cpf.replace(/[^\d]+/g, ''); // remove non-numeric characters
    
    if (!cpfValidate.isValid(cpfValue)){
      setFormStatus({className:"alert alert-danger", message: "O CPF informado é inválido."})
    }else{
       setFormStatus({className:"", message: ""})
    }
  };  

  return (
    <Container>
        <Row className="row">

            {/* <Col className='text-center' md={2}>
              <p style={{marginTop:"30px", color: "#998787"}}>ou</p>
            </Col> */}

            {(mostrarLogin) && (
              
            <Col md={12}  >


              <h3 className="text-center mt-5">Login</h3>

              <br />
              <hr />
              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formCEP">
                  <Form.Label>CPF</Form.Label>
                  <InputMask
                    mask="999.999.999-99"
                    value={cpf_login}
                    onChange={handleChange}
                    onKeyDown={handleKeyDown}
                    className="form-control"
                    placeholder="CPF"
                    name="cpf_login"
                    inputMode="numeric"
                  />  
                  </Form.Group>

                <Form.Group controlId="formSenha">
                  <Form.Label>Senha</Form.Label>
                  <Form.Control type="password" placeholder="Senha" name="senha_login" value={senha_login} onChange={handleChange} onKeyDown={handleKeyDown}/>
                </Form.Group>
                <br />
                <Button variant="default" className='btn-padrao' onClick={handleLogin}>
                    Login
                </Button>
                <Button   className={`btn-padrao`} hidden={formStatus.className == 'alert alert-success'} style={{float: "right"}} variant="default" onClick={ () => { setFormData({ ...formData, mostrarLogin: false })}}  >
                  Cadastre-se
                </Button>  
                <br />              
                <Button style={{float:"right"}} variant="default" className="ml-2">
                    Esqueci minha senha
                </Button>
                <br />
                <br />

              </Form>
            </Col> 
          ) || (
            <Col md={12}>

                <h3 className="text-center mt-5">Cadastre-se </h3>
                <Button style={{float: "right", fontStyle: "italic", color: '#918961'}} variant="default" onClick={ () => { setFormData({ ...formData, mostrarLogin: true })}}  >
                   ou efetuar Login
                </Button>
                <br />
                <hr />
                <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNome">
                <Form.Label>Nome</Form.Label>
                <Form.Control type="text" placeholder="Nome" name="nome" value={nome} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formEmail">
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" placeholder="Email" name="email" value={email} onChange={handleChange} />
                </Form.Group>
                <Alert show={showErroEmail} key={'danger'} variant={'warning'}>
                    Email já cadastrado.  <a href="#" style={{ color: 'blue', textDecoration: 'underline' }}>Recuperar a senha</a>
                </Alert>
                <Form.Group controlId="formCelular">
                <Form.Label>Celular</Form.Label>
                <Form.Control type="tel" placeholder="Celular" name="celular" value={celular} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formEndereco">
                <Form.Label>Cidade</Form.Label>
                <Form.Select name="cidade" value={cidade} onChange={handleChange}>
                    <option value="">
                        Selecione
                    </option>
                    <option value="Santo Hipólito">
                        Santo Hipólito
                    </option>
                    <option value="Monjolos">
                        Monjolos
                    </option>      
                    <option value="Rodeador">
                        Rodeador
                    </option>  
                    <option value="Água Boa">
                        Água Boa
                    </option>                                                        
                </Form.Select>
                </Form.Group>


                <Form.Group controlId="formEndereco">
                <Form.Label>Bairro</Form.Label>
                <Form.Control type="text" placeholder="Bairro" name="bairro" value={bairro} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formEndereco">
                <Form.Label>Rua</Form.Label>
                <Form.Control type="text" placeholder="Rua" name="rua" value={rua} onChange={handleChange} />
                </Form.Group>          

                <Form.Group controlId="formEndereco">
                <Form.Label>N°</Form.Label>
                <Form.Control type="text" placeholder="Número" name="numero" value={numero} onChange={handleChange} style={{width:"100px"}}/>
                </Form.Group>                        

                <Form.Group controlId="formCEP">
                <Form.Label>CPF</Form.Label>
                {/* <Form.Control type="text" placeholder="CPF" name="cpf" value={cpf} mask="999.999.999-99" onChange={handleChange} /> */}
                <InputMask
                  mask="999.999.999-99"
                  value={cpf}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  className="form-control"
                  placeholder="CPF"
                  name="cpf"
                  inputMode="numeric"

                />
                </Form.Group>

                <Form.Group controlId="formSenha">
                <Form.Label>Senha</Form.Label>
                <Form.Control type="password" placeholder="Senha" name="senha" value={senha} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formSenha">
                <Form.Label>Confirmar Senha</Form.Label>
                <Form.Control type="password" placeholder="Confirmar Senha" name="confirmaSenha" value={confirmaSenha} onChange={handleChange} />
                </Form.Group>                
                <br />
                <Button className='btn-padrao' variant="default" type="submit">
                    Cadastrar
                </Button>

                <br />
                <br />
                
                </Form>
            </Col>
          )}
        </Row>
        <div className={formStatus.className} role="alert">
            {formStatus.message}
        </div>
    </Container>
  )}

export default Cadastro;
