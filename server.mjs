import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express';
import asyncHandler from 'express-async-handler';
import * as userCall from './user.mjs';


mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);

const db = mongoose.connection;

db.once("open", () => {
    console.log("Successfully connected to MongoDB using Mongoose!");
});

const PORT = process.env.PORT
const app = express();

app.use(express.static('public'));
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});


//Create user data
app.get("/create", asyncHandler (async (req, res) => {
    const users = await userCall.createUser(req.query.name, req.query.age, req.query.email, req.query.phoneNumber);
    res.send(users);
}));


//Retrieve user data
app.get("/retrieve", asyncHandler (async (req, res) =>{
    let filter = {};
    if(req.query._id !== undefined){
        filter = {_id: req.query._id};
    }  
    if(req.query.name !== undefined){
        filter = {name: req.query.name};
    } 
    if(req.query.age !== undefined){
        filter = {age: req.query.age};
    } 
    if(req.query.email !== undefined){
        filter = {email: req.query.email};
    }
    if(req.query.phoneNumber !== undefined){
        filter = {phoneNumber: req.query.phoneNumber};
    }
    if (req.query.phoneNumber !== undefined && req.query.age !== undefined){
        filter = {phoneNumber: req.query.phoneNumber, age: req.query.age};
    }
    const result = await userCall.findUser(filter);
    res.send(result);
}));



//Update user data
app.get("/update", asyncHandler (async (req, res) =>{
    const update = {age: 28, phoneNumber: "12193456"};
    const resultVal = await userCall.updateUser({_id: req.query._id}, update);
    
    if(resultVal.matchedCount === 0){
        res.status(404).send({"Error" : "Not Found"});
    } else {
        res.send({updateCount: resultVal.modifiedCount});
    }
}));


//Delete user data
app.get("/delete", asyncHandler(async (req, res) => {
    let filter = {};
    if(req.query._id !== undefined){
        filter._id = req.query._id;
    }  
    if(req.query.name !== undefined){
        filter.name = req.query.name;
    } 
    if(req.query.age !== undefined){
        filter.age = req.query.age;
    } 
    if(req.query.email !== undefined){
        filter.email = req.query.email;
    }
    if(req.query.phoneNumber !== undefined){
        filter.phoneNumber = req.query.phoneNumber;
    }
    const deletedCount = await userCall.deleteUser(filter);
    res.send({ "Deleted Count": deletedCount });
}));


