import { useEffect, useState } from 'react';
import axios from 'axios';
import { Table } from 'react-bootstrap';


const AlertasEnviados = ({url}) => {
  
  var usuarioLogado = "";
  if (localStorage.getItem('usuarioLogado'))
      usuarioLogado = JSON.parse(localStorage.getItem('usuarioLogado'));
           
  const [alertasEnviados, setAlertasEnviados] = useState([]);

  useEffect(() => {
    axios.get(url + '/alertasEnviados?codigo_usuario=' + usuarioLogado.CodigoUsuario )
      .then(response => setAlertasEnviados(response.data))
      .catch(error => console.log(error));
  }, []);

  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>Data da Publicação</th>
          <th>Avisado Por</th>          
          <th>Cidade</th>
          <th>Objeto</th>
        </tr>
      </thead>
      <tbody>

        {alertasEnviados.map(alerta => (
          <tr key={alerta.CodigoAlertaEnviado}>
            {/* <td>{alerta.CodigoAlertaEnviado}</td> */}
            {/* <td>{alerta.CodigoUsuario}</td> */}
            {/* <td>{alerta.idProcesso}</td> */}
            <td>{alerta.DataHoraEnvio}</td>
            <td>{alerta.TipoEnvio}</td>
            <td>{alerta.CidadeNome}</td>
            <td>{alerta.ObjetoLicitado}</td>
            {/* <td>{alerta.PalavrasChave}</td> */}
          </tr>
        ))}

      </tbody>
    </Table>
  );
};

export default AlertasEnviados;
