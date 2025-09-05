const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";
main()
.then(() =>{
    console.log("connected to DB");
})
.catch((err) =>{
    console.log(err);
})
async function main() {
  await mongoose.connect(MONGO_URL);
}

//  create a function to save data in the db first we will clear all the data then add the data 
const initDB = async () =>{
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) =>({...obj,owner:"68b761b92b8ef7942e4091e9"}))
    await Listing.insertMany(initData.data);
    console.log("data was initialized");
};
initDB();