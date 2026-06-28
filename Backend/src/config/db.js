const mongoose=require('mongoose');
require("dotenv").config();
const dns = require("dns");
// Change DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

async function main(){
    if (!process.env.DB_CONNECTION_STRING) {
        throw new Error("DB connection string missing ");
    }

    await mongoose.connect(process.env.DB_CONNECTION_STRING);
    // console.log("MongoDB Connected");
}

module.exports=main;
