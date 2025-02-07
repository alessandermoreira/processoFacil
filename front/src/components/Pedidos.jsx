import React, { useState, useEffect } from 'react';
import axios from "axios";
import { Button, Modal, Offcanvas } from 'react-bootstrap';
import { BagFill } from 'react-bootstrap-icons';
import BlinkingLight from './BlinkingLight';
import { FaSearch } from 'react-icons/fa'; 

const apiUrl = process.env.REACT_APP_API_URL;
const api = axios.create({
    baseURL : apiUrl
  });

function Pedidos() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const idUsuario = localStorage.getItem('id_user');
  const [showPix, setShowPix] = useState(false);
  const [pixPagamento, setPixPagamento] = useState({});

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const [produtosPedido, setProdutosPedido] = useState([]);

  const handleVisualizarPedido = async (codigoPedido) => {

    const response = await api.get('/pedido?idPedido='+codigoPedido);
    if (!response.data) {
      throw new Error('Erro ao buscar pedidos');
    }

    setProdutosPedido((await response).data);
    setShow(true);
  }

  useEffect(() => {
    // Função para buscar os pedidos do cliente
    const fetchOrders = async () => {
      try {
        const response = await api.post('/pedidos?idUsuario='+idUsuario);
        if (!response.data) {
          throw new Error('Erro ao buscar pedidos');
        }
        const data = await response.data;
        setOrders(data);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div>Carregando pedidos...</div>;
  }

  if (error) {
    return <div>Erro: {error}</div>;
  }

  const approveOrder = (idOrder) => {
    setOrders((orders) =>
    orders.map((order) =>
        order.idpedidos === idOrder ? { ...order, pagamentoaprovado: 1 } : order
      )
    );
  };

  const handleReGerarPix = async (idPagamentoMercadoPago, idPedido) => {

    if(!idPagamentoMercadoPago || idPagamentoMercadoPago == 'null'){
      
    }
    else{

      const response = await api.post(`check-payment?id=${idPagamentoMercadoPago}&idPedido=${idPedido}`).catch(async err => {      
        console.log(err)
        if(err.response.data == 'ENOTFOUND'){
          const res = await api.post(`/remake-payment?idPagamentoMercadoPago=${idPagamentoMercadoPago}&idPedido=${idPedido}` ).catch(err => {  
            // se error    
            console.log(err)
            if(err.response.data){
              alert(err.response.data);
            }
          })
          // se não responde res.data
          console.log("log remake payment")
          console.log(res.data)
        }
      })

      // setStatusBuyMercadoPago(response.data)
      if (response.data && response.data.status == "approved"){
        approveOrder(idPedido);
        console.log(orders);
      }else if (response.data && response.data.status == "cancelled"){
        const res = await api.post(`/remake-payment?idpagamentomercadopago=${idPagamentoMercadoPago}&idpedido=${idPedido}`).catch(err => {  
          // se error    
          console.log(err)
          if(err.response.data){
            alert(err.response.data);
          }
        })
        // se não responde res.data
        console.log("log remake payment")
        console.log(res.data);
        setPixPagamento(res.data.point_of_interaction.transaction_data.ticket_url);
        setShowPix(true);
        // window.open(res.data.point_of_interaction.transaction_data.ticket_url, '_blank', 'noopener,noreferrer');

      }else if(response.data) {
        setPixPagamento(response.data.point_of_interaction.transaction_data.ticket_url);
        setShowPix(true);        
        // window.open(response.data.point_of_interaction.transaction_data.ticket_url, '_blank', 'noopener,noreferrer');
      }

  }

  }

  return (
    <div>
      <Modal show={showPix} onHide={() => setShowPix(false)} style={{ width: '100%', height: '100%' }}>
        <Modal.Header closeButton>
          <Modal.Title>Realize o pagamento</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <iframe src={pixPagamento} width="100%" height="820px" frameborder="0"></iframe>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {setShowPix(false)}} >Fechar</Button>
        </Modal.Footer>
      </Modal>


      {/* <Offcanvas show={showPix} onHide={()=>{setShowPix(false)}}>
        <Offcanvas.Header closeButton>
            <Offcanvas.Title> Realize o pagamento <BagFill style={{marginBottom:"5px"}}/> </Offcanvas.Title> 
        </Offcanvas.Header>
        <Offcanvas.Body>
        <iframe src={pixPagamento} width="100%" height="820px" frameborder="0"></iframe>
        </Offcanvas.Body>
      </Offcanvas> */}


      <h1>Meus Pedidos</h1>
      {orders.length === 0 ? (
        <p>Você não tem pedidos.</p>
      ) : (
        <ul>
          {orders.map((order) => (
            
            <li key={order.idpedidos}>
              <h2>Pedido Nº{order.idpedidos}</h2>                

              <span>Status: <b>
              {order.pagamentoaprovado === 1 ? 
                <>
                    {order.entregueem ?                      
                      <Button style={{ backgroundColor: "#40c0cb", border: "none", cursor: "none", color: "auto" }}>
                          Pedido Entregue em {new Date(order.entregueem).toLocaleDateString()}
                      </Button>  
                      : 
                        <>
                          <Button style={{ backgroundColor: "green", border: "none", cursor: "none", color: "auto" }}>
                              Pagamento Aprovado
                          </Button> 
                          {"  "}
                          <span>
                            <BlinkingLight /> Previsão de Entrega: {new Date(order.previsaoentrega).toLocaleDateString()}
                          </span>
                        </>
                    }
                    
                </>
                : 
                <>
                    Pagamento Pendente {"  "}
                    <Button className='btn-padrao' onClick={() => handleReGerarPix(order.idpagamentomercadopago, order.idpedidos)}>
                        Pagar com Pix
                    </Button>
                </>
              }

                              {/* {order.pagamentoAprovado === 1 ? 
                                <> <Button style={{backgroundColor:"green", border:"none", cursor:"none", color:"auto"}} >Pagamento Aprovado</Button> <span>  <BlinkingLight/> Previsao de Entrega: {new Date(order.previsaoEntrega).toLocaleDateString() } </span></>
                                  : <>Pagamento Pendente <Button className='btn-padrao'  onClick={() => handleReGerarPix(order.idPagamentoMercadoPago, order.idPedidos)} >Pagar com Pix</Button> </>}  */}
                                </b></span> <span style={{float:'right'}}>Data: {new Date(order.inseridoem).toLocaleDateString()}</span>  
              <p>Valor Total: {order.valortotal}</p>
              <a style={{'cursor': 'pointer'}} onClick={() => {handleVisualizarPedido(order.idpedidos)}} >Ver items  <FaSearch size={16} color="#333" /> </a>
              <hr />
            </li>

          ))}
        </ul>
      )}
        <Offcanvas show={show} onHide={handleClose}>
            <Offcanvas.Header closeButton>
                <Offcanvas.Title> Itens do pedido <BagFill style={{marginBottom:"5px"}}/> </Offcanvas.Title> 
            </Offcanvas.Header>
            <Offcanvas.Body>
              {produtosPedido.map( item =>(
                <div> {item.qtd} - {item.name} - Total: {item.qtd * item.price}</div>
              ))}
              {/* <Cesta produtos={cesta} setProducts={setCesta}/> */}
                {/* <Button href="/Payment" products={cesta} setProducts={setCesta} >Fechar Pedido</Button> */}


            </Offcanvas.Body>
      </Offcanvas>
    </div>
  );
}

export default Pedidos;
