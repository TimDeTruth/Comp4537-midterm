const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("./connectDB.js")
// const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const https = require('https');

const app = express()
const port = 5000
var pokeModel = null;

const start = async () => {
  // console.log("starting the server");
  await connectDB();//create a localdb
  const pokeSchema = await getTypes();
  // pokeModel = await populatePokemons(pokeSchema);
  pokeModel = mongoose.model('pokemons', pokeSchema);

  console.log(pokeModel);
  app.listen(port, (err) => {
    // console.log("app.listen started");
    if (err) console.log(err);
    else
      console.log(`Phew! Server is running on port: ${port}`);
  })
}
start()


//get all pokemons 
app.get('/api/v1/pokemons', async (req, res) => {
  console.log("GET /api/v1/pokemons");
  if (!req.query["count"])
    req.query["count"] = 10
  if (!req.query["after"])
    req.query["after"] = 0
  try {
    const docs = await pokeModel.find({})
      .sort({ "id": 1 })
      .skip(req.query["after"])
      .limit(req.query["count"])
    res.json(docs)
  } catch (err) { res.json(handleErr(err)) }
})


// get pokemon image from http request 
app.get('/api/v1/pokemonImage/:id', async (req, res) => {
  https.get("https://github.com/fanzeyi/pokemon.json/tree/master/sprites", function (res) {
    var chunks = "";
    res.on("data", (chunk) => {
      chunks += chunk;
    });
    res.on("end", async () => {
      const arr = JSON.parse(chunks);
      console.log(arr);
    });
  })
})



// http get request to get pokemon by id
app.get('/api/v1/pokemon/:id', function (req, res) {
  https.get('https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json', function (response) {
    if (response.statusCode == 200) {
      var body = '';
      response.on('data', function (chunk) {
        body += chunk;
      });
      response.on('end', function () {
        var data = JSON.parse(body);
        var id = req.params.id;
        if (id <= data.length && id > 0) {
          res.json(data[id - 1]);
        } else {
          res.status(404).send("Pokemon not found");
        }
      });
    } else {
      res.status(500).send("Error connecting to pokemon API");
    }
  });
});


app.use(express.json())
app.post('/api/v1/pokemon/', async (req, res) => {
  try {
    const pokeDoc = await pokeModel.create(req.body)
    res.json({
      msg: "Added Successfully"
    })
  } catch (err) { res.json(handleErr(err)) }
})

app.delete('/api/v1/pokemon/:id', async (req, res) => {
  try {
    const docs = await pokeModel.findOneAndRemove({ id: req.params.id })
    if (docs)
      res.json({
        msg: "Deleted Successfully"
      })
    else
      res.json({
        errMsg: "Pokemon not found"
      })
  } catch (err) { res.json(handleErr(err)) }
})

app.put('/api/v1/pokemon/:id', async (req, res) => {
  try {
    const selection = { id: req.params.id }
    const update = req.body
    const options = {
      new: true,
      runValidators: true,
      overwrite: true
    }
    const doc = await pokeModel.findOneAndUpdate(selection, update, options)
    // console.log(docs);
    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc
      })
    } else {
      res.json({
        msg: "Not found",
      })
    }
  } catch (err) { res.json(handleErr(err)) }
})



app.patch('/api/v1/pokemon/:id', async (req, res) => {
  try {
    const selection = { id: req.params.id }
    const update = req.body
    const options = {
      new: true,
      runValidators: true
    }

    const doc = await pokeModel.findOneAndUpdate(selection, update, options)

    if (doc) {
      res.json({
        msg: "Updated Successfully",
        pokeInfo: doc
      })

      // store changes in db 
      const deltaChanges = await pokeModel.create(req.body)

    } else {

      res.json({
        msg: "Not found",
      })

    }
  } catch (err) { res.json(handleErr(err)) }
})






app.get("*", (req, res) => {
  res.json({
    msg: "Improper route. Check API docs plz."
  })
})






// PART 2
// const possibilities = pokemonArrayFromPokedex.filter(({ name }) => poke_regex.test(name.english))
let poke_regex = /pika.*/i
app.get("/api/v1/getPokemonswithRegex?searchQuery=pika_", async (req, res) => {
  try {
    const docs = await pokeModel.find({ name: { $regex: req.query.searchQuery } })
    // console.log(docs);
    res.json({
      msg: "Found Successfully",
      pokeInfo: docs
    })
  } catch (err) { res.json(handleErr(err)) }
})


let poke_regex2 = /\w*chu/i
app.get("/api/v1/getPokemonswithRegex?searchQuery=picu", async (req, res) => {
  try {
    const docs = await pokeModel.find({ name: { $regex: req.query.searchQuery } })
    // console.log(docs);
    res.json({
      msg: "Found Successfully",
      pokeInfo: docs
    })
  } catch (err) { res.json(handleErr(err)) }
})



let poke_regex3 = /(.*ika\w*)|[ika]/i
app.get("/api/v1/getPokemonswithRegex?searchQuery=picu", async (req, res) => {
  try {
    const docs = await pokeModel.find({ name: { $regex: req.query.searchQuery } })
    // console.log(docs);
    res.json({
      msg: "Found Successfully",
      pokeInfo: docs
    })
  } catch (err) { res.json(handleErr(err)) }
})

