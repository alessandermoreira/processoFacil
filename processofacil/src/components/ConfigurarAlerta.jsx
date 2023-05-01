import React, { useState, useEffect } from "react";
import { Container, Row, Col, Form, Button, ListGroup, CloseButton } from "react-bootstrap";
import Select from 'react-select'
import axios from 'axios';
import { X } from 'react-bootstrap-icons';


const ConfigurarAlerta = ({url}) => {


  var usuarioLogado = "";
  if (localStorage.getItem('usuarioLogado'))
    usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));

  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);

  const [cidadesAlerta, setCidadesAlerta] = useState([]);
  const [palavrasChave, setPalavrasChave] = useState([]);



  const handleSubmit = (event) => {
    event.preventDefault();
    if(item){
      setItems([...items, { item }]);
      setItem("");

    }

    console.log("salvar")

    // else {
    //   const newItems = [...items];
    //   newItems[editingIndex] = { item, editingIndex };
    //   setItems(newItems);
    //   setEditingIndex(null);
    // }

  };

  const handleRemove = (index) => {

    console.log(index);
    // console.log(items.splice(index + 1, 1));
    const newItems = [...items]; // cria uma cópia do array original
    newItems.splice(index, 1); // remove o item com o índice especificado
    setItems( newItems );
  };

  useEffect(() => {
    axios.get(url +'/cidades', { headers: { Authorization: `Bearer ${usuarioLogado.token}` } })
      .then(response => {

        // const options = [
        //   { value: 'chocolate', label: 'Chocolate' },
        //   { value: 'strawberry', label: 'Strawberry' },
        //   { value: 'vanilla', label: 'Vanilla' }
        // ]

        const transformedData = response.data.cidades.map((value) => ({ value, label: value }));
        console.log(transformedData);
        setCidadesAlerta(transformedData);
        // setCidadesAlerta({value:'BH'}, {value: 'SH'})
      })
      .catch(error => {
        console.log(error);
      });
  }, []);  

  // const handleChangeSelect = (data) => {

  //   setCidadesAlerta(data)

  // }

  const data = [{ value:'One', selected:true }, { value: 'Two' }, { value:'Three' }]


  return (
    <Container className="my-5">
       {/* onChange={handleChangeSelect} */}
     
      <Row>
        <Col xs={12}>
          <h1 className="text-center">Configurar Alerta</h1>

          <hr />
          <br />
        </Col>
        <h2>Filtrar Municípios</h2>

        <Col xs={12}>
          <Form.Label>Receba alerta dos processos publicados pelas prefeituras selecionadas abaixo </Form.Label>
          <Select options={cidadesAlerta} Label={"Selecione"} isMulti/>
          <br />
          <hr />
          <br />
        </Col>
        <Col xs={12}>

          <Form onSubmit={handleSubmit}>

            <Form.Group controlId="item">
              <h2>Filtrar Palavras Chave</h2>   
              <Col >
                <Form.Control style={{width:"100%"}}
                  type="text"
                  placeholder="Ex.: Construção Civíl"
                  value={item}
                  onChange={(event) => setItem(event.target.value)}
                />
                <br />
                <Button style={{width:"100%"}} variant="" type="submit">
                  {/* {editingIndex === null ? "Adicionar" : "Atualizar"} */}
                  Adicionar
                </Button>
              </Col>
{/* 
              <Col xs={"6"} style={{"float":"right"}}>

              </Col>        */}

            </Form.Group>

            <br />
            <br />
          </Form>

        </Col>
     
        <Col md="12" sm={12} >
        {/* <Form.Label>Ou contenha as palavras chaves: </Form.Label> */}
            <ListGroup horizontal={'md'}>
              {items.map((item, index) => (
                
                <ListGroup.Item key={index}>
                  {item.item}
                      -
                    <CloseButton style={{ float:"right"}} onClick={() => handleRemove(index)}/>

                </ListGroup.Item>
              ))}

          </ListGroup>
   
        </Col>
        <Col md="12" sm={12}  className="my-5">


        {items[0] ? (
            <Button style={{width:"100%"}} variant="primary" onClick={handleSubmit} type="submit">
            {/* {editingIndex === null ? "Adicionar" : "Atualizar"} */}
              Salvar Configuração
            </Button>
      ) : (
        <div>Adicione algum item...</div>
      )}





        </Col>
      </Row>
    </Container>
  );
};

export default ConfigurarAlerta;