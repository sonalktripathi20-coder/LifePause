const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');
const uri = "mongodb+srv://db_admin:Sonal12345@cluster0.xrn1zic.mongodb.net/lifepause?appName=Cluster0";

console.log("Attempting to connect to MongoDB Atlas...");
mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
  .then(() => {
    console.log("======================================================================");
    console.log("SUCCESS! Your computer successfully connected to the MongoDB Atlas Cloud!");
    console.log("======================================================================");
    process.exit(0);
  })
  .catch(err => {
    console.log("======================================================================");
    console.log("CONNECTION FAILURE DETECTED!");
    console.log("Error details:", err.message);
    console.log("======================================================================");
    process.exit(1);
  });
