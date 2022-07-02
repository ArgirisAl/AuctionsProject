'use strict';
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var sql = require("mssql");
var getData = require('./getData');
var common = require('..//common/common');

async function setUsers(obj) {


    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();
        
        //Encrypt user password
        const encryptedPassword = await bcrypt.hash(obj.password, 10);
        var newid;

        var sqlUsers = " INSERT INTO USERS (USERNAME, PASSWORD, EMAIL, FIRSTNAME, LASTNAME, PHONE01, PHONE02, COUNTRY, CITY, DISTRICT, ADDRESS, LATITUDE, LONGITUDE, ZIP, AFM, IMAGE, INSDATE, SELLER_RATING, BIDDER_RATING, ISACTIVE) "
              + "    VALUES( "
              + "           @username,"
              + "           @password,"
              + "           @email,"
              + "           @firstname, "
              + "           @lastname,"
              + "           @phone01,"
              + "           @phone02,"
              + "           @country,"
              + "           @city,"
              + "           @district,"
              + "           @address,"
              + "           @latitude,"
              + "           @longitude,"
              + "           @zip,"
              + "           @afm,"
              + "           CONVERT(varbinary,@image),"
              + "           GETDATE(),"
              + "           0,"
              + "           0,"
              + "           @isactive"
              + "         );SELECT SCOPE_IDENTITY() AS id  ";

          newid = await DBrequest
              .input('username', obj.username)
              .input('password', encryptedPassword)
              .input('email', obj.email)
              .input('firstname', obj.firstname)
              .input('lastname', obj.lastname)
              .input('phone01', obj.phone01)
              .input('phone02', obj.phone02)
              .input('country', obj.country)
              .input('city', obj.city)
              .input('district', obj.district)
              .input('address', obj.address)
              .input('latitude', obj.latitude)
              .input('longitude', obj.longitude)
              .input('zip', obj.zip)
              .input('afm', obj.afm)
              .input('image', obj.image)
              .input('insdate', obj.insdate)
              .input('isactive', obj.isactive)
              .query(sqlUsers);


        //var vUser = await getData.getUsers(obj);
        newid = newid.recordset[0].id;
        
        var values = [];
        for (var i in obj.roles) {
            values.push("(" + [obj.roles[i], newid]+")");
        }
        var sqlUserRoles = " INSERT INTO USER_ROLES (ROLES, USERS) VALUES " + [values];
        await DBrequest.query(sqlUserRoles);

          //response.status = true;
          //response.recordcount = vUser.recordcount;
          //response.data = vUser.data;

          response.status = true;
          response.recordID = newid;
          return response;

        
    } catch (err) {
        response.error = err.message;
        return response;
    }
}

async function setCategories(obj) {


    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        var sqlCategories = " INSERT INTO CATEGORIES (CODE, NAME, ISACTIVE) "
            + "    VALUES( "
            + "           @code,"
            + "           @name,"
            + "           @isactive"
            + "         ) ";

        await DBrequest
            .input('code', obj.code)
            .input('name', obj.name)
            .input('isactive', obj.isactive)
            .query(sqlCategories);


        var vCategories = await getData.getCategories(obj);

        
        response.status = true;
        response.recordcount = vCategories.recordcount;
        response.data = vCategories.data;

        return response;


    } catch (err) {
        response.error = err.message;
        return response;
    }
}

async function activateUser(obj) {


    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        var sqlActuser = " UPDATE USERS SET ISACTIVE = 1 WHERE USERS = @userid ";
        await DBrequest
            .input('userid', obj.userid)
            .query(sqlActuser);

        response.status = true;

        return response;


    } catch (err) {
        response.error = err.message;
        return response;
    }
}

