// @ts-nocheck
var admin = require("firebase-admin");

var serviceAccount = require("../config/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://ecommerce-384cb-default-rtdb.firebaseio.com",
});

module.exports = admin;
