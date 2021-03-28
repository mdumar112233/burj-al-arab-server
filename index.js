const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const admin = require('firebase-admin');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ij0ac.mongodb.net/burj-al-arab?retryWrites=true&w=majority`;


app.use(cors());
app.use(bodyParser.json());


const serviceAccount = require("./configs/burj-al-arab-auth-node-mongodb-firebase-adminsdk-6n332-e76c69190a.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});


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
      const bearer = req.headers.authorization;
      if(bearer && bearer.startsWith('Bearer ')){
        const idToken = bearer.split(' ')[1];
        admin
        .auth().verifyIdToken(idToken)
        .then((decodedToken) => {
          const tokenEmail = decodedToken.email;
          const queryEmail = req.query.email;
          if(tokenEmail === queryEmail){
            bookings.find({email: queryEmail})
            .toArray((err, documents) => {
              res.send(documents)
            })
          }
          else{
            res.status(401).send('un authorized acceesss');
          }
        })
        .catch((error) => {
          res.status(401).send('un authorized acceesss');

        });
      }
      else{
        res.status(401).send('un authorized acceesss');
      }
  })
});



app.listen(4000);




