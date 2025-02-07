import React, { useReducer, useState } from "react";
import { Button } from "react-bootstrap";
import {ArrowUp, ArrowDown, ArrowUpLeftCircle, ArrowLeftCircle, ArrowRightCircle} from 'react-bootstrap-icons'
import formatCurrency from "../funcoes/formatarValor";

const Produtos = ({products,setProducts}) => {

    const formReducer = (state, event) => {
        return {...state,
                [event.name] : event.value
        }
      }
    // const [products, setProducts] = useState( cesta
    // //   [
    // //   { id: 1, name: 'Product 1', price: 10.99, qtd: 1, category: 'limpeza' },
    // //   { id: 2, name: 'Product 2', price: 20.99, qtd: 1, category: 'alimentação' },
    // //   { id: 3, name: 'Product 3', price: 30.99, qtd: 1, category: 'beleza' },
    // //   { id: 4, name: 'Product 4', price: 40.99, qtd: 1, category: 'limpeza' },
    // //   { id: 5, name: 'Product 5', price: 50.99, qtd: 1, category: 'alimentação' },
    // //   { id: 6, name: 'Product 6', price: 60.99, qtd: 1, category: 'beleza' },
    // // ]
    
    // )

    // const [products, setProducts] = useReducer(formReducer, {})

    const handleDecProduto = (id) => {
        const index = products.findIndex(product => product.id === id);
        if (index === -1) return;
        
        const updatedProduct = {
            ...products[index]
        };
        updatedProduct.qtd--; 
  
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
        if(updatedProduct.qtd < updatedProduct.qtdrestante)
            updatedProduct.qtd++; 
            
  
        const updatedProducts = [...products];
        updatedProducts[index] = updatedProduct;
        setProducts(updatedProducts);
    }

    const [formData, setFormData] = useReducer(formReducer, {})
    const handleChange = event => {
      setFormData({
        name : event.target.name, 
        value : event.target.value
      })
    }

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
            {/* const token = localStorage.getItem('token'); */}

            {/* <h1>Olá {localStorage.getItem('user')}</h1> */}
            <br />
            <h2 style={{textAlign:"center"}}>Monte sua cesta de produtos</h2>
            <div style={{width:"70%", marginLeft:"15%"}}>
            
            <br />
            {Object.keys(groupedProducts).map(category => (
            <div key={category} className="product-category">
                <h3>{category}</h3>
                
                <ul>
                    {groupedProducts[category].map(product => (
                        <li key={product.id} className="product-item">
                            <strong>{product.name}</strong>  
                           
                            <br />
                            <div className="row">
                            <div className="col-6">
                                {product.price}
                                {product.qtd > 0 && (
                                    <span>
                                        {" "} x {product.qtd} = {formatCurrency( product.qtd * product.price)}
                                    </span>
                                )}
                                {" "}   
                                <div style={{ color:"blue", background: "yellow"}} className="badge">
                                    {product.cashbackpercentual}% Cashback
                                </div> 
                                {" "}     
                                <div style={{background:"blue", color:"yellow"}} className="badge">
                                    {product.qtdrestante} disponíveis
                                </div>                                                             

                            </div>
 
                            <div className="col-6">
                                
                                <div onClick={() => handleAddProduto(product.id)}  style={{float:"right", fontSize:"2em"}}>
                                    <ArrowRightCircle />
                                </div>
                                
                                {product.qtd > 0 &&  <span style={{float:"right", fontSize:"2em", marginRight:"5px", marginLeft:"5px"}} > {product.qtd} </span> }
                                {
                                    product.qtd > 0 && 
                                        <div onClick={() => handleDecProduto(product.id)} style={{float:"right", fontSize:"2em"}}>
                                            <ArrowLeftCircle/>
                                        </div> 
                                }

                            </div>
                            </div>

                            <hr />
                        </li>
                    ))}
                </ul>
            </div>
))}

            </div>

        </>
      );
};

export default Produtos;