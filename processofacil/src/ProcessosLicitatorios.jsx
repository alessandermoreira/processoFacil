import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import moment from 'moment';
import { Telephone } from 'react-bootstrap-icons';

function ProcessosLicitatorios({url}) {

  var usuarioLogado = "";
  if (localStorage.getItem('usuarioLogado'))
    usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
  
  const [processos, setProcessos] = useState([]);
  const [cidades, setCidades] = useState([]);
  const [cidadeSelecionada, setCidadeSelecionada] = useState('');

  useEffect(() => {
    axios.get(url +'/cidades', { headers: { Authorization: `Bearer ${usuarioLogado.token}` } })
      .then(response => {
        setCidades(response.data.cidades);
      })
      .catch(error => {
        console.log(error);
      });
  }, []);

  useEffect(() => {
    if (cidadeSelecionada !== '') {
      axios.get(url +`/processos?cidade=${cidadeSelecionada}`, { headers: { Authorization: `Bearer ${usuarioLogado.token}` } })
        .then(response => {
          setProcessos(response.data.processos);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }, [cidadeSelecionada]);

  const handleCidadeChange = (event) => {
    setCidadeSelecionada(event.target.value);
  };

  return (<>
    <div className="container mt-4">
      <h1 className="mb-4">Pesquisar Processos Licitatórios</h1>
      <div className="row mb-4">
        <div className="col-sm-6">
          <select className="form-control" value={cidadeSelecionada} onChange={handleCidadeChange}>
            <option value="">Selecione uma cidade</option>
            {cidades.map(cidade => (
              <option key={cidade} value={cidade}>{cidade}</option>
            ))}
          </select>
        </div>
      </div>
      <h3 className="mb-4">Prefeitura de {cidadeSelecionada} {cidadeSelecionada && <a href= {"https://www.google.com/search?q=telefone+prefeitura+" + cidadeSelecionada} target="_blank"><Telephone className="text-primary" width="20" height="20" /></a>}</h3> 
      <div className="row">
        <div className="col">
          <table className="table">
            <thead>
              <tr>
                <th>Número do Processo</th>
                <th>Data/Hora</th>
                <th>Objeto Licitado</th>
                <th>Endereço Completo</th>
                <th>Cidade</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {processos.map(processo => (
                <tr key={processo.idprocesso}>
                  <td>{processo.NumeroProcesso}</td>
                  <td>{ moment(processo.DataHoraProcesso).format('DD/MM/YYYY HH:mm') }</td>
                  <td>{processo.ObjetoLicitado}</td>
                  <td>{processo.EnderecoCompleto}</td>
                  <td>{processo.CidadeNome} </td>
                  <td>{processo.EstadoNome}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
    </>
  );
}

export default ProcessosLicitatorios;