const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const passwords = [
  "Sonal12345",
  "Sonal@12345",
  "Sonal123",
  "Sonal@123",
  "Sonal1234",
  "Sonal@1234",
  "sonal12345",
  "sonal123",
  "SonalTripathi",
  "sonal",
  "Sonaltripathi123",
  "SonalTripathi123",
  "Sonal@12345#"
];

const cluster = "cluster0.xrn1zic.mongodb.net";
const username = "db_admin";

async function testPassword(password) {
  const uri = `mongodb+srv://${username}:${encodeURIComponent(password)}@${cluster}/lifepause?appName=Cluster0`;
  try {
    const conn = await mongoose.connect(uri, { serverSelectionTimeoutMS: 2000 });
    await mongoose.disconnect();
    return { password, success: true };
  } catch (err) {
    return { password, success: false, error: err.message };
  }
}

async function run() {
  console.log("Starting secure password validation for db_admin...");
  for (const pw of passwords) {
    console.log(`Testing password: ${pw}...`);
    const result = await testPassword(pw);
    if (result.success) {
      console.log("======================================================================");
      console.log(`FOUND CORRECT PASSWORD: ${result.password}`);
      console.log("======================================================================");
      process.exit(0);
    }
  }
  console.log("None of the common password variations succeeded.");
  process.exit(1);
}

run();
