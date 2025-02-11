import React, { useState } from 'react';
import Papa from 'papaparse';
import "./css/ProdutosImportar.css"
import { Button } from 'react-bootstrap';
import axios from 'axios';

function ProdutosImportar({ products, setProducts }) {
  const [selectedDate, setSelectedDate] = useState('');

  const apiUrl = process.env.REACT_APP_API_URL;
  const api = axios.create({
    baseURL: apiUrl
  });

  const handleDateChange = (event) => {
    setSelectedDate(event.target.value);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log(file);
    Papa.parse(file, {
      header: true,
      transformHeader: (header) => header.toLowerCase(), // Converte para minúsculas
      complete: (result) => {
        setProducts(result.data);
        console.log(result.data);
        e.target.value = null;
      },
    });
  };

  const handleAplicarPreco = async () => {
    if (!selectedDate) {
      alert('Selecione a Data Limite da disponibilidade dos produtos.');
      return;
    }

    const data = {
      products: products,
      dataLimite: selectedDate
    };

    console.log(products);

    await api.post("/aplicar-preco", data, { headers: { authorization: `Bearer ${localStorage.getItem('token')}` } }).then(response => {
      console.log("response aplicar preço");
      console.log(response.data);
      alert('Produtos adicionados: ' + response.data.quantidadeProdutosAdicionados);
      window.location.href = '/Produtos';
    }).catch(err => {
      console.log(err);
      if (err.response.data) {
        alert(err.response.data);
      }
    });
  };

  const handleInputChange = (index, field, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][field] = value;
    setProducts(updatedProducts);
  };

  return (
    <div>
      <div className="table-container">
        <div className="row">
          <div className="col-md-6">
            <input type="file" onChange={handleFileChange} />
          </div>
          <div className="col-md-6">
            <label htmlFor="date-input" className="form-label">Data Limite:</label>
            <input
              type="date"
              className="form-control"
              id="date-input"
              value={selectedDate}
              onChange={handleDateChange}
              style={{ maxWidth: "200px" }}
            />
          </div>
        </div>

        <br />
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Qtd Estoque</th>
              <th>% CashBack</th>
              <th>Category</th>
              <th>Codigo</th>
              <th>Inativo</th>
              <th>Remover</th>
            </tr>
          </thead>
          <tbody>
            {products.filter(product => product.inativo !== 1) // Filtra apenas produtos ativos
            .map((product, index) => (
              <tr key={index}>
                <td>
                  <input
                    value={product.name}
                    onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="text"
                    value={product.price}
                    onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={product.qtdestoque}
                    onChange={(e) => handleInputChange(index, 'qtdestoque', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={product.cashbackpercentual}
                    onChange={(e) => handleInputChange(index, 'cashbackpercentual', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    value={product.category}
                    onChange={(e) => handleInputChange(index, 'category', e.target.value)}
                  />
                </td>
                <td>
                <input
                    value={product.codigo}
                    onChange={(e) => handleInputChange(index, 'codigo', e.target.value)}
                  />                  
                  </td>
                <td>{product.inativo}</td>
                <td>
                <button className='btn btn-danger' onClick={() => {
                  const updatedProducts = products.map((product, i) => 
                    i === index ? { ...product, inativo: 1 } : product
                  );
                  
                  setProducts(updatedProducts);
                }}>
                    X
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <br />
        <Button className='btn-padrao' variant="default" onClick={handleAplicarPreco}>
          Aplicar Preço
        </Button>
        <Button style={{ float: 'right' }} className='btn-default' variant="default" onClick={() => { setProducts([]) }}>
          Limpar
        </Button>
      </div>
    </div>
  );
}

export default ProdutosImportar;