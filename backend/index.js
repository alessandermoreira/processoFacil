

const express = require('express');
const { Pool } = require('pg'); // Importa o módulo para PostgreSQL
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// LER VARIAVEL .env
const dotenv = require("dotenv")
dotenv.config();
const https = require('https');
const fs = require('fs');
const privateKey = fs.readFileSync( process.env.privKey_path, 'utf8' ); 
const certificate = fs.readFileSync( process.env.cert_path );
const ca = fs.readFileSync(process.env.chain_path );
const credentials = { key: privateKey, cert: certificate, ca : ca };
const app = express();
const httpsServer = https.createServer(credentials, app);
const { format, addDays, nextTuesday, nextThursday } = require('date-fns');




// Configurando o middleware cors com a opção origin
app.use(cors({
  origin: [process.env.dns_origin, process.env.dns_origin2]
}));

 // const pool = mysql.createPool({
     // connectionLimit : 10,
     // host: process.env.host,
     // user: process.env.user,
     // password: process.env.password,
     // database: process.env.database
 // });
 
//  const pool = mariadb.createPool({
// 	 connectionLimit : 10,
// 	 host: process.env.host,
// 	 user: process.env.user,
// 	 password: process.env.password,
// 	 database: process.env.database
// });

// Configuração da pool de conexões do Postgres
const pool = new Pool({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
  port: process.env.port, // Certifique-se de incluir a porta correta
});


// middleware para autenticação e autorização
const authenticateUser = (req, res, next) => {
  const authorizationHeader = req.headers['authorization'];
  if (authorizationHeader) {
    const token = authorizationHeader.split(' ')[1];
    try {
      const decodedToken = jwt.verify(token, process.env.chave_jwt);
      req.userId = decodedToken.userId;
      next(); // permita que a solicitação continue
    } catch (error) {
      res.status(401).send('Token inválido ou expirado');
    }
  } else {
    res.status(401).send('Token não fornecido');
  }
};

const axios = require('axios');

// Conexão com o banco de dados MySQL
// const connection = mysql.createConnection({
//   host: 'localhost',
//   user: 'root',
//   password: 'Ronaldo20@',
//   database: 'entregaaki'
// });

// connection.connect(error => {
//   if (error) throw error;
//   console.log('Connected to MySQL');
// });
app.post('/usuarios', async (req, res) => {
  const { nome, email, celular, cidade, bairro, rua, numero, cpf, senha, confirmaSenha } = req.query;

  // Verifica se todos os campos obrigatórios foram fornecidos
  if (!nome || !email || !celular || !cidade || !bairro || !rua || !numero || !cpf || !senha || !confirmaSenha) {
    return res.status(400).json({ error: 'Todos os campos são obrigatórios.' });
  }

  // Verifica se a senha e a confirmação de senha são iguais
  if (senha !== confirmaSenha) {
    return res.status(400).json({ error: 'A senha e a confirmação de senha não conferem.' });
  }

  // Monta hash de senha
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(senha, salt);

  // Exemplo de inserção na tabela de usuários
  const query = 'INSERT INTO usuarios (nome, email, celular, cidade, bairro, rua, numero, cpf, senha) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)';

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a query de inserção
      const data = await client.query(query, [nome, email, celular, cidade, bairro, rua, numero, cpf, hashedPassword]);
      res.status(201).json({Inserido : data.rowCount});
    } catch (queryError) {
      console.error(queryError);
      if(queryError.detail){
        res.status(500).json({ error: queryError.detail });
      }else{
        res.status(500).json({ error: 'Erro ao cadastrar usuário.' });
      }
      
      
    } finally {
      // Libera o cliente
      client.release();
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados.' });
  }
});


app.put('/set-addr-user', async (req, res) => {
  const { cidade, bairro, rua, numero, idUsuario } = req.query;

  const sql = "UPDATE usuarios SET cidade = $1, bairro = $2, rua = $3, numero = $4 WHERE id = $5";

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a query de atualização
      const result = await client.query(sql, [cidade, bairro, rua, numero, idUsuario]);
      if (result.rowCount > 0) {
        res.json({ message: 'Endereço atualizado com sucesso.' });
      } else {
        res.status(404).json({ error: 'Usuário não encontrado.' });
      }
    } catch (queryError) {
      console.error(queryError);
      res.status(500).json({ error: 'Erro ao atualizar endereço do usuário.' });
    } finally {
      // Libera o cliente
      client.release();
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados.' });
  }
});

