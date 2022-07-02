'use strict';
var http = require('http');
var port = process.env.PORT || 1337;
var cors = require('cors');
var setData = require('.//api/setData');
var getData = require('.//api/getData');
var delData = require('.//api/delData');
var verifyToken = require('.//middleware/auth');
var common = require('.//common/common');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express')
const cookieParser = require('cookie-parser');
const app = express();
const utf8 = require('utf8');
require("dotenv").config();
require('.//dbconnect/sqlServer');
require('.//common/scheduleJob');



app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(cookieParser());

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded());

// Parse JSON bodies (as sent by API clients)
app.use(express.json());
app.use(express.urlencoded());
//app.use(express.static(path.join(__dirname, './pages/static')));

//https://expressjs.com/en/resources/middleware/cors.html
app.use(cors());






//********** Post **********//
app.post("/register", async (req, res) => {


    try {
        const {
            username,
            password,
            email,
            firstname,
            lastname,
            phone01,
            phone02,
            country,
            city,
            district,
            address,
            zip,
            afm,
            insdate,
            token,
            isactive
        } = req.body;
        const response = common.initResponse();

        if (!common.validateValue(username)) {
            return res.status(400).send("Username is required!");
        }
        if (!common.validateValue(password)) {
            return res.status(400).send("password is required!");
        }
        if (!common.validateValue(email)) {
            return res.status(400).send("Email is required!");
        }
        if (!common.validateValue(firstname)) {
            return res.status(400).send("firstname is required!");
        }
        if (!common.validateValue(lastname)) {
            return res.status(400).send("lastname is required!");
        }


        // check if user already exist (unique username)
        // Validate if user exist in our database
        const param = { username: username };
        var gUser = await getData.getUsers(param);
        if (gUser.recordcount > 0) {
            return res.status(400).send("Username already exist!");
        }
        else {
            const response = await setData.setUsers(req.body);

            return res.status(200).send(response);
        
        }

    } catch (err) {
        response.error = err.message;
        return res.status(400).send(response);
    }
    // Our register logic ends here
});


// Login
app.post("/login", async (req, res) => {

    // Our login logic starts here
    try {
        const response = common.initResponse();
        // Get user input
        const { username, password } = req.body;

        // Validate user input
        if (!(username && password)) {
            res.status(400).send("All input is required");
        }
        else {
            // Validate if user exist in our database
            const gUser = await getData.getUsers(req.body);


            bcrypt.hash(password, 10, function (err, hash) {
                if (err) { throw (err); }

                bcrypt.compare(password, hash, function (err, result) {
                    if (err) { throw (err); }
                    console.log(result);
                });
            });

            if (gUser.recordcount > 0) {

                if (gUser.data[0].ISACTIVE == 1) {
                    if (await bcrypt.compare(password, gUser.data[0].PASSWORD)) {
                        // Create token
                        const token = jwt.sign(
                            { user_id: gUser.data[0].userid, password },
                            process.env.JWT_KEY,
                            {
                                expiresIn: "1m",
                            }
                        );
                        gUser.token = token;
                        return res.status(200).cookie("token", token, { httpOnly: true }).send(gUser);
                    }
                    else {
                        response.error = "Invalid credentials";
                        return res.status(200).send(response);
                    }
                }
                else {
                    response.error = utf8.decode("Not accepted by the administrator!") ;
                    return res.status(200).send(response);
                }
            }
            else {
                response.error = "Invalid credentials";
                return res.status(200).send(response);
            }
        }
    } catch (err) {
        return res.status(400).send(err.message);
    }
    // Our register logic ends here
});



app.post("/setCategories", async (req, res) => {

    // Our login logic starts here
    try {
        const response = common.initResponse();
        // Get user input
        const { code, name, isactive } = req.body;

        // Validate user input
        if (!common.validateValue(code))
            res.status(200).send("Code is required");
        if (!common.validateValue(name))
            res.status(200).send("Name is required");
        if (!common.validateValue(isactive))
            res.status(200).send("Isactive is required");

        // Validate if category exist in our database
        const gCategories = await getData.getCategories(req.body);

        if (gCategories.recordcount > 0) {
            response.error = "Category already exist!";
            return res.status(400).send(response);
        }
        else {

            // Create category in our database
            const sCategories = await setData.setCategories(req.body);

            var vCategories = await getData.getCategories(req.body);
            response.status = true;
            response.recordcount = vCategories.recordcount;
            response.data = vCategories.data;

            return res.status(200).send(response);

        }
        
    } catch (err) {
        return res.status(400).send(err.message);
    }
    // Our register logic ends here
});

app.post("/delCategories", async (req, res) => {

    // Our login logic starts here
    try {
        const response = common.initResponse();
        // Get user input
        const { code, name } = req.body;

        // Validate user input
        if (!common.validateValue(code))
            res.status(200).send("Code is required");
        if (!common.validateValue(name))
            res.status(200).send("Name is required");

        // Validate if category exist in our database
        const gCategories = await getData.getCategories(req.body);

        if (gCategories.recordcount > 0) {
            // Delete category in our database
            const dCategories = await delData.delCategories(req.body);

            response.status = true;
            response.message = utf8.encode("Successful deletion!");
            return res.status(200).send(response);
        }
        else {

            response.error = utf8.encode("Category is not exists!");
            return res.status(400).send(response);

        }

    } catch (err) {
        return res.status(400).send(err.message);
    }
    // Our register logic ends here
});


