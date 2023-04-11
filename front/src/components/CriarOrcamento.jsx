import React, { useState } from "react";
import { Container, Row, Col, Form, Button, ListGroup } from "react-bootstrap";

const BudgetPage = () => {
  const [item, setItem] = useState("");
  const [price, setPrice] = useState("");
  const [items, setItems] = useState([]);
  const [editingIndex, setEditingIndex] = useState(null);

  const handleSubmit = (event) => {
    event.preventDefault();
    if (editingIndex === null) {
      setItems([...items, { item, price }]);
    } else {
      const newItems = [...items];
      newItems[editingIndex] = { item, price };
      setItems(newItems);
      setEditingIndex(null);
    }
    setItem("");
    setPrice("");
  };

  const handleEdit = (index) => {
    setItem(items[index].item);
    setPrice(items[index].price);
    setEditingIndex(index);
  };

  return (
    <Container className="my-5">
      <Row>
        <Col xs={12}>
          <h1 className="text-center">Orçamento de Produtos de Mercado</h1>
        </Col>
        <Col xs={12}>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="item">
              <Form.Label>Item</Form.Label>
              <Form.Control
                type="text"
                placeholder="Digite o nome do item"
                value={item}
                onChange={(event) => setItem(event.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="price">
              <Form.Label>Preço</Form.Label>
              <Form.Control
                type="number"
                placeholder="Digite o preço"
                value={price}
                onChange={(event) => setPrice(event.target.value)}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              {editingIndex === null ? "Lançar Orçamento" : "Atualizar Orçamento"}
            </Button>
          </Form>
        </Col>
        <Col xs={12} className="my-5">
          <h2>Itens Cadastrados</h2>
          <ListGroup>
            {items.map((item, index) => (
              <ListGroup.Item key={index}>
                {item.item}: R${item.price}
                <Button
                  className="ml-2"
                  variant="secondary"
                  onClick={() => handleEdit(index)}
                >
                  Editar
                </Button>
              </ListGroup.Item>
            ))}
          </ListGroup>
        </Col>
      </Row>
    </Container>
  );
};

export default BudgetPage;