async function setAuctionBids(obj) {


    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();


        var vUser = await getData.getUsers(obj);
        var vAuction = await getData.getAuctions(obj);


        if (vUser.recordcount == 0 ) {

            response.status = false;
            response.error = "Bidder doesnt exists as user!";
            return response;
        }
        else if (vAuction.recordcount == 0) {
            response.status = false;
            response.error = "Auction doesnt exists!";
            return response;
        }
        else {
            const {
                bidder,
                amount,
                auctionid
            } = obj;
            var newid;

            // Insert into BID table
            var sqlBid = " INSERT INTO BID (BIDDER, TIME, AMOUNT, ISACTIVE) "
                + "    VALUES( "
                + "           @bidder,"
                + "           GETDATE(),"
                + "           @amount,"
                + "           1"
                + "         );SELECT SCOPE_IDENTITY() AS id ";

            newid = await DBrequest
                .input('bidder', bidder)
                .input('amount', amount)
                .query(sqlBid);

            newid = newid.recordset[0].id;

            // Insert into BIDS (Auctions Detail) table
            var sqlBids = " INSERT INTO BIDS (BID, AUCTIONS) "
                + "    VALUES( "
                + "           @bid,"
                + "           @auctionid"
                + "         );SELECT SCOPE_IDENTITY() AS id ";

            newid = await DBrequest
                .input('bid', newid)
                .input('auctionid', auctionid)
                .query(sqlBids);

            newid = newid.recordset[0].id;

            // Update Auction
            var sqlUpdAuction = " UPDATE AUCTIONS SET "
                + "CURRENTLY = "
                + "CASE "
                + "     WHEN (SELECT MAX(BID.AMOUNT) FROM BIDS LEFT JOIN BID ON BID.BID =BIDS.BID WHERE BIDS.AUCTIONS = @auctionid1) < @amount0 THEN @amount1 "
                + "     ELSE (SELECT MAX(BID.AMOUNT) FROM BIDS LEFT JOIN BID ON BID.BID =BIDS.BID WHERE BIDS.AUCTIONS = @auctionid2) "
                + "END ,"
                + "SOLD_TO = "
                + "CASE "
                + "     WHEN (SELECT BUY_PRICE FROM AUCTIONS WHERE AUCTIONS = @auctionid3) = @amount2 THEN @bidderAuction "
                + "     ELSE null "
                + "END ,"
                + "ISACTIVE = "
                + "CASE "
                + "     WHEN (SELECT BUY_PRICE FROM AUCTIONS WHERE AUCTIONS = @auctionid3) = @amount2 THEN 0 "
                + "     ELSE 1 "
                + "END ,"
                + "NUMBER_OF_BIDS = (SELECT ISNULL(NUMBER_OF_BIDS,0)+1 FROM AUCTIONS WHERE AUCTIONS = @auctionid4) "
                + "WHERE AUCTIONS = @auctionid0 ";

            await DBrequest
                .input('amount0', amount)
                .input('amount1', amount)
                .input('amount2', amount)
                .input('auctionid0', auctionid)
                .input('auctionid1', auctionid)
                .input('auctionid2', auctionid)
                .input('auctionid3', auctionid)
                .input('auctionid4', auctionid)
                .input('bidderAuction', bidder)
                .query(sqlUpdAuction);




            response.status = true;
            response.recordID = newid;

            return response;

        }





    } catch (err) {
        response.error = err.message;
        return response;
    }
}


async function updateAuction(obj) {


    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        var updFields = "";

        var vAuction = await getData.getAuctions(obj);

        if (vAuction.recordcount == 0) {
            response.status = false;
            response.error = "Auction id doesnt exists!";
            return response;
        }

        if (common.validateValue(obj.name))
            updFields += " NAME = @name, ";
        //if (common.validateValue(obj.currently))
        //   updFields += " CURRENTLY = (SELECT ISNULL(MAX(B.AMOUNT),A.FIRST_BID) FROM BIDS BS JOIN BID B ON B.BID = BS.BID JOIN AUCTIONS A ON A.AUCTIONS = BS.AUCTIONS WHERE BS.AUCTIONS =  @auctions)  ,";
        if (common.validateValue(obj.buy_price))
            updFields += " BUY_PRICE = @buy_price, ";
        if (common.validateValue(obj.first_bid))
            updFields += " FIRST_BID = @first_bid, ";
        //if (common.validateValue(obj.auctions))
        //    updFields += " NUMBER_OF_BIDS = (SELECT COUNT(*) FROM BIDS WHERE AUCTIONS = @auctions), ";
        if (common.validateValue(obj.latitude))
            updFields += " LATITUDE = @latitude, ";
        if (common.validateValue(obj.longitude))
            updFields += " LONGITUDE = @longitude, ";
        if (common.validateValue(obj.country))
            updFields += " COUNTRY = @country, ";
        //if (common.validateValue(obj.started))
        //    updFields += " STARTED = @started, ";
        if (common.validateValue(obj.ends))
            updFields += " ENDS = @ends , ";
        if (common.validateValue(obj.sold_to))
            updFields += " SOLD_TO = @sold_to, ";
        if (common.validateValue(obj.description))
            updFields += " DESCRIPTION = @description, ";
        if (common.validateValue(obj.isactive))
            updFields += " ISACTIVE = @isactive, ";
        if (common.validateValue(obj.isstarted)) {
            updFields += " ISSTARTED = @isstarted, ";
            updFields += " STARTED = GETDATE(), ";
        }

        updFields += " UPDDATE = GETDATE() WHERE AUCTIONS = @auctionid";

        var sqlUpdAuction = " UPDATE AUCTIONS SET " + updFields;

        var newid = await DBrequest
            .input('auctionid', obj.auctionid)
            .input('name', obj.name)
            .input('currently', obj.currently)
            .input('buy_price', obj.buy_price)
            .input('first_bid', obj.first_bid)
            .input('number_of_bids', obj.number_of_bids)
            .input('latitude', obj.latitude)
            .input('longitude', obj.longitude)
            .input('country', obj.country)
            .input('started', obj.started)
            .input('ends', obj.ends)
            .input('seller', obj.seller)
            .input('description', obj.description)
            .input('isstarted', obj.isstarted)
            .input('isactive', obj.isactive)
            .query(sqlUpdAuction);


        response.status = true;
        response.message = "Successfully update record!";
        //response.recordID = obj.auctionid;

        return response;


    } catch (err) {
        response.error = err.message;
        return response;
    }


}



