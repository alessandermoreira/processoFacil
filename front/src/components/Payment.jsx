import React, { useEffect, useState } from "react";
import { Form, Button, Container, Row, Col } from "react-bootstrap";
import axios from "axios";
import { ArrowDown, X } from "react-bootstrap-icons";
import Cesta from "./Cesta";
import formatCurrency from "../funcoes/formatarValor";
import { Link, Navigate, useNavigate } from "react-router-dom";
import InputMask from "react-input-mask";
import { format } from 'date-fns';
import validator from "validator";
import "./css/Payment.css";
const apiUrl = process.env.REACT_APP_API_URL;
const api = axios.create({
  baseURL : apiUrl
});

 

const Payment = ({products, setProducts}) => {

  const totalValue = products.reduce((total, product) => total + product.qtd * product.price, 0);
  if(totalValue == 0){
    window.location.href = "/Produtos"
  }
  const navigate = useNavigate();

  const itensAdicionados = products.filter(product => product.qtd > 0);

  const idUsuario = localStorage.getItem("id_user");
  if(!idUsuario){
    navigate("/Cadastro");
  }
  const formattedTotalValue = formatCurrency(totalValue);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/get-user?id='+localStorage.getItem('id_user') ); // replace with your endpoint URL
        // const products = response.data.map((product) => ({...product, qtd: 0 }));
        setFormData(response.data[0]);
        console.log(formData);
        console.log('user-data');

      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []); 

  // setTimeout((linkBuyMercadoPago) => {
  //   if(linkBuyMercadoPago){
  //     getStatusPayment()
  //   }
  // }, 5000); // Alterne a cada 1 segundo (1000 milissegundos)

  // const { nome,  email, telefone, endereco, cidade, cpf  } = formData;
  const [showErroEmail, setShowErroEmail] = useState(false); 
  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });
  
    // api.interceptors.request.use(async config => {
    //   const token =   'APP_USR-8168566445244872-022618-aabe97c788995bd5c883f5c550b528e7-764351950';
    //   config.headers.Authorization = `Bearer ${token}`;
    //   return config;
    // });

  const [password, setPassword] = useState("");

  const handleSubmit = async (event) => {
      event.preventDefault();
      // console.log(formData)

      if(validator.isEmail(formData.email) == false){
        alert('Email inválido!')
        return
      }

      const data = {
        "transaction_amount" : totalValue.toFixed(2),
        "description" : "produtos",
        "payment_method_id": "pix",
        "payer" : {
          "email" : formData.email,
          "first_name" : formData.nome,
          // "last_name" : "Moreira",
          "identification" : {
            "type" : "CPF",
            "number" : formData.cpf
          }
        },
        "celular" : formData.celular,
        "endereco" : `n°${formData.numero}, rua ${formData.rua} bairro ${formData.bairro}`,
        "cidade" : formData.cidade,
        "idUsuario" : idUsuario,
        "itensAdicionados" : itensAdicionados
      }

      const headers = {
        'Content-Type' : 'text/plain',
        'Access-Control-Allow-Origin' : '*'
      }
      
      const pedidoRegistrado = await api.post("/registrar-pedido",  data,{params: data} ).catch(err => {
        console.log(err)
      });
      console.log(pedidoRegistrado)

      const insertId = pedidoRegistrado.data.pedidoId;

      if(insertId > 0){

        console.log("insertId");
        console.log(insertId);
        data.description = `Pedido Nº${insertId}`;
        data.idPedido = insertId;
        await api.post("/make-payment",  data,{params: data} ).then(response => {
          console.log("response make payment");
          console.log(response.data);
          setResponsePayment(response.data);
          setlinkBuyMercadoPago(response.data.point_of_interaction.transaction_data.ticket_url);
          getStatusPayment(response.data.id, insertId);
          window.scrollTo({
            top: 0,
            behavior: 'smooth' // Comportamento de rolagem suave
          });
        }).catch(err => {
          console.log(err)
          if(err.response.data){
            alert(err.response.data);
          }
        })
    }
  }
      
  const getStatusPayment = async (id, idPedido) => {


      const interval = setInterval(async () => {

        await api.post(`check-payment?id=${id}&idPedido=${idPedido}`).then(response => {
          console.log(response.data)
          setStatusBuyMercadoPago(response.data)
          if (response.data.status == "approved"){
            clearInterval(interval);
            // setProducts({});
          }
          
        })

      }, 5000); // Verifica a cada 5 segundos

    }
      
  const [responsePayment, setResponsePayment] = useState(false);
  const [linkBuyMercadoPago, setlinkBuyMercadoPago] = useState(false);
  const [statusBuyMercadoPago, setStatusBuyMercadoPago] = useState({});

  return (
    <Container> 
      
      {statusBuyMercadoPago.status == "approved" && (
      <div class="alert alert-success" role="alert">
        Parabéns {localStorage.getItem('user')} ! Sua compra foi realizada com sucesso !! <br/> Pagamento confirmado em {format(new Date(statusBuyMercadoPago.date_approved), 'dd/MM/yyyy HH:mm')}
      
      </div> )
        ||
      linkBuyMercadoPago && <iframe src={linkBuyMercadoPago} width="100%" height="820px" frameborder="0"></iframe> ||
      <>
        <Row className="justify-content-md-center mt-5">
            <Col md="5">
                <h2 style={{color:"696a6b"}}  >Ótimo {formData.nome}! Agora defina o local para entrega...</h2>
                <br></br>

              <Form onSubmit={handleSubmit}>
                <Form.Group controlId="formNome" hidden>
                <Form.Label>Nome</Form.Label>
                <Form.Control disabled type="text" value={formData.nome} placeholder="Nome" onChange={handleChange} name="nome" />
                </Form.Group>

                <Form.Group controlId="formEmail" hidden>
                <Form.Label>Email</Form.Label>
                <Form.Control type="email" disabled value={formData.email} placeholder="Email" onChange={handleChange} name="email" />
                </Form.Group>

                <Form.Group controlId="formCelular" hidden>
                <Form.Label>Celular</Form.Label>
                <Form.Control type="tel" disabled value={formData.celular} placeholder="Celular" onChange={handleChange} name="celular" />
                </Form.Group>

                <Form.Group controlId="formCPF" hidden>
                  <Form.Label>CPF</Form.Label>
                  <InputMask disabled
                    mask="999.999.999-99"
                    value={formData.cpf}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="CPF"
                    name="cpf"
                  />
                </Form.Group>

                <Form.Group controlId="formEndereco">
                <Form.Label>Cidade</Form.Label>
                <Form.Select style={{color:"black !important"}} name="cidade" value={formData.cidade} onChange={handleChange}>
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
                <Form.Control type="text" placeholder="Bairro" name="bairro" value={formData.bairro} onChange={handleChange} />
                </Form.Group>

                <Form.Group controlId="formEndereco">
                <Form.Label>Rua</Form.Label>
                <Form.Control type="text" placeholder="Rua" name="rua" value={formData.rua} onChange={handleChange} />
                </Form.Group>          

                <Form.Group controlId="formEndereco">
                <Form.Label>N°</Form.Label>
                <Form.Control type="text" placeholder="Número" name="numero" value={formData.numero} onChange={handleChange} style={{width:"100px"}}/>
                </Form.Group>                        


                </Form>
              <br />

          <br />
          <br />
          <h4>Produtos: </h4>
          <ul>
              {products.map(product => ((product.qtd > 0) && (
              <li key={product.id} className="product-item">
                  <strong>{product.name}</strong>
                <span style={{float:"right"}} >
                  { (product.qtd > 1) && product.qtd || ''} {product.qtd > 1 && <span>x</span> } {product.qtd > 1 && product.price } {product.qtd > 1 && <span>=</span> } {formatCurrency(product.qtd * product.price)}
                  {product.qtd > 1 }
                  </span>
                  <hr />
              </li>
              )))}
          </ul>

          <span style={{float:"right"}} >Total {formattedTotalValue}</span>
          <br />             
          <div>
            <Button className='btn-padrao' onClick={handleSubmit} >Gerar Pagamento</Button>
          </div>
          <br />             

          <br />             
        </Col>
        </Row>

      </>
      }
      {/* <div>
        <button type='button' onClick={getStatusPayment}>Verificar pagamento</button>
      </div> */}

    </Container>
  );
};

export default Payment;