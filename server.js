//import dependeices moudles
const express = require('express');
const cors = require("cors");
//creates an express.js instance 
const app = express();
app.use(cors());
//config Express.js
app.use(express.json())
app.set('port', 3000) //setting port to 3000
// middleware has req and res
app.use((req, res, next) =>{
    res.setHeader('Access-Control-Allow-Origin', '*'); // to allow any access so you wont get blocked 
    res.header("Access-Control-Allow-Headers","*");
    next();
})
// connect to MongoDB
const MongoClient = require('mongodb').MongoClient;
let db;
//connecting to your db monogodb access
MongoClient.connect('mongodb+srv://nalhabashe:LOL1234567@cluster0.8j2zj.mongodb.net/test', (err, client) => {
    db = client.db('webstore')
})
// display a message for root path to show the api is working 
app.get("/", (req, res, next) => {
    return res.sendFile(__dirname + "/fetch-post.html");
});

// get the collection name
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName)
    // console.log('collection name:', req.collection)
    return next()
})
//GET
// retrieve all the objects from an collection
app.get('/collection/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e)
        res.send(results)
    })
})

//POST adds data into the collection 
app.post('/collection/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {  
    if (e) return next(e)    
    res.send(results.ops)   
    })   
})

// gets finds one object with a unique id getProduct
const ObjectID = require('mongodb').ObjectID;
app.get('/collection/:collectionName/:id'
, (req, res, next) => {
req.collection.findOne({ _id: new ObjectID(req.params.id) }, (e, result) => {
if (e) return next(e)
res.send(result)
})
})

//PUT an object
app.put('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.update(
    {_id: new ObjectID(req.params.id)},
    {$set: req.body},
    {safe: true, multi: false},
    (e, result) => {
    if (e) return next(e)
    // res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    res.send(result.modifiedCount === 1 ? {msg: "success"} : {msg: "error"})
    })
})

//DELETE 
app.delete('/collection/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne(
    { _id: ObjectID(req.params.id) },(e, result) => {
    if (e) return next(e)
    res.send((result.deleteCount === 1) ? {msg: "success"} : {msg: "error"})
    })
})
 
// app.listen(3000, () => {
//     console.log("Express.js server running at localhost:3000")
// })

const port = process.env.PORT || 3000
// app.listen(3000)
app.listen(port,()=> {console.log('express server is runnimg at localhost:3000')
})