async function setAuctions(obj) {



    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

            var newid;

            var sqlAuction = " INSERT INTO AUCTIONS (NAME, CURRENTLY, BUY_PRICE, FIRST_BID, NUMBER_OF_BIDS, LATITUDE, LONGITUDE, COUNTRY, STARTED, ENDS, SELLER, DESCRIPTION, ISACTIVE) "
                + "    VALUES( "
                + "           @name,"
                + "           @currently ,"
                + "           @buy_price ,"
                + "           @first_bid , "
                + "           @number_of_bids ,"
                + "           @latitude ,"
                + "           @longitude ,"
                + "           @country ,"
                + "           @started ,"
                + "           @ends ,"
                + "           @seller ,"
                + "           @description ,"
                + "           1"
                + "         );SELECT SCOPE_IDENTITY() AS id  ";

            var newid = await DBrequest
                .input('name', obj.name)
                .input('currently', obj.first_bid)
                .input('buy_price', obj.buy_price)
                .input('first_bid', obj.first_bid)
                .input('number_of_bids', obj.number_of_bids)
                .input('latitude', obj.latitude)
                .input('longitude', obj.longitude)
                .input('country', obj.country)
                .input('started', obj.started)
                .input('ends', obj.ends)
                .input('seller', obj.seller)
                .input('description', obj.description)
                .query(sqlAuction);


            //var vAuctions = await getData.getAuctions(obj);
            newid = newid.recordset[0].id;

            var values = [];
            for (var i in obj.categories) {
                values.push("(" + [obj.categories[i], newid] + ")");
            }
            var sqlAuctionCategories = " INSERT INTO AUCTION_CATEGORIES (CATEGORIES, AUCTIONS) VALUES " + [values];
            await DBrequest.query(sqlAuctionCategories);

            //response.status = true;
            //response.recordcount = gAuctions.recordcount;
            //response.data = gAuctions.data;

            response.status = true;
            response.recordID = newid;
            return response;

        } catch (err) {
            response.error = err.message;
            return response;
        }
}


async function setReadMessage(obj) {


    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        var params = { messageid: obj.messageid }
        var vMessage = await getData.getMessages(params);


        if (vMessage.recordcount == 0) {
            response.status = false;
            response.error = "Messageid doesnt exists!";
            return response;
        }


        var sqlQry = " UPDATE MESSAGES SET ISREAD = 1 WHERE MESSAGES = @messageid ";
        await DBrequest
            .input('messageid', obj.messageid)
            .query(sqlQry);


        response.status = true;
        response.message = "Successfully read message!";

        return response;


    } catch (err) {
        response.error = err.message;
        return response;
    }


}