app.get('/get-user', async (req, res) => {
  const { id } = req.query;

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Consulta SQL com placeholder ($1)
      const sql = 'SELECT * FROM usuarios WHERE id = $1';
      
      // Executa a consulta
      const { rows } = await client.query(sql, [id]);
      if (rows.length > 0) {
        res.send(rows);
      } else {
        res.status(404).json({ message: 'Usuário não encontrado.' });
      }
    } catch (queryError) {
      console.error(queryError);
      res.status(500).json({ error: 'Erro ao buscar usuário.' });
    } finally {
      // Libera o cliente
      client.release();
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados.' });
  }
});


// Rota para receber notificações do webhook
app.post('/webhook/pedido', (req, res) => {
  const evento = req.query;
  console.log('Evento recebido:', evento);
  // Aqui você pode processar o evento recebido, por exemplo, atualizar o status de um pagamento no seu sistema
  res.status(200).send('Evento recebido com sucesso');
});

app.get('/get-produtos-venda', authenticateUser, async (req, res) => {
  const sql = `
    SELECT 
        produtos_venda.*, 
        produtos_venda.qtdEstoque - COALESCE(QtdVendida.qtd, 0) AS qtdRestante
    FROM 
        produtos_venda
    LEFT JOIN 
        (SELECT 
            pedidositens.idProdutosVendas, 
            MAX(pedidositens.qtd) AS qtd
        FROM 
            pedidos
        INNER JOIN 
            pedidositens 
        ON 
            pedidos.idPedidos = pedidositens.idPedidos
        WHERE pedidos.pagamentoAprovado = 1
        GROUP BY 
            pedidositens.idProdutosVendas
        ) QtdVendida 
    ON 
        produtos_venda.id = QtdVendida.idProdutosVendas
    WHERE 
        produtos_venda.dataLimiteAtivo >= CURRENT_DATE;
  `;

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a query
      const result = await client.query(sql);
      res.send(result.rows);
    } catch (queryError) {
      console.error(queryError);
      res.status(500).json({ error: 'Erro ao buscar produtos venda.' });
    } finally {
      // Libera o cliente
      client.release();
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados.' });
  }
});
async function inserirProdutosDisponiveis(produtos, dataLimite) {
  const client = await pool.connect();
  let count = 0;

  try {
    await client.query('BEGIN'); // Inicia uma transação

    for (let prod of produtos) {
      if (prod.codigo > 0 && prod.name) {
        const valor = prod.price.replace(',', '.');

        let inativo = prod.inativo === "" ? 0 : 1;

        const sql = `
          SELECT sp_upsert_produto(
              $1, $2, $3, $4, $5, $6, $7, $8
          );
        `;

        try {
          // Executa a função SQL hipotética para inserir produtos
          await client.query(sql, [
            prod.codigo,
            prod.name,
            valor,
            prod.category,
            inativo,
            dataLimite,
            prod.qtdestoque,
            prod.cashbackpercentual,
          ]);
          count++;
        } catch (queryError) {
          console.error(queryError);
          await client.query('ROLLBACK');
          throw queryError;
        }
      }
    }

    await client.query('COMMIT'); // Finaliza a transação se tudo estiver bem
  } catch (transactionError) {
    console.error(transactionError);
    await client.query('ROLLBACK'); // Desfaz a transação em caso de erro
    throw transactionError;
  } finally {
    client.release(); // Libera o cliente de conexão
  }

  return count; // Retorna o número de produtos inseridos
}

