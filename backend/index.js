const express = require('express');
const mysql = require('mysql');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
// LER VARIAVEL .env
const dotenv = require("dotenv")
dotenv.config();

const app = express();

// Configurando o middleware cors com a opção origin
app.use(cors({
  origin: process.env.dns_origin
}));

const pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});


app.post('/api/login', async (req, res) => {
  const { email, password } = req.query;

  const sql = 'SELECT CodigoUsuario, Email, Nome, Sobrenome FROM usuarios WHERE email = ? and senha = ?';

  await pool.getConnection(async function(error, connection) {

    if (error) {
      res.status(500).json({ error: error });
      return;
    }

    // monta hash de senha
    // const salt = await bcrypt.genSalt();
    // const hashedPassword = await bcrypt.hash(senha, salt);

    connection.query(sql, [email, password], function(error, results) {

      if (error) {
        res.status(500).json({ error: error });
      } else {

        // email ja cadastrado retorna msg
        if (results[0])
        {
          const token = jwt.sign({ id: results[0].Email }, 'chave-secreta');
          const user_obj = {...results[0], token}
          res.json({ user_obj });
        }
        else{
          return res.status(400).json({ message: 'Usuário ou senha incorreta' });
        }
      }
    });
  });
});



// Back-end: cadastro de usuário
app.post('/api/register', async (req, res) => {

  console.log(req.query);
  const { nome, sobrenome, email, telefone, endereco, cep, senha } = req.query;

  // Verifica se o email já está cadastrado
  // const userExists = await User.findOne({ email });

  const sql = 'SELECT * FROM usuarios WHERE email = ?';
  await pool.getConnection(async function(error, connection) {
    if (error) {
      res.status(500).json({ error: error });
      return;
    }

        // monta hash de senha
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(senha, salt);

    connection.query(sql, [email], function(error, results) {

      if (error) {
        res.status(500).json({ error: error });
      } else {

        // email ja cadastrado retorna msg
        if (results[0])
          return res.status(400).json({ message: 'Email já cadastrado' });
        
        // prossegue e insere no banco
        const insert = `INSERT INTO usuarios
                        (
                          Nome,
                          Sobrenome,
                          Email,
                          Celular,
                          EnderecoCompleto,
                          Cep,
                          Senha
                        )
                        VALUES
                        (
                          ?,
                          ?,
                          ?,
                          ?,
                          ?,
                          ?,
                          ?
                        );
          `.replace('\n', '');
          connection.query(insert, [nome, sobrenome, email, telefone, endereco, cep, hashedPassword], function(error, results) {
            connection.release();
            if (error) {
              res.status(500).json({ error: error });
            } else {
              // userExists = results
              // email ja cadastrado
              if (results.insertId)
                return res.json({ message: 'Usuário cadastrado com sucesso' });
            }
          });

      }
    });
  });

  // Cria um novo usuário e salva no banco de dados
  // const newUser = new User({ name, email, password });
  // await newUser.save();

  // return res.json({ message: 'Usuário cadastrado com sucesso' });
});

app.get('/api/processos', function(req, res) {
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

app.get('/api/cidades', function(req, res) {
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
app.listen(port, function() {
  console.log('Servidor iniciado na porta ' + port);
});