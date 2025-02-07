import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;
const api = axios.create({
    baseURL : apiUrl
  });


const Entregar = () => {
  const [pedidos, setPedidos] = useState([]);
  const [pedidoSelecionado, setPedidoSelecionado] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);  

  useEffect(() => {
    // Simulação de uma busca de pedidos na API
    const fetchPedidos = async () => {
      // Substitua com a chamada real à API

      try {

        const response = await api.get('/pedidosEntregar');
        if (!response.data) {
          throw new Error('Erro ao buscar pedidos');
        }
        const data = await response.data;
        setPedidos(data);

      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }

    };

    fetchPedidos();
  }, []);

  const handleSelectPedido = async (pedido) => {
    const response = await api.get('/pedido?idPedido='+pedido.idpedidos);
    setPedidoSelecionado(response.data);
    setShowModal(true);
  };

  const handleConfirmarEntrega = async () => {
    // Aqui você processa a confirmação da entrega
    console.log('Pedido entregue:', pedidoSelecionado);
    const response = await api.post('/entregarPedido',  pedidoSelecionado,{params: pedidoSelecionado} ).catch(err => {
      console.log(err)
      if(err.response.data){
        alert(err.response.data);
      }
    });

    console.log(response);
    alert(response.data);
    window.location.reload();
    setShowModal(false);
  };

  const handleQuantidadeChange = (e, index) => {
    const newQuantidade = parseInt(e.target.value, 10);
    const updatedItens = pedidoSelecionado.map((item, i) =>
      i === index ? { ...item, qtd: newQuantidade } : item
    );
    setPedidoSelecionado(updatedItens);
  };  

  return (
    <div>
      <br />
      <h2>Pedidos - Pendentes de entrega</h2>
      <br />
        <Table striped bordered>
            <thead>
            <tr>
                <th>Código</th>
                <th>Entrega</th>
                <th>Total</th>
                <th>Data</th>
                <th>Previsão Entrega</th>
            </tr>
            </thead>
            <tbody>
                {pedidos.map((pedido, index) => (
                <tr key={pedido.idpedidos}>
                    <td>{pedido.idpedidos}</td>
                    <td>{pedido.endereco}{" - "}{pedido.cidade}</td>
                    <td> {pedido.valortotal} </td>
                    <td> {new Date(pedido.inseridoem).toLocaleDateString()}</td>
                    <td>{new Date(pedido.previsaoentrega).toLocaleDateString()}</td>
                    <td> <Button onClick={() => handleSelectPedido(pedido)} style={{float:"right"}}>Entregar</Button> </td>
                    {/* <td> </td> */}
                </tr>
                ))}
            </tbody>
        </Table>

      {/* <ul>
        {pedidos.map(pedido => (
          <li key={pedido.idPedidos} style={{height:"3em"}}>
            <span>{pedido.nome}</span>
            <span> {" - "}{pedido.cidade}</span>         
            <span> {" "} {pedido.endereco}</span>
            <span> {" - Total: "} {pedido.valorTotal} </span>
            
            <span> {" - Pedido em: "} {pedido.inseridoEm}</span>
            <span>{" - Previsão de Entrega: "} {pedido.previsaoEntrega}</span>
            <span>{"  "}</span>
            <Button onClick={() => handleSelectPedido(pedido)} style={{float:"right"}}>Entregar</Button>
            <hr />
          </li>
          
        ))}
      </ul> */}

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Confirmar Entrega</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {pedidoSelecionado[0] && (
            <div>
              <h5>Pedido: {pedidoSelecionado[0].idpedidos}</h5>
              <br />
              <Table striped bordered>
                <thead>
                    <tr>
                        <th>Produto</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                    </tr>
                </thead>
                <tbody>
                    {pedidoSelecionado.map((item, index) => (
                    <tr key={index}>
                        <td>{item.name}</td>
                        <td>{item.price}</td>
                        <td>  <input type='number' value={item.qtd} onChange={(e) => handleQuantidadeChange(e, index)}/></td>                       
                    </tr>
                    ))}
 
                </tbody>
              </Table>
              <ul>

              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleConfirmarEntrega}>
            Confirmar Entrega
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Entregar;