async function inserirPedidoComItens(pedido, itens) {
  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    const pedidoSql = `
      INSERT INTO pedidos (idUsuario, nome, email, celular, endereco, cidade, cpf, inseridoEm, valorTotal) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, Now(), $8) RETURNING idPedidos;
    `;

    // Insere o pedido principal e retorna o ID do pedido inserido
    const result = await client.query(pedidoSql, [
      pedido.idUsuario,
      pedido.payer.first_name,
      pedido.payer.email,
      pedido.celular,
      pedido.endereco,
      pedido.cidade,
      pedido.payer.identification.number,
      pedido.transaction_amount,
    ]);

    const pedidoId = result.rows[0].idpedidos;

    const itemSql = `
      INSERT INTO pedidositens (idPedidos, idProdutosVendas, qtd, price) 
      VALUES ($1, $2, $3, $4);
    `;

    for (let item of itens) {
      await client.query(itemSql, [
        pedidoId,
        item.id,
        item.qtd,
        item.price,
      ]);
    }

    await client.query('COMMIT');
    return pedidoId;
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    throw err;
  } finally {
    client.release();
  }
}

app.post('/entregarPedido', async (req, res) => {
  const pedido = Object.values(req.query);
  console.log(pedido);

  const client = await pool.connect();

  try {
    await client.query('BEGIN'); // Inicia a transação

    for (let item of pedido) {
      try {
        // Atualiza a quantidade entregue para cada item do pedido
        const result = await client.query(
          "UPDATE pedidositens SET qtdEntregue = $1 WHERE idPedidosItens = $2",
          [item.qtd, item.idpedidositens]
        );
        console.log(result);
      } catch (queryError) {
        console.error(queryError);
        await client.query('ROLLBACK');
        return res.status(500).json({ error: 'Erro ao atualizar itens do pedido.' });
      }
    }

    try {
      // Atualiza o campo entregueEm para registrar o timestamp da entrega
      const updatePedido = await client.query(
        "UPDATE pedidos SET entregueEm = NOW() WHERE idPedidos = $1",
        [pedido[0].idpedidos]
      );
      console.log(updatePedido);
    } catch (updateError) {
      console.error(updateError);
      await client.query('ROLLBACK');
      return res.status(500).json({ error: 'Erro ao atualizar o pedido.' });
    }
    
    await client.query('COMMIT'); // Conclui a transação
    res.status(200).send(`Pedido ${pedido[0].idpedidos} entregue com sucesso!`);
  } catch (transactionError) {
    console.error(transactionError);
    await client.query('ROLLBACK'); // Reverte em caso de falha
    res.status(500).send('Erro no método para entregar o pedido.');
  } finally {
    client.release(); // Libera a conexão do pool
  }
});

app.get('/pedidosEntregar', async (req, res) => {
  const sql = 'SELECT * FROM pedidos WHERE entregueEm IS NULL AND pagamentoAprovado IS NOT NULL';

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a consulta
      const result = await client.query(sql);
      res.send(result.rows); // Envia os resultados da consulta
    } catch (queryError) {
      console.error(queryError);
      res.status(500).json({ error: 'Erro ao buscar pedidos para entrega.' });
    } finally {
      // Libera a conexão do pool
      client.release();
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados.' });
  }
});

app.get('/pedido', async (req, res) => {
  const { idPedido } = req.query; // Extrai o idPedido da consulta

  const sql = `
    SELECT
      pedidos.idPedidos,
      pedidositens.idPedidosItens,
      pedidositens.qtd,
      pedidositens.price,
      produtos_venda.name 
    FROM pedidos
    INNER JOIN pedidositens ON pedidositens.idPedidos = pedidos.idPedidos
    INNER JOIN produtos_venda ON produtos_venda.id = pedidositens.idProdutosVendas
    WHERE pedidos.idPedidos = $1`;

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a consulta com o id como parâmetro
      const result = await client.query(sql, [idPedido]);
      res.send(result.rows); // Envia o resultado para o cliente
    } catch (queryError) {
      console.error(queryError);
      res.status(500).json({ error: 'Erro ao buscar detalhes do pedido.' });
    } finally {
      // Libera a conexão
      client.release();
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados.' });
  }
});

