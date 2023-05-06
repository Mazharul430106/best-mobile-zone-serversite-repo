const express = require('express');
const app = express();
const cors = require('cors');
const jwt = require('jsonwebtoken');
require('dotenv').config();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qm6ghoc.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {

        const categoryCollection = client.db('bestMobileZone').collection('mobileCategories');
        const allPhonesCollection = client.db('bestMobileZone').collection('allMobilePhones');
        // const allAddedProductsCollection = client.db('bestMobileZone').collection('addedProducts');
        const advertiseProductsCollection = client.db('bestMobileZone').collection('advertiseProducts');
        const userBookingProductsCollection = client.db('bestMobileZone').collection('userBookingsData');
        const usersCollection = client.db('bestMobileZone').collection('users');
        const reviewsCollection = client.db('bestMobileZone').collection('serviceReviews');

        //get categories data from database. 
        app.get('/categories', async (req, res) => {
            const query = {};
            const categories = await categoryCollection.find(query).toArray();
            res.send(categories);
        })

        // get all mobilePhones data from database.
        app.get('/phones', async (req, res) => {
            let phoneType = req.query.phoneType;
            let query = {
                phoneType: phoneType
            }
            const result = await allPhonesCollection.find(query).toArray();
            res.send(result);
        })

        // post add products from database.
        app.post('/allMobilePhones', async (req, res) => {
            const query = req.body;
            const product = await allPhonesCollection.insertOne(query);
            res.send(product);
        })

        // get products data from database.
        app.get('/products', async (req, res) => {
            const email = req.query.email;
            const query = {
                email: email
            }
            const products = await allPhonesCollection.find(query).toArray();
            res.send(products);
        })

        // post advertise data from database.
        app.post('/advertise', async (req, res) => {
            const query = req.body;
            const advertise = await advertiseProductsCollection.insertOne(query);
            res.send(advertise);
        })

        // get advertise data from database.
        app.get('/advertise', async (req, res) => {
            const query = {};
            const advertiseGetItems = await advertiseProductsCollection.find(query).toArray();
            res.send(advertiseGetItems);
        })

        // post service reviews data form database.
        app.post('/reviews', async (req, res) => {
            console.log(req.body);
            const userReview = req.body;
            const result = await reviewsCollection.insertOne(userReview);
            res.send(result)
        })

        // get service reviews data form database. 
        app.get('/reviews', async (req, res) => {
            const query = {}
            const reviews = await reviewsCollection.find(query).toArray();
            res.send(reviews)
        })

        // added user booking phones.
        app.post('/bookingPhones', async (req, res) => {
            const query = req.body;
            const bookingsData = await userBookingProductsCollection.insertOne(query);
            res.send(bookingsData);
        })

        // added get booking phones 
        app.get('/bookingPhones', async (req, res) => {
            const email = req.query.email
            console.log(req.headers.authorization)
            const query = {
                email: email
            }
            const getBookingData = await userBookingProductsCollection.find(query).toArray();
            res.send(getBookingData);
        })

        // jwt token 
        app.get('/jwt', async (req, res) => {
            const email = req.query.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            if (user) {
                const token = jwt.sign({ email }, process.env.ACCESS_TOKEN, { expiresIn: '10d' })
                return res.send({ accessToken: token })
            }
            res.status(403).send({ accessToken: '' })
        })

        //added all users in database.
        app.post('/users', async (req, res) => {
            const user = req.body;
            const result = await usersCollection.insertOne(user);
            res.send(result);
        })

        // get all users from database 
        app.get('/users', async (req, res) => {
            const query = {}
            const users = await usersCollection.find(query).toArray();
            res.send(users);
        })

        // admin checking 
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await usersCollection.findOne(query);
            res.send({ isAdmin: user?.role === 'admin' });
        })

        // user checking 
        app.get('/users/user/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send({ isUser: user?.role === 'user' })
        })

        // seller checking 
        app.get('/users/seller/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email };
            const user = await usersCollection.findOne(query);
            res.send({ isSeller: user?.role === 'seller' })
        })

        // delete users from database 
        app.delete('/users/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: new ObjectId(id) }
            const result = await usersCollection.deleteOne(query);
            res.send(result)
        })

    } catch (error) {
        console.log(error)
    }
    finally {

    }
}

run().catch(err => console.error(err));

app.get('/', (req, res) => {
    res.send('Mobile Zone Server is Running')
})

app.listen(port, () => {
    console.log(`Mobile Zone Server is Running on port ${port}`)
})