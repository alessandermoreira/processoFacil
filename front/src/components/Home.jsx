import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { Button, Card, Col, Container, Row } from 'react-bootstrap';
import { TextCenter } from 'react-bootstrap-icons';
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from './ExampleCarouselImage';
import './css/Home.css';
import BackgroundCarousel from './BackgroundCarousel';



const Home = () => {
  const [response, setResponse] = useState(null);
  const textareaRef = useRef(null);

  return (
    <div style={{ backgroundColor: '#ffc10742'}} className='App'>
      <BackgroundCarousel />
      <Container className='content'>
          <header className="my-4" style={{color:"white", fontSize:"2em", textShadow:"rgb(12, 66, 2) -2px 2px 5px"}}>
            <br />
            {/* <h1 className="text-center">Bem-vindo à Entrega Aki</h1> */}
            <br />
            <h1 className="text-center">Você compra aqui</h1>
            <br />
            <h1 className="text-center">Entregamos na sua casa</h1>                     
            <br />
            <br />
            <br />                        
             
          </header>
          <header className="my-4 text-center" style={{color:"white"}}>
             <Button style={{top:"50%", backgroundColor:'yellow', color:'#035816', fontWeight:'bold' }} href="/Produtos" variant="success">Aproveite !</Button>
          </header>          

        
        





          {/* <Carousel className="mb-4">
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="../imgs/home3.png"
                alt="Primeiro Produto"
              />
              <Carousel.Caption>
      
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="../imgs/home4.png"
                alt="Segundo Produto"
              />
              <Carousel.Caption>
      
              </Carousel.Caption>
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100"
                src="../imgs/home5.png"
                alt="Terceiro Produto"
              />
              <Carousel.Caption>

              </Carousel.Caption>
            </Carousel.Item>
          </Carousel>   */}
          
      </Container>
    </div>
  );
};

export default Home;