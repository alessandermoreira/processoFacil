const express = require('express');
const mysql = require('mysql');
const cors = require('cors');

// LER VARIAVEL .env
const dotenv = require("dotenv")
dotenv.config();

const app = express();

// Configurando o middleware cors com a opção origin
app.use(cors({
  origin: 'http://ec2-18-219-163-218.us-east-2.compute.amazonaws.com'
}));

const pool = mysql.createPool({
    connectionLimit : 10,
    host: process.env.host,
    user: process.env.user,
    password: process.env.password,
    database: process.env.database
});

app.get('/processos', function(req, res) {
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

app.get('/cidades', function(req, res) {
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