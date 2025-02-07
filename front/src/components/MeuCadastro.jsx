import React, { useEffect, useState } from 'react';
import './css/MeuCadastro.css';
import axios from 'axios';
import { Form } from 'react-bootstrap';

const apiUrl = process.env.REACT_APP_API_URL;
const api = axios.create({
    baseURL : apiUrl
  });
const MeuCadastro = () => {
  const [user, setUser] = useState({
    nome: '',
    celular: '',
    cidade: '',
    bairro: '',
    rua: '',
    numero: '',
    email: '',
    cpf: '',
    senha: '',
    data_criacao: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prevUser) => ({
      ...prevUser,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você pode adicionar a lógica para enviar o formulário
    console.log(user);
    const data = {
                    cidade : user.cidade, 
                    bairro: user.bairro, 
                    rua: user.rua, 
                    numero : user.numero, 
                    idUsuario : localStorage.getItem("id_user")
                }

    const res = await api.put('/set-addr-user',  data,{params: data} ).catch(err => {
        console.log(err)
      });

    if(res.data.affectedRows) {
        alert('Cadastro alterado com sucesso!')
        window.location.href = '/'
    }
    
    console.log(res);
  };


  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get('/get-user?id='+localStorage.getItem('id_user') ); // replace with your endpoint URL
        // const products = response.data.map((product) => ({...product, qtd: 0 }));
        setUser(response.data[0]);
        console.log(user);
        console.log('user');

      } catch (error) {
        console.error(error);
      }
    };
    fetchProducts();
  }, []);   

  return (
    <>
        <br />
        <h2 className="text-center">Meu Cadastro</h2>
        <br />

        <form onSubmit={handleSubmit} className="user-form">
            <div className="form-group">
                <label htmlFor="nome">Nome:</label>
                <input disabled type="text" id="nome" name="nome" value={user.nome} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="celular">Celular:</label>
                <input disabled type="tel" id="celular" name="celular" value={user.celular} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="cpf">CPF:</label>
                <input disabled type="text" id="cpf" name="cpf" value={user.cpf} onChange={handleChange} required />
            </div>   
            <div className="form-group">
                <label htmlFor="email">Email:</label>
                <input disabled type="email" id="email" name="email" value={user.email} onChange={handleChange} required />
            </div>                     
            <div className="form-group">
                <label htmlFor="cidade">Cidade:</label>
                <Form.Select style={{backgroundColor:"white"}} name="cidade" value={user.cidade} onChange={handleChange}>
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
            </div>
            <div className="form-group">
                <label htmlFor="bairro">Bairro:</label>
                <input type="text" id="bairro" name="bairro" value={user.bairro} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="rua">Rua:</label>
                <input type="text" id="rua" name="rua" value={user.rua} onChange={handleChange} required />
            </div>
            <div className="form-group">
                <label htmlFor="numero">Número:</label>
                <input type="text" id="numero" name="numero" value={user.numero} onChange={handleChange} required />
            </div>

            <button type="submit">Salvar</button>
        </form>
    </>
  );
};

export default MeuCadastro;