async function setMessage(obj) {


    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        const {
            subject,
            message_body,
            creator,
            create_date,
            expire_date,
            parent_message_id,
            recipient
        } = obj;
        var newid;


        if (common.validateValue(parent_message_id)) {
            params = { parent_message_id: parent_message_id }
            var vMessageParent = await getData.getMessages(params);
            if (vMessageParent.recordcount == 0) {
                response.status = false;
                response.error = "Parent message doesnt exists!";
                return response;
            }
        }

        var paramsCreator = { userid: creator }
        var vUserCreator = await getData.getUsers(paramsCreator);
        
        var paramsRecipient = { userid: recipient }
        var vUserRecipient = await getData.getUsers(paramsRecipient);
        
        if (vUserCreator.recordcount == 0) {
        
            response.status = false;
            response.error = "Creator doesnt exists as user!";
            return response;
        }
        else if (vUserRecipient.recordcount == 0) {
            response.status = false;
            response.error = "Recipient doesnt exists as user!";
            return response;
        }
        
        //// Insert into MESSAGES
        var sqlQry = " INSERT INTO MESSAGES (SUBJECT, MESSAGE_BODY, CREATOR, RECIPIENT, CREATE_DATE, EXPIRE_DATE,PARENT_MESSAGE_ID, UPDDATE ) "
            + "    VALUES( "
            + "           @subject,"
            + "           @message_body,"
            + "           @creator,"
            + "           @recipient,"
            + "           GETDATE(),"
            + "           GETDATE(),"
            + "           @parent_message_id, "
            + "           GETDATE() "
            + "         );SELECT SCOPE_IDENTITY() AS id ";
        
        newid = await DBrequest
            .input('subject', subject)
            .input('message_body', message_body)
            .input('creator', creator)
            .input('recipient', recipient)
            .input('parent_message_id', parent_message_id)
            .query(sqlQry);
        
        newid = newid.recordset[0].id;

        response.status = true;
        response.recordID = newid;

        return response;

        

    } catch (err) {
        response.error = err.message;
        return response;
    }
}

async function setUserBK(obj) {
    const response = common.initResponse();
    var DBrequest = new sql.Request();

    // Our register logic starts here
    try {


        if (!common.validateValue(obj.username)) {
            response.error = "Username is required!";
            return response;
        }
        if (!common.validateValue(obj.password)) {
            response.error = "password is required!";
            return response;
        }
        if (!common.validateValue(obj.email)) {
            response.error = "Email is required!";
            return response;
        }
        if (!common.validateValue(obj.fname)) {
            response.error = "Fname is required!";
            return response;
        }
        if (!common.validateValue(obj.lname)) {
            response.error = "Lname is required!";
            return response;
        }


        // check if user already exist
        // Validate if user exist in our database
        var vUser = await getData.getUsers(obj);
        if (vUser.recordcount > 0) {
            response.error = "User already exist!";
            return response;
        }
        else {

            //Encrypt user password
            const encryptedPassword = await bcrypt.hash(obj.password, 10);
            var sqlQry = " INSERT INTO USERS (USERNAME, PASSWORD, EMAIL, FNAME, LNAME, PHONE01, PHONE02, COUNTRY, CITY, DISTRICT, ADDRESS, ZIP, AFM, INSDATE, TOKEN, ISACTIVE) "
                + "    VALUES( "
                + "           @username,"
                + "           @password,"
                + "           @email,"
                + "           @fname, "
                + "           @lname,"
                + "           @phone01,"
                + "           @phone02,"
                + "           @country,"
                + "           @city,"
                + "           @district,"
                + "           @address,"
                + "           @zip,"
                + "           @afm,"
                + "           @insdate,"
                + "           @token,"
                + "           @isactive"
                + "         ) ";

            await DBrequest
                .input('username', obj.username)
                .input('password', encryptedPassword)
                .input('email', obj.email)
                .input('fname', obj.fname)
                .input('lname', obj.lname)
                .input('phone01', obj.phone01)
                .input('phone02', obj.phone02)
                .input('country', obj.country)
                .input('city', obj.city)
                .input('district', obj.district)
                .input('address', obj.address)
                .input('zip', obj.zip)
                .input('afm', obj.afm)
                .input('insdate', obj.insdate)
                .input('token', obj.token)
                .input('isactive', obj.isactive)
                .query(sqlQry);



            vUser = await getData.getUsers(obj);
            response.status = true;
            response.recordcount = vUser.recordcount;
            response.data = vUser.data;

            // Create token
            const token = jwt.sign(
                { userid: vUser.data[0].userid, encryptedPassword },
                process.env.TOKEN_KEY,
                {
                    expiresIn: "2h",
                }
            );
            // save user token
            response.token = token;

            return response;

        }



    } catch (err) {
        response.error = err;
        return response;
    }
    // Our register logic ends here
}


module.exports = {
    setUsers: setUsers,
    setCategories: setCategories,
    activateUser: activateUser,
    setAuctions: setAuctions,
    setAuctionBids: setAuctionBids,
    updateAuction: updateAuction,
    setMessage: setMessage,
    setReadMessage: setReadMessage
}