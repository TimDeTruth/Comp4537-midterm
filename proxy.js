const mongoose = require("mongoose")
const express = require("express")

 

app.get('api/v1/pokemon/:id', function(req, res) {
  request('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      var id = req.params.id;
      if (id <= data.length && id > 0) {
        res.json(data[id-1]);
      } else {
        res.status(404).send("Pokemon not found");
      }
    } else {
      res.status(500).send("Error connecting to pokemon API");
    }
  })
});

// Path: proxy.js
//get all pokemon from http get request https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json
app.get('/pokemon', function(req, res) {
  request('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.json(data);
    } else {
      res.status(500).send("Error connecting to pokemon API");
    }
  })
});

// Path: proxy.js
//get all pokemon from http get request https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json
app.get('/pokemon', function(req, res) {
  request('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.json(data);
    } else {
      res.status(500).send("Error connecting to pokemon API");
    }
  })
});

// Path: proxy.js
//get all pokemon from http get request https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json
app.get('/pokemon', function(req, res) {
  request('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json', function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var data = JSON.parse(body);
      res.json(data);
    } else {
      res.status(500).send("Error connecting to pokemon API");
    }
  })
});

// Path: proxy.js
//get all