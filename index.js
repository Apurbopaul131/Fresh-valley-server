const express = require('express')
const bodyParser = require('body-parser')
const cors = require('cors')
const port = process.env.PORT || 5055
const MongoClient = require('mongodb').MongoClient;
const ObjectId = require('mongodb').ObjectID;
require('dotenv').config()




const app = express()
app.use(bodyParser.json())
app.use(cors())


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.fwp0h.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;



const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const EventCollection = client.db("Bookshop").collection("Book");
  const OrderCollection = client.db("Bookshop").collection("orders");

  app.get('/events',(req,res)=>{
      EventCollection.find()
      .toArray((err,documents)=>{
          res.send(documents);
      })
  })
  app.get('/checkout/:id',(req,res)=>{
    EventCollection.find({_id:ObjectId(req.params.id)})
    .toArray((err,items)=>{
      res.send(items[0]);
    })
  })

  app.post('/addEvent',(req,res)=>{
      const newEvent = req.body;
      EventCollection.insertOne(newEvent)
      .then(response => {
         res.send(response.insertedCount > 0);
      })
      
      })
      app.post('/addOrder',(req,res)=>{
        const newOrder = req.body;
        console.log(newOrder);
        OrderCollection.insertOne(newOrder)
        .then(result=>{
          console.log(result)
          res.send(result.insertedCount > 0)

        })

  })
  app.get('/orders',(req,res)=>{
    console.log(req.query.email);
    OrderCollection.find({email:req.query.email})
    .toArray((err,product)=>{
      res.send(product);
    })
  })
  app.delete('/delete/:id',(req,res)=>{
    EventCollection.deleteOne({_id:ObjectId(req.params.id)})
    .then(result=>{
      res.send(result.deletedCount > 0)
    })
  })
  
//   client.close();
});



app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})