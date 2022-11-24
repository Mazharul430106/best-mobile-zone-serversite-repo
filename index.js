const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

const run =  async ()=>{
    try{
        const categoryCollection = client.db('bestMobileZone').collection('mobileCategories');

        app.get('/categories', async(req, res)=>{
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);
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