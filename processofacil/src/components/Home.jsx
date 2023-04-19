import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Form } from 'react-bootstrap';

const Home = () => {
  const [response, setResponse] = useState(null);
  const textareaRef = useRef(null);



  const pesquisarGPT = async() => {


    
    axios.get(`http://localhost:3001/api/chamarChatGPT/` , {
        params: {
          texto: textareaRef.current.value
        } } )
    .then(response => {
         
        const data = response.data;
        setResponse(data);
        console.log(data)
    })
    .catch(error => {
        console.error(error);
    });
  }

//   useEffect(() => {
//     fetchData();
//   }, []);

  return (
    <div>
    <Form>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>Example textarea</Form.Label>
        <Form.Control as="textarea" ref={textareaRef} rows={3} />
      </Form.Group>
    </Form>
    <Button onClick={pesquisarGPT} >Pesquisar no GPT</Button>
      {response ? (
        <div>
          <h2>Response:</h2>
          <p>{response}</p>
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  );
};

export default Home;