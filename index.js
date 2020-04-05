const express = require('express')
require('dotenv').config()
const cors = require('cors')
const app = express()
const bodyParser = require('body-parser')
const port = process.env.PORT || 4200

//Database
const MongoClient = require('mongodb').MongoClient;
const uri =  process.env.DB_PATH
let client = new MongoClient(uri, { useNewUrlParser: true });



//Middleware
app.use(bodyParser.json())
app.use(cors())

app.get('/', (req, res) => res.send('Hello Server is running!'))

app.post('/addItems', (req, res) => {
    const items = req.body

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("hot-onion").collection("foodItems");
    collection.insert(items, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({message:err})
            
        }
        else{
            res.send(result.ops[0])
        }
    })
    client.close();
    });
})


app.get('/foodItems', (req, res) => {

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("hot-onion").collection("foodItems");
    collection.find().toArray((err, documents) => {
        if(err){
            console.log(err);
            res.status(500).send({message:err})
            
        }
        else{
            res.send(documents)
        }
    })
    client.close();
    });
})

app.get('/foodItems/:key', (req, res) => {
    const key = req.params.key
    console.log(key)
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("hot-onion").collection("foodItems");
    collection.find({key}).toArray((err, documents) => {
        if(err){
            console.log(err);
            res.status(500).send({message:err})
            
        }
        else{
            res.send(documents)
        }
    })
    client.close();
    });
})


app.post('/itemsReviewByKey', (req, res) => {
    const itemsKeys = req.body
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("hot-onion").collection("foodItems");
          collection.find({'key' : { $in :itemsKeys }}).toArray((err, documents) => {
             if(err){
                 console.log(err);
                 res.status(500).send({message:err})
                 
             }
             else{
                 res.send(documents)
             }
          })
          
        client.close();
      });
})

app.post('/orders', (req, res) => {
    const orderDetails = req.body
    orderDetails.orderTime = new Date()

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
    const collection = client.db("hot-onion").collection("orders");
    collection.insert(orderDetails, (err, result) => {
        if(err){
            console.log(err);
            res.status(500).send({message:err})
            
        }
        else{
            res.send(result.ops[0])
        }
    })
    client.close();
    });
})

app.listen(port, () => console.log(` Server listening at port: ${port}`))