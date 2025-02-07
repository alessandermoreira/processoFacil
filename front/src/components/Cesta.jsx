import React, { useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import {ArrowUp, ArrowDown, X, ArrowDownCircle, ArrowUpCircle} from 'react-bootstrap-icons'
import { HiArrowCircleUp } from "react-icons/hi";

import { Link } from "react-router-dom";
import formatCurrency from "../funcoes/formatarValor";
const formReducer = (state, event) => {
  return {...state,
          [event.name] : event.value
  }
}

const Cesta = ({products, setProducts}) => {

  const totalValue = products.reduce((total, product) => total + (product.qtd * product.price), 0);
    // const [products, setProducts] = useState( [
    //     { id: 1, name: 'Product 1', price: 10.99, qtd: 1, category: 'limpeza' },
    //     { id: 2, name: 'Product 2', price: 20.99, qtd: 1, category: 'alimentação' },
    //     { id: 3, name: 'Product 3', price: 30.99, qtd: 1, category: 'beleza' },
    //     { id: 4, name: 'Product 4', price: 40.99, qtd: 1, category: 'limpeza' },
    //     { id: 5, name: 'Product 5', price: 50.99, qtd: 1, category: 'alimentação' },
    //     { id: 6, name: 'Product 6', price: 60.99, qtd: 1, category: 'beleza' },
    //   ])
    
    const handleDecProduto = (id) => {
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return;
        
        
        const updatedProduct = {
            ...products[index]
        };
        if(updatedProduct.qtd > 0){
          updatedProduct.qtd--; 
        }
  
        const updatedProducts = [...products];
        updatedProducts[index] = updatedProduct;
        setProducts(updatedProducts);
    }

    const handleAddProduto = (id) => {
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return;
        
        
        const updatedProduct = {
            ...products[index]
        };
        
        if(updatedProduct.qtd < updatedProduct.qtdRestante)        
          updatedProduct.qtd++; 
  
        const updatedProducts = [...products];
        updatedProducts[index] = updatedProduct;
        setProducts(updatedProducts);
      
    }

    // const [formData, setFormData] = useReducer(formReducer, {})
    // const handleChange = event => {
    //   setFormData({
    //     name : event.target.name, 
    //     value : event.target.value
    //   })
    // }




      // Agrupa os produtos por categoria
      const groupedProducts = products.reduce((acc, product) => {
        if (!acc[product.category]) {
          acc[product.category] = [];
        }
        acc[product.category].push(product);
        return acc;
      }, {});


      return (
        <>
            {/* <h1 style={{textAlign:"center"}}>Produtos em sua cesta</h1> */}

            {(totalValue > 0) ? (<span>Valor Total: {formatCurrency(totalValue)}</span>) : ""}

            {/* <Link style={{float:"right"}} to="/Payment" >Fechar Pedido</Link> */}
            <br />
            <br />
            <div style={{width:"95%", marginLeft:"5%"}}>
              

            {Object.keys(groupedProducts).filter(category => {
              return groupedProducts[category].some(product => product.qtd > 0);
            }).map(category => ( 
                <div key={category} className="product-category">
                <h2>{category}</h2>
                
                <ul>
                    {groupedProducts[category].map(product => ((product.qtd > 0) && (
                    <li key={product.id} className="product-item">

                        <div className="row">
                          <div className="col-6">
                            <strong>{product.name}</strong>  
                            <br />
                            {product.price} x {product.qtd} = { formatCurrency(product.qtd * product.price)} 
                          </div>
                          <div className="col-6">
                          <div onClick={() => handleAddProduto(product.id)}  style={{float:"right", fontSize:"2em"}}>
                          <ArrowUpCircle />
                        </div>
                        <div onClick={() => ( (product.qtd == 1 && window.confirm('Remover produto da cesta?') && handleDecProduto(product.id)) || (product.qtd > 1 && handleDecProduto(product.id)))} style={{float:"right", fontSize:"2em"}}>
                          {product.qtd > 1 && ( 
                            <span>
                                <ArrowDownCircle/>
                            </span>
                          ) || (<X/> )}
                        </div>
                          </div>                          
                        </div>
 
                        <hr />
                    </li>
                    )))}
                </ul>
                </div>
            ))}

            
            </div>
            
        </>
      );
};

export default Cesta;