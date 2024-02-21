import mongoose from 'mongoose';
import 'dotenv/config';
import express from 'express'
import asyncHandler from 'express-async-handler'

//SCHEMA
const userSchema = new mongoose.Schema({
    name: {type: String, required: true},
    age: {type: Number, required: true},
    email: {type: String, required: true},
    phoneNumber: {type: String, required: false}
});


//Creating class
const randomUser = mongoose.model("randomUser", userSchema);


//CREATE user function 
const createUser = async (name, age, email, phoneNumber) => {
    const user = new randomUser({name: name, age: age, email: email, phoneNumber: phoneNumber});
    return user.save();
}

//RETRIEVE user funciton
const findUser = async(filter) => {
    const query = randomUser.find(filter);
    return query.exec();
}

//UPDATE user function
const updateUser = async (filter, update) => {
    const result = await randomUser.updateOne(filter, update);
    return result;
}

// Delete user function
const deleteUser = async (filter) => {
    const result = await randomUser.deleteMany(filter);
    return result.deletedCount;
}


export {createUser, findUser, updateUser, deleteUser};