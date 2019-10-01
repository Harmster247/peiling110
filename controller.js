'use strict'

const mysql = require("mysql");

const connection = mysql.createConnection({
  host: "localhost",
  user: "harmh",
  password: "Greyson4",
  database: "cars"
});

connection.connect((err) => {
  if(err) throw err;
  console.log("Connected");
});

const expressModule = require("express");
const express = expressModule();
const port = 3000;

express.listen(port, () => {
  console.log("server is running on port:"+port);
});

const bodyParser = require("body-parser");

express.use(bodyParser.json());

express.use(function(req, res, next){
  res.header("Acces-Control-Allow-Origin", "*");
  res.header("Acces-Control-Allow-Methods", "*");
  res.header("Acces-Control-Allow-Headers", "Origin, X-Requested-Width, Content-Type, Accept");
  next();
});

express.get("/api/cars", (req, res) => {
  res.setHeader("Content-Type", "application/json");
  connection.query("SELECT * FROM cars", (err, result) => {
    if (err) throw err;
    res.send(result);
  });
});

express.get("/api/cars/:id", (req, res) => {
  const id = +req.params.id;
  connection.query("SELECT * FROM cars WHERE id = ?", [id], (err, result) => {
    if (err) throw err;
    res.send(result[0]);
  });
});

express.put("/api/cars/:id", (req,res) => {
  const id = +req.params.id;
  const input = req.body;
  connection.query("UPDATE cars SET ?", [input,id], (err) => {
    if (err) throw err;
    connection.query("SELECT * FROM cars WHERE id = ?", [id],
    (error, response) => {
      if (error) throw err;
      res.send(response[0]);
    });
  });
});

express.post("/api/cars", (req, res) => {
  const content = req.body;
  connection.query("INSERT INTO cars SET ?", [content],
  (err, result) => {
    if(err) throw err;
    res.send(result);
  });
});

express.delete("/api/cars/:id", (req, res) => {
  const id = +req.params.id;
  connection.query("DELETE FROM cars WHERE id = ?", [id],
  (err, result) => {
    if(err) throw err;
    res.status(204).end();
  });
});