app.post('/pedidos', async (req, res) => {
  const { idUsuario } = req.query; // Extrai o idUsuario da consulta

  const sql = 'SELECT * FROM pedidos WHERE idUsuario = $1 ORDER BY idPedidos DESC';

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a consulta com o id do usuário como parâmetro
      const result = await client.query(sql, [idUsuario]);
      res.send(result.rows); // Envia os resultados da consulta
    } catch (queryError) {
      console.error(queryError);
      res.status(500).json({ error: 'Erro ao buscar pedidos do usuário.' });
    } finally {
      // Libera o cliente após a consulta
      client.release();
    }
  } catch (connectionError) {
    console.error(connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados.' });
  }
});

app.post('/aplicar-preco', authenticateUser, async (req, res) => {
  const { products, dataLimite } = req.query;

  try {
    // Chama a função para inserir e processar os produtos disponíveis
    const qtdProdutosAdicionados = await inserirProdutosDisponiveis(products, dataLimite);
    res.json({ quantidadeProdutosAdicionados: qtdProdutosAdicionados });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no método /aplicar-preco');
  }
});

/**
 * Função para calcular a data prevista
 * @param {Date} currentDate - A data atual
 * @returns {Date} - A data prevista
 */
function calcularDataPrevista(currentDate) {
  const diaDaSemana = currentDate.getDay();

  if (diaDaSemana <= 0 || diaDaSemana <= 2) {
    // Se a data atual é domingo (0) até terça-feira (2), data prevista é a próxima quinta-feira
    return nextThursday(currentDate);
  } else if (diaDaSemana <= 3) {
    // Se a data atual é quarta-feira (3), data prevista é a próxima terça-feira
    return nextTuesday(currentDate);
  } else if (diaDaSemana <= 6) {
    // Se a data atual é de quinta-feira (4) a sábado (6), data prevista é a próxima terça-feira
    return nextTuesday(currentDate);
  }
}

app.post('/registrar-pedido', async (req, res) => {
  const { itensAdicionados, ...pedidoData } = req.query;

  try {
    // Chama a função que insere o pedido e seus itens, retornando o ID do pedido
    const pedidoId = await inserirPedidoComItens(pedidoData, itensAdicionados);
    res.json({ pedidoId });
  } catch (error) {
    console.error(error);
    res.status(500).send('Erro no método para tentar registrar pedido');
  }
});
    // connection.query(sql, async function(error, results) {
      
      //   if (error) {
      //     res.status(500).json({ error: error });
      //   } else {
          
      //     if (results)
      //     {

      //       data.itensAdicionados.forEach(item => {
      //         connection.query(`INSERT INTO pedidosItens (idPedidos, IdProdutosVendas, price, qtd) VALUES (${results.insertId}, ${item.id}, ${item.price}, ${item.qtd})`, async function(error, result) {
      
      //           if (error) {
      //             res.status(500).json({ error: error });
      //           } else {
                  
      //             if (result)
      //             {
      //               res.send(result);
      //             }
      //           }
      //         });      
      //       });
      //     }
      //   }
      // });


async function setIdMercadoPago(idPagamento, idPedido) {
  const sql = "UPDATE pedidos SET idpagamentomercadopago = $1 WHERE idpedidos = $2";

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a consulta de atualização com os parâmetros fornecidos
      const result = await client.query(sql, [idPagamento, idPedido]);
      console.log(result.rowCount + " row(s) updated"); // Log do número de linhas atualizadas
    } catch (queryError) {
      console.error(queryError); // Logs para erro de query
    } finally {
      client.release(); // Libera a conexão
    }
  } catch (connectionError) {
    console.error(connectionError); // Logs para erro de conexão
  }
}

// Função para confirmar pagamento e atualizar os dados do pedido
async function setPagamentoConfirmado(idPagamento, date_approved, idPedido) {
  const sql = `UPDATE pedidos 
               SET pagamentoAprovado = $1, pagamentoAprovadoEm = $2, previsaoEntrega = $3
               WHERE idPedidos = $4`;

  // CALCULAR DATA PREVISTA
  const dataAtual = new Date();
  const dataPrevista = calcularDataPrevista(dataAtual);

  console.log(`Data atual: ${format(dataAtual, 'dd/MM/yyyy')}`);
  console.log(`Data prevista: ${format(dataPrevista, 'dd/MM/yyyy')}`);

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a consulta de atualização com os parâmetros fornecidos
      const result = await client.query(sql, [1, date_approved, dataPrevista, idPedido]);
      console.log(result.rowCount + " row(s) updated"); // Log do número de linhas atualizadas
    } catch (queryError) {
      console.error("Erro ao executar a consulta de atualização:", queryError);
    } finally {
      client.release(); // Libera a conexão
    }
  } catch (connectionError) {
    console.error("Erro ao conectar com o banco de dados:", connectionError);
  }
}

