const express = require('express');
const app = express();
const pass = 'arabian-hotem1122';
const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabian-hotel:arabian-hotem1122@cluster0.ij0ac.mongodb.net/burj-al-arab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {
    res.send('hello');
})


client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('db connection');
  client.close();
});



app.listen(4000);




