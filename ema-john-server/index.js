const express = require("express");
const app = express();
const port = 5000;
require("dotenv").config();
const MongoClient = require("mongodb").MongoClient;
const bodyParser = require("body-parser");
const cors = require("cors");
// middle ware
app.use(bodyParser.json());
app.use(cors());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.y25ks.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {	useNewUrlParser: true,	useUnifiedTopology: true});




client.connect((err) => {
	const productsCollection = client.db("emaJohnStore").collection("products");
	const ordersCollection = client.db("emaJohnStore").collection("orders");
     console.log('data base connected ema-john................');

     app.post('/addProduct',(req,res) => {
          const product = req.body;
          // productsCollection.insertMany(product)
          productsCollection.insertOne(product)
          .then( result => {
               console.log(result.insertedCount);
               res.send(result.insertedCount);
          })
          .then( err =>{
               console.log(err);
          })
     })


     app.get('/products', (req, res) => {
          productsCollection.find({}).limit(20)
          .toArray( (err,document) => {
               res.send(document);
          })
     })

     app.get('/product/:key', (req, res) => {
          productsCollection.find({key: req.params.key})
          .toArray((err, document) => {
               res.send(document[0]);
          })
     })

     app.post('/productsByKeys', (req, res) => {
          const productKeys = req.body;
          productsCollection.find({key: {$in: productKeys}})
          .toArray( (err, document)=>{
               res.send(document);
          })
     })

     app.post('/addOrder',(req,res) => {
          const order = req.body;
          // productsCollection.insertMany(product)
          ordersCollection.insertOne(order)
          .then( result => {
               res.send(result.insertedCount > 0);
          })
          .then( err =>{
               console.log(err);
          })
     })
});

app.listen(port, () => {
	console.log(`Example app listening at http://localhost:${port}`);
});