app.post('/check-payment', async (req, res) => {
  const data = req.query;

  if (!data.id || data.id === 'null') {
    return res.status(400).send('Id do pagamento Mercado Pago não informado.');
  }

  try {
    const response = await axios.get(`https://api.mercadopago.com/v1/payments/${data.id}`, {
      headers: {
        'Authorization': 'Bearer '+ process.env.ChaveMercadoPago,
        'Content-Type': 'application/json',
        'accept': 'application/json',
      }
    });

    const status = response.data.status;
    if (status !== "pending" && response.data.date_approved) {
      console.log(data.id, status, response.data.date_approved, 'Pedido', data.idPedido);
      setPagamentoConfirmado(data.id, response.data.date_approved, data.idPedido);
    }

    res.send(response.data);
  } catch (err) {
    if (err.code === 'ENOTFOUND') {
      return res.status(500).send('Erro de conexão com a API do Mercado Pago.');
    }

    if (err.response) {
      console.error("Erro na resposta:", err.response.data);
      return res.status(500).send(err.response.data.message || 'Erro ao processar pagamento.');
    }

    console.error("Erro geral:", err);
    res.status(500).send('Erro no método para tentar realizar pagamento');
  }
});

app.post('/remake-payment', async (req, res) => {
  const { idpagamentomercadopago } = req.query;

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    const sql = `SELECT valorTotal, idPedidos, email, nome, cpf  
                 FROM pedidos
                 WHERE idpagamentomercadopago = $1`;

    try {
      const { rows } = await client.query(sql, [idpagamentomercadopago]);

      if (rows.length === 0) {
        return res.status(404).send('Pedido não encontrado.');
      }

      const pedido = rows[0];
      const body = {
        "transaction_amount": Number(pedido.valorTotal),
        "description": `Pedido N°${pedido.idPedidos} - V2:${idpagamentomercadopago}`,
        "payment_method_id": "pix",
        "payer": {
          "email": pedido.email,
          "first_name": pedido.nome,
          "identification": {
            "type": "CPF",
            "number": pedido.cpf
          }
        }
      };

      // Solicita refazer o pagamento via API do Mercado Pago
      const response = await axios.post('https://api.mercadopago.com/v1/payments', body, {
        headers: {
          'Authorization': 'Bearer '+ process.env.ChaveMercadoPago,
          'Content-Type': 'application/json',
          'accept': 'application/json',
          'X-Idempotency-Key': `${process.env.NODE_ENV}_2viaPEDIDO_${pedido.idPedidos}`
        }
      });

      // Atualiza o pedido com o novo ID de pagamento do Mercado Pago
      await setIdMercadoPago(response.data.id, pedido.idPedidos);
      res.send(response.data);

    } catch (queryError) {
      console.error('Erro ao enviar nova solicitação de pagamento:', queryError);
      res.status(500).send('Erro ao processar a solicitação de pagamento.');
    } finally {
      client.release(); // Libera a conexão após o uso
    }

  } catch (connectionError) {
    console.error('Erro ao conectar ao banco de dados:', connectionError);
    res.status(500).send('Erro ao conectar com o banco de dados.');
  }
});

