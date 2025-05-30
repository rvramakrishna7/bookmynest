const mongoose = require("mongoose");
const initData = require('./data.js');
const listing = require('../models/listing.js');

main().then(()=>{
    console.log("connection successfull");
}).catch((err)=>{
    console.log(err);
})

async function main (){
    await mongoose.connect('mongodb://127.0.0.1:27017/bookmynest');
}

const uploadData = async ()=>{
    await listing.deleteMany({});
    initData.data = initData.data.map((obj)=>({...obj, owner: '6835d0db972be7f2e305083d'}))
    await listing.insertMany(initData.data);
   
}
console.log("upload successfull");

uploadData();
