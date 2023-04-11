const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// LER VARIAVEL .env
const dotenv = require("dotenv")
dotenv.config();

const app = express();

app.use(cors());

const connection = mysql.createConnection({
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
  });

connection.connect(function(err) {
  if (err) {
    console.error('Erro ao conectar ao banco de dados: ' + err.stack);
    return;
  }
  console.log('Conexão estabelecida com o banco de dados.');
});

app.get('/processos', function(req, res) {
  const cidade = req.query.cidade;
  const sql = 'SELECT * FROM processo WHERE CidadeNome = ?';
  connection.query(sql, [cidade], function(error, results) {
    if (error) {
      res.status(500).json({ error: error });
    } else {
      res.status(200).json({ processos: results });
    }
  });
});

app.get('/cidades', function(req, res) {
    const sql = 'SELECT DISTINCT CidadeNome FROM processo';
    connection.query(sql, function(error, results) {
      if (error) {
        res.status(500).json({ error: error });
      } else {
        const cidades = results.map(result => result.CidadeNome);
        res.status(200).json({ cidades: cidades });
      }
    });
});

const port = 3000;
app.listen(port, function() {
  console.log('Servidor iniciado na porta ' + port);
});