app.post('/make-payment', async (req, res) => {
  const { transaction_amount, description, payment_method_id, payer, idPedido } = req.query;

  const body = {
    transaction_amount: Number(Number(transaction_amount).toFixed(2)),
    description,
    payment_method_id,
    payer,
    notification_url: `http://189.126.111.2:3000/webhook/pedido?id=${idPedido}`
  };

  try {
    const response = await axios.post('https://api.mercadopago.com/v1/payments', body, {
      headers: {
        'Authorization': 'Bearer ' + process.env.ChaveMercadoPago,
        'Content-Type': 'application/json',
        'accept': 'application/json',
        'X-Idempotency-Key': `${process.env.NODE_ENV}_PEDIDO_${idPedido}`
      }
    });

    await setIdMercadoPago(response.data.id, idPedido);
    res.send(response.data);

  } catch (error) {
    if (error.response && error.response.data) {
      console.error('Erro na resposta da API:', error.response.data.message);
      res.status(500).send(error.response.data.message);
    } else {
      console.error('Erro ao tentar realziar o pagamento:', error.message);
      res.status(500).send('Erro no método para tentar realizar pagamento');
    }
  }
});

app.post('/api/mercadopago/payments', async (req, res) => {
  const { email, password } = req.query;

  const sql = 'SELECT CodigoUsuario, Email, Nome, Sobrenome, Senha FROM usuarios WHERE Email = $1';

  try {
    // Conecta ao banco de dados
    const client = await pool.connect();
    try {
      // Executa a consulta com o banco de dados
      const { rows } = await client.query(sql, [email]);

      if (rows.length > 0) {
        // Verifica se a senha está correta
        const user = rows[0];
        const passwordMatch = await bcrypt.compare(password, user.Senha);

        if (passwordMatch) {
          // Gera o token JWT
          const token = jwt.sign({ id: user.CodigoUsuario }, process.env.chave_jwt, { expiresIn: '1h' });

          delete user.Senha; // Retira a senha antes de enviar os dados do usuário
          res.json({ user: { ...user, token } });
        } else {
          res.status(401).send("Senha inválida!");
        }
      } else {
        res.status(400).json({ message: 'Usuário ou senha incorreta' });
      }
    } catch (queryError) {
      console.error('Erro na consulta SQL:', queryError);
      res.status(500).json({ error: 'Erro ao buscar usuário no banco de dados' });
    } finally {
      client.release(); // Libera a conexão com o banco
    }
  } catch (connectionError) {
    console.error('Erro ao conectar ao banco de dados:', connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados' });
  }
});


app.post('/login', async (req, res) => {
  const { cpf, senha } = req.query;

  const sql = 'SELECT id, nome, senha, permissoes FROM usuarios WHERE cpf = $1';

  try {
    // Obtém uma conexão com o banco de dados
    const client = await pool.connect();
    try {
      // Executa a consulta SQL
      const { rows } = await client.query(sql, [cpf]);

      if (rows.length > 0) {
        const usuario = rows[0];

        // Verifica a senha
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (senhaCorreta) {
          // Gera um token JWT
          const token = jwt.sign({ id: usuario.id }, process.env.chave_jwt, { expiresIn: '1h' });

          // Remove a senha antes de retornar o objeto do usuário
          delete usuario.senha;
          res.json({ ...usuario, token });
        } else {
          res.status(400).json({ message: 'Usuário ou senha incorreta' });
        }
      } else {
        res.status(400).json({ message: 'Usuário ou senha incorreta' });
      }
    } catch (queryError) {
      console.error('Erro na consulta SQL:', queryError);
      res.status(500).json({ error: 'Erro ao buscar usuário no banco de dados' });
    } finally {
      client.release(); // Libera a conexão com o banco
    }
  } catch (connectionError) {
    console.error('Erro ao conectar ao banco de dados:', connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados' });
  }
});

app.get('/api/alertasEnviados', async (req, res) => {
  const { codigo_usuario } = req.query;

  const sql = `
    SELECT 
      AlertasEnviados.CodigoAlertaEnviado,
      Processo.ObjetoLicitado, 
      Processo.CidadeNome, 
      Processo.DataPublicacao,
      AlertasEnviados.TipoEnvio
    FROM AlertasEnviados
    INNER JOIN Processo ON Processo.idProcesso = AlertasEnviados.idProcesso
    INNER JOIN Usuarios ON AlertasEnviados.CodigoUsuario = Usuarios.CodigoUsuario
    WHERE AlertasEnviados.CodigoUsuario = $1`;

  try {
    // Obter uma conexão com o banco de dados
    const client = await pool.connect();
    try {
      // Realizar a consulta usando o método query do pg
      const { rows } = await client.query(sql, [codigo_usuario]);

      if (rows.length > 0) {
        res.json(rows);
      } else {
        res.status(404).json({ message: 'Nenhum alerta encontrado!' });
      }
    } catch (queryError) {
      console.error('Erro ao executar a consulta SQL:', queryError);
      res.status(500).json({ error: 'Erro ao buscar alertas no banco de dados' });
    } finally {
      client.release(); // Libera a conexão
    }
  } catch (connectionError) {
    console.error('Erro ao conectar ao banco de dados:', connectionError);
    res.status(500).json({ error: 'Erro ao conectar com o banco de dados' });
  }
});

// Back-end: cadastro de usuário
// app.post('/api/register', async (req, res) => {

//   console.log(req.query);
//   const { nome, sobrenome, email, telefone, endereco, cep, senha } = req.query;

//   // Verifica se o email já está cadastrado
//   // const userExists = await User.findOne({ email });

//   const sql = 'SELECT * FROM usuarios WHERE email = ?';
//   await pool.getConnection(async function(error, connection) {
//     if (error) {
//       res.status(500).json({ error: error });
//       return;
//     }

//         // monta hash de senha
//     const salt = await bcrypt.genSalt();
//     const hashedPassword = await bcrypt.hash(senha, salt);

//     connection.query(sql, [email], function(error, results) {

//       if (error) {
//         res.status(500).json({ error: error });
//       } else {

//         // email ja cadastrado retorna msg
//         if (results[0])
//           return res.json({ message: 'Email já cadastrado' });
        
//         // prossegue e insere no banco
//         const insert = `INSERT INTO usuarios
//                         (
//                           Nome,
//                           Sobrenome,
//                           Email,
//                           Celular,
//                           EnderecoCompleto,
//                           Cep,
//                           Senha
//                         )
//                         VALUES
//                         (
//                           ?,
//                           ?,
//                           ?,
//                           ?,
//                           ?,
//                           ?,
//                           ?
//                         );
//           `.replace('\n', '');
//           connection.query(insert, [nome, sobrenome, email, telefone, endereco, cep, hashedPassword], function(error, results) {
//             connection.release();
//             if (error) {
//               res.status(500).json({ error: error });
//             } else {
//               // userExists = results
//               // email ja cadastrado
//               if (results.insertId)
//                 return res.json({ message: 'Usuário cadastrado com sucesso' });
//             }
//           });

//       }
//     });
//   });

//   // Cria um novo usuário e salva no banco de dados
//   // const newUser = new User({ name, email, password });
//   // await newUser.save();

//   // return res.json({ message: 'Usuário cadastrado com sucesso' });
// });

app.get('/api/processos', authenticateUser, function(req, res) {
  const cidade = req.query.cidade;
  const sql = 'SELECT * FROM processo WHERE CidadeNome = ?';
  pool.getConnection(function(error, connection) {
    if (error) {
      res.status(500).json({ error: error });
      return;
    }
    connection.query(sql, [cidade], function(error, results) {
      connection.release();
      if (error) {
        res.status(500).json({ error: error });
      } else {
        res.status(200).json({ processos: results });
      }
    });
  });
});

app.get('/api/cidades', authenticateUser, function(req, res) {
    const sql = 'SELECT DISTINCT CidadeNome FROM processo';
    pool.getConnection(function(error, connection) {
      if (error) {
        res.status(500).json({ error: error });
        return;
      }
      connection.query(sql, function(error, results) {
        connection.release();
        if (error) {
          res.status(500).json({ error: error });
        } else {
          const cidades = results.map(result => result.CidadeNome);
          res.status(200).json({ cidades: cidades });
        }
      });
    });
});

const port = 3000;
// app.listen(port, function() {
//   console.log('Servidor iniciado na porta ' + port);
// });

 if (process.env.node_env != "prod") {
   app.listen(port, () => {
     console.log(`Servidor rodando na porta: ${port}`);
   });
 } else {
   httpsServer.listen(443, () => {
     console.log('HTTPS Server running on port 443');
   });
 }


