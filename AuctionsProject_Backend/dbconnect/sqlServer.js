'use strict';
var sql = require("mssql");

// config for your database
var config = {
    "user": "root", //default is sa
    "password": "admin",
    "server": "LAPTOP-CLOSEP5J", // for local machine
    "database": "AuctionProjectDB", // name of database
    "options": {
        "encrypt": true,
        "trustServerCertificate": true
    }
}

// connect to your database
sql.connect(config, function (err) {

    if (err) console.log(err);
});