app.post("/deleteUser", async (req, res) => {

    // Our login logic starts here
    try {
        const response = common.initResponse();
        // Get user input
        const { userid } = req.body;

        // Validate user input
        if (!common.validateValue(userid))
            res.status(200).send("Userid is required");

        // Validate if category exist in our database
        var vUser = await getData.getUsers(req.body);

        if (vUser.recordcount > 0) {
            // Delete category in our database
            const dUser = await delData.deleteUser(req.body);

            response.status = true;
            response.message = utf8.encode("Successful deletion!");
            return res.status(200).send(response);
        }
        else {

            response.error = utf8.encode("User is not exists!");
            return res.status(400).send(response);

        }

    } catch (err) {
        return res.status(400).send(err.message);
    }
    // Our register logic ends here
});

app.post("/activateUser", async (req, res) => {

    // Our login logic starts here
    try {
        const response = common.initResponse();
        // Get user input
        const { userid } = req.body;

        // Validate user input
        if (!common.validateValue(userid))
            res.status(200).send("Userid is required");

        // Validate if category exist in our database
        var vUser = await getData.getUsers(req.body);

        if (vUser.recordcount > 0) {
            // activateUser in our database
            const dUser = await setData.activateUser(req.body);

            response.status = true;
            response.message = utf8.encode("Successful update!");
            return res.status(200).send(response);
        }
        else {

            response.error = utf8.encode("User is not exists!");
            return res.status(400).send(response);

        }

    } catch (err) {
        return res.status(400).send(err.message);
    }
    // Our register logic ends here
});


app.post("/setAuctions", async (req, res) => {


    try {
        var response;
        const {
            categories,
            buy_price,
            first_bid,
            location,
            started,
            ends,
            description,
            name,
            seller
        } = req.body;
        //const response = common.initResponse();

        if (!common.validateValue(categories)) {
            res.status(200).send("categories is required!");
        }
        if (!common.validateValue(buy_price)) {
            res.status(200).send("buy_price is required!");
        }
        if (!common.validateValue(first_bid)) {
            res.status(200).send("first_bid is required!");
        }
        if (!common.validateValue(started)) {
            res.status(200).send("started is required!");
        }
        if (!common.validateValue(ends)) {
            res.status(200).send("ends is required!");
        }
        if (!common.validateValue(description)) {
            res.status(200).send("description is required!");
        }
        if (!common.validateValue(name)) {
            res.status(200).send("name is required!");
        }
        if (!common.validateValue(seller)) {
            res.status(200).send("seller is required!");
        }

        response = await setData.setAuctions(req.body);

        return res.status(200).send(response);


    } catch (err) {
        response.error = err.message;
        return res.status(400).send(response);
    }
    // Our register logic ends here
});

app.post("/setAuctionBids", async (req, res) => {


    try {
        var response;
        const {
            bidder,
            amount,
            auctionid
        } = req.body;
        //const response = common.initResponse();

        if (!common.validateValue(bidder)) {
            return res.status(200).send("bidder is required!");
        }
        if (!common.validateValue(amount)) {
            return res.status(200).send("amount is required!");
        }
        if (!common.validateValue(auctionid)) {
            return res.status(200).send("auctionid is required!");
        }


        // Create auction bid in our database
        response = await setData.setAuctionBids(req.body);

        return res.status(200).send(response);


    } catch (err) {
        response.error = err.message;
        return res.status(400).send(response);
    }
    // Our register logic ends here
});

app.post("/updateAuction", async (req, res) => {


    try {
        var response;
        const {
            auctionid
        } = req.body;

        if (!common.validateValue(auctionid)) {
            return res.status(200).send("auctionid is required!");
        }


        // Create auction bid in our database
        response = await setData.updateAuction(req.body);

        return res.status(200).send(response);


    } catch (err) {
        response.error = err;
        return res.status(400).send(response);
    }
    // Our register logic ends here
});

app.post("/setMessage", async (req, res) => {

    
    try {
        var response;
        const {
            creator,
            recipient
        } = req.body;

        if (!common.validateValue(creator)) {
            res.status(200).send("Creator is required!");
        }
        if (!common.validateValue(recipient)) {
            res.status(200).send("Recipient is required!");
        }

        response = await setData.setMessage(req.body);

        return res.status(200).send(response);


    } catch (err) {
        response.error = err.message;
        return res.status(400).send(response);
    }
});

app.post("/setReadMessage", async (req, res) => {

    
    try {
        var response;
        const {
            messageid
        } = req.body;

        if (!common.validateValue(messageid)) {
            res.status(200).send("messageid is required!");
        }

        response = await setData.setReadMessage(req.body);

        return res.status(200).send(response);


    } catch (err) {
        response.error = err.message;
        return res.status(400).send(response);
    }
});


//********** Get  **********//
app.get("/getUsers", (req, res) => {
    getData.getUsers(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});

app.get("/getCategories", (req, res) => {
    getData.getCategories(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});

app.get("/getCountries", (req, res) => {
    getData.getCountries(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});

app.get("/getAuctions", (req, res) => {
    getData.getAuctions(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});

app.get("/getAuctionBIDS", (req, res) => {
    getData.getAuctionBIDS(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});

app.get("/getMessages", (req, res) => {
    getData.getMessages(req.query).then((data) => {
        res.json(data);
    })
});

app.get("/getAvailableRecipients", (req, res) => {

    if (!common.validateValue(req.query.userid)) {
        res.status(200).send("Userid is required!");
    }
    getData.getAvailableRecipients(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});

app.get("/getUnreadMessages", (req, res) => {

    getData.getUnreadMessages(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});


app.get("/getXmlFileData", (req, res) => {

    getData.getXmlFileData(req.query).then((data) => {
        res.json(data);
    })
    //console.log("register");
});

app.listen(port, function () {
    console.log('Server is running..');
});

