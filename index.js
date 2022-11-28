const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run =  async ()=>{
    try{

        const categoryCollection = client.db('bestMobileZone').collection('mobileCategories');
        const allPhonesCollection = client.db('bestMobileZone').collection('allMobilePhones');
        const allAddedProductsCollection = client.db('bestMobileZone').collection('addedProducts');
        const advertiseProductsCollection = client.db('bestMobileZone').collection('advertiseProducts');
        
        //get categories data from database. 
        app.get('/categories', async(req, res)=>{
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);
        })

        // get all mobilePhones data from database.
        app.get('/phones', async (req, res)=>{
            let phoneType = req.query.phoneType;
            let query = {
                phoneType: phoneType
            }
            const result = await allPhonesCollection.find(query).toArray();
            res.send(result);
        })
        
        // post add products from database.
        app.post('/addedProducts', async(req, res)=>{
            const query = req.body;
            const product = await allAddedProductsCollection.insertOne(query);
            res.send(product);
        })

        // get products data from database.
        app.get('/products', async(req, res)=>{
            const email = req.query.email;
            const query = {
                email: email
            }
            const products = await allAddedProductsCollection.find(query).toArray();
            res.send(products);
        })
        
        // post advertise data from database.
        app.post('/advertise', async (req, res)=>{
            const query = req.body;
            const advertise = await advertiseProductsCollection.insertOne(query);
            res.send(advertise);
        })

        // get advertise data from database.
        app.get('/advertise', async(req, res)=> {
            const query = {};
            const advertiseGetItems = await advertiseProductsCollection.find(query).toArray();
            res.send(advertiseGetItems);
        })

        // delete advertise data from database.
        app.delete('/advertise/:id', async(req, res)=> {
            const id = req.params.id;
            const query = {_id: ObjectId(id)};
            const advertiseRemoveItem = await advertiseProductsCollection.deleteOne(query);
            res.send(advertiseRemoveItem);
        })

    }
    finally{

    }
}

run().catch(error=> {
    console.log(error);
})


app.get('/', (req, res) => {
  res.send('Mobile Zone Server is Running')
})

app.listen(port, () => {
  console.log(`Mobile Zone Server is Running on port ${port}`)
})