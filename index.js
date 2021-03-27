const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const pass = 'arabian-hotem1122';
const app = express();

app.use(cors());
app.use(bodyParser.json());

const MongoClient = require('mongodb').MongoClient;
const uri = "mongodb+srv://arabian-hotel:arabian-hotem1122@cluster0.ij0ac.mongodb.net/burj-al-arab?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });


app.get('/', (req, res) => {
    res.send('hello');
})


client.connect(err => {
  const bookings = client.db("burj-al-arab").collection("bookings");
  
  app.post('/addBooking', (req, res) => {
      const newBooking = req.body;
      bookings.insertOne(newBooking)
      .then(result => {
        res.send(result.insertedCount > 0);
        console.log(result);
      })
  })

  app.get('/bookings', (req, res) => {
    bookings.find({email: req.query.email})
    .toArray((err, documents) => {
      res.send(documents)
    })
  })
});



app.listen(4000);




