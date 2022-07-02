'use strict';
var sql = require("mssql");
var common = require('..//common/common');

async function getUsers(obj) {
    try {
        const response = common.initResponse();


        var extraWhere = "";

        var mainWhere = " WHERE 1=1 ";

        if (common.validateValue(obj.bidder))
            extraWhere += " AND U.USERS = " + obj.bidder;
        if (common.validateValue(obj.seller))
            extraWhere += " AND U.USERS = " + obj.seller;
        if (common.validateValue(obj.userid))
            extraWhere += " AND U.USERS = "+obj.userid;
        if (common.validateValue(obj.username))
            extraWhere += " AND U.USERNAME = '"+obj.username +"'";
        if (common.validateValue(obj.afm))
            extraWhere += " AND U.AFM = '"+obj.afm+"'";
        if (common.validateValue(obj.email))
            extraWhere += " AND U.EMAIL = '" + obj.email + "'";


        var sqlHD =  " SELECT "
            + "    U.USERS AS USERID,"
            + "    U.USERNAME,"
            + "    U.PASSWORD,"
            + "    U.EMAIL, "
            + "    U.FIRSTNAME, "
            + "    U.LASTNAME, "
            + "    U.PHONE01, "
            + "    U.PHONE02,"
            + "    C.NAME AS COUNTRY_NAME,"
            + "    U.CITY, "
            + "    U.DISTRICT, "
            + "    U.ADDRESS, "
            + "    U.LATITUDE, "
            + "    U.LONGITUDE, "
            + "    U.ZIP, "
            + "    U.AFM, "
            + "    U.IMAGE, "
            + "    U.INSDATE, "
            + "    U.ISACTIVE "
            + " FROM USERS U "
            + " LEFT JOIN COUNTRIES C ON C.COUNTRIES = U.COUNTRY"


        sqlHD += mainWhere + extraWhere;


        const HDresult = await sql.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "USERID": HDresult.recordset[i].USERID,
                "USERNAME": HDresult.recordset[i].USERNAME,
                "PASSWORD": HDresult.recordset[i].PASSWORD,
                "EMAIL": HDresult.recordset[i].EMAIL,
                "FIRSTNAME": HDresult.recordset[i].FIRSTNAME,
                "LASTNAME": HDresult.recordset[i].LASTNAME,
                "PHONE01": HDresult.recordset[i].PHONE01,
                "PHONE02": HDresult.recordset[i].PHONE02,
                "COUNTRY": HDresult.recordset[i].COUNTRY_NAME,
                "CITY": HDresult.recordset[i].CITY,
                "DISTRICT": HDresult.recordset[i].DISTRICT,
                "ADDRESS": HDresult.recordset[i].ADDRESS,
                "LATITUDE": HDresult.recordset[i].LATITUDE,
                "LONGITUDE": HDresult.recordset[i].LONGITUDE,
                "ZIP": HDresult.recordset[i].ZIP,
                "AFM": HDresult.recordset[i].AFM,
                "IMAGE": HDresult.recordset[i].IMAGE,
                "INSDATE": HDresult.recordset[i].INSDATE,
                "ISACTIVE": HDresult.recordset[i].ISACTIVE,
                "ROLES": []
            });
        }

        var sqlDT = " SELECT "
            + "    U.USERS AS USERID,"
            + "    R.ROLES AS ROLE_ID,"
            + "    R.NAME AS ROLE_NAME"
            + " FROM USERS U "
            + " LEFT JOIN USER_ROLES US ON US.USERS = U.USERS "
            + " LEFT JOIN ROLES R ON R.ROLES = US.ROLES "

        sqlDT += mainWhere + extraWhere;


        const DTresult = await sql.query(sqlDT);


        for (var i = 0; i < DTresult.recordset.length; i++) {

            const index = response.data.map(object => object.USERID).indexOf(DTresult.recordset[i].USERID);

            if (index == -1) continue;

            response.data[index].ROLES.push({
                "ROLE_ID": DTresult.recordset[i].ROLE_ID,
                "ROLE_NAME": DTresult.recordset[i].ROLE_NAME
            });
        }
        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err;
        return response;
    }

}

async function getCategories(obj) {
    try {
        const response = common.initResponse();


        var extraWhere = "";

        var mainWhere = " WHERE 1=1 ";

        if (common.validateValue(obj.categories))
            extraWhere += " AND C.CATEGORIES = " + obj.categories;
        if (common.validateValue(obj.isactive))
            extraWhere += " AND C.ISACTIVE = '" + obj.isactive;
        if (common.validateValue(obj.name))
            extraWhere += " AND C.NAME = '" + obj.name + "'";


        var sqlHD = " SELECT "
            + "    C.CATEGORIES, "
            + "    C.NAME, "
            + "    C.ISACTIVE "
            + " FROM CATEGORIES C ";

        sqlHD += mainWhere + extraWhere;


        const HDresult = await sql.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "CATEGORIES": HDresult.recordset[i].CATEGORIES,
                "CODE": HDresult.recordset[i].CODE,
                "NAME": HDresult.recordset[i].NAME
            });
        }

        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err;
        return response;
    }

}

async function getCountries(obj) {
    try {
        const response = common.initResponse();


        var extraWhere = "";

        var mainWhere = " WHERE 1=1 ";

        if (common.validateValue(obj.countries))
            extraWhere += " AND C.CATEGORIES = " + obj.countries;
        if (common.validateValue(obj.name))
            extraWhere += " AND C.name = '" + obj.name + "'";
        if (common.validateValue(obj.iso))
            extraWhere += " AND C.iso = '" + obj.iso + "'";


        var sqlHD = " SELECT "
            + "    C.COUNTRIES, "
            + "    C.NAME, "
            + "    C.ISO "
            + " FROM COUNTRIES C ";

        sqlHD += mainWhere + extraWhere;


        const HDresult = await sql.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "COUNTRIES": HDresult.recordset[i].COUNTRIES,
                "NAME": HDresult.recordset[i].NAME,
                "ISO": HDresult.recordset[i].ISO
            });
        }

        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err;
        return response;
    }

}


async function getAuctions(obj) {
    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        var extraWhere = "";

        var mainWhere = " WHERE 1=1 ";

        if (common.validateValue(obj.auctionid))
            extraWhere += " AND A.AUCTIONS = " + obj.auctionid;
        if (common.validateValue(obj.name))
            extraWhere += " AND A.NAME = " + obj.name;
        if (common.validateValue(obj.seller))
            extraWhere += " AND A.SELLER = " + obj.seller;
        if (common.validateValue(obj.isactive))
            extraWhere += " AND A.ISACTIVE = " + obj.isactive;
        if (common.validateValue(obj.sold_to))
            extraWhere += " AND A.SOLD_TO = " + obj.sold_to;

        //filter ends today
        if (common.validateValue(obj.ends_today))
            extraWhere += " AND Convert(date, A.ENDS) = Convert(date, getdate())";
        //filter started today
        if (common.validateValue(obj.started_today))
            extraWhere += " AND Convert(date, A.STARTED) = Convert(date, getdate())";


        var sqlHD = " SELECT "
            + "    A.AUCTIONS, "
            + "    A.NAME, "
            + "    A.DESCRIPTION, "
            + "    A.CURRENTLY, "
            + "    A.BUY_PRICE, "
            + "    A.FIRST_BID, "
            + "    A.NUMBER_OF_BIDS, "
            + "    ISNULL(A.LATITUDE,0) AS LATITUDE, "
            + "    ISNULL(A.LONGITUDE,0) AS LONGITUDE, "
            + "    A.STARTED, "
            + "    A.ENDS, "
            + "    A.ISSTARTED, "
            + "    A.ISACTIVE, "
            + "    CASE WHEN A.STARTED > GETDATE() OR (SELECT COUNT(*) FROM BIDS WHERE AUCTIONS = A.AUCTIONS) > 0 THEN 0 ELSE 1 END AS ISEDIT ,"
            //COUNTRY
            + "    A.COUNTRY, "
            + "    CA.NAME AS COUNTRY_NAME, "
            //SELLER
            + "    A.SELLER, "
            + "    U.SELLER_RATING, "
            + "    U.FIRSTNAME AS SELLER_FIRSTNAME , "
            + "    U.LASTNAME AS SELLER_LASTNAME , "
            + "    U.USERNAME AS SELLER_USERNAME , "
            //SOLD_TO
            + "    A.SOLD_TO, "
            + "    US.FIRSTNAME AS SOLD_TO_FIRSTNAME, "
            + "    US.LASTNAME AS SOLD_TO_LASTNAME, "
            + "    US.USERNAME AS SOLD_TO_USERNAME, "
            + "    US.BIDDER_RATING "
            + " FROM AUCTIONS A "
            + " LEFT JOIN COUNTRIES CA ON CA.COUNTRIES = A.COUNTRY "
            + " LEFT JOIN USERS U ON U.USERS = A.SELLER "
            + " LEFT JOIN USERS US ON US.USERS = A.SOLD_TO ";

        sqlHD += mainWhere + extraWhere;


        const HDresult = await DBrequest.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "AUCTIONS": HDresult.recordset[i].AUCTIONS,
                "NAME": HDresult.recordset[i].NAME,
                "DESCRIPTION": HDresult.recordset[i].DESCRIPTION,
                "CURRENTLY": HDresult.recordset[i].CURRENTLY,
                "BUY_PRICE": HDresult.recordset[i].BUY_PRICE,
                "FIRST_BID": HDresult.recordset[i].FIRST_BID,
                "NUMBER_OF_BIDS": HDresult.recordset[i].NUMBER_OF_BIDS,
                "LATITUDE": HDresult.recordset[i].LATITUDE == 0 ? 37.97980251 : HDresult.recordset[i].LATITUDE,
                "LONGITUDE": HDresult.recordset[i].LONGITUDE == 0 ? 23.73664856 : HDresult.recordset[i].LONGITUDE,
                "STARTED": HDresult.recordset[i].STARTED,
                "ENDS": HDresult.recordset[i].ENDS,
                "ISSTARTED": HDresult.recordset[i].ISSTARTED == 0 ? null : HDresult.recordset[i].ISSTARTED,
                "ISEDIT": HDresult.recordset[i].ISEDIT,
                "ISACTIVE": HDresult.recordset[i].ISACTIVE,

                "COUNTRY": HDresult.recordset[i].COUNTRY,
                "COUNTRY_NAME": HDresult.recordset[i].COUNTRY_NAME,

                "SELLER": HDresult.recordset[i].SELLER,
                "SELLER_RATING": HDresult.recordset[i].SELLER_RATING,
                "SELLER_FIRSTNAME": HDresult.recordset[i].SELLER_FIRSTNAME,
                "SELLER_LASTNAME": HDresult.recordset[i].SELLER_LASTNAME,
                "SELLER_USERNAME": HDresult.recordset[i].SELLER_USERNAME,

                "SOLD_TO": HDresult.recordset[i].SOLD_TO,
                "SOLD_TO_FIRSTNAME": HDresult.recordset[i].SOLD_TO_FIRSTNAME,
                "SOLD_TO_LASTNAME": HDresult.recordset[i].SOLD_TO_LASTNAME,
                "SOLD_TO_USERNAME": HDresult.recordset[i].SOLD_TO_USERNAME,
                "BIDDER_RATING": HDresult.recordset[i].BIDDER_RATING,

                "CATEGORIES":[]
            });
        }

        var sqlDT = " SELECT "
            + "    A.AUCTIONS AS AUCTIONS,"
            + "    C.CATEGORIES AS CATEGORIES_ID,"
            + "    C.NAME AS CATEGORIES_NAME,"
            + "    C.ISACTIVE AS ISACTIVE"
            + " FROM AUCTIONS A "
            + " INNER JOIN AUCTION_CATEGORIES AC ON AC.AUCTIONS = A.AUCTIONS "
            + " INNER JOIN CATEGORIES C ON C.CATEGORIES = AC.CATEGORIES "

        sqlDT += mainWhere + extraWhere;


        const DTresult = await sql.query(sqlDT);


        for (var i = 0; i < DTresult.recordset.length; i++) {

            const index = response.data.map(object => object.AUCTIONS).indexOf(DTresult.recordset[i].AUCTIONS);

            if (index == -1) continue;

            response.data[index].CATEGORIES.push({
                "CATEGORIES_ID": DTresult.recordset[i].CATEGORIES_ID,
                "CATEGORIES_NAME": DTresult.recordset[i].CATEGORIES_NAME,
                "ISACTIVE": DTresult.recordset[i].ISACTIVE
            });
        }






        response.status = true;

        return response;
    }
    catch (error) {
        response.error = error;
        return response;
    }

}

async function getAuctionBIDS(obj) {
    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        var extraWhere = "";

        var mainWhere = " WHERE 1=1 ";

        if (common.validateValue(obj.auctionid))
            extraWhere += " AND A.AUCTIONS = " + obj.auctionid;
        if (common.validateValue(obj.name))
            extraWhere += " AND A.NAME = " + obj.name;
        if (common.validateValue(obj.seller))
            extraWhere += " AND A.SELLER = " + obj.seller;
        if (common.validateValue(obj.isactive))
            extraWhere += " AND A.ISACTIVE = " + obj.isactive;
        if (common.validateValue(obj.sold_to))
            extraWhere += " AND A.SOLD_TO = " + obj.sold_to;

        //filter ends today
        if (common.validateValue(obj.ends_today))
            extraWhere += " AND Convert(date, A.ENDS) = Convert(date, getdate())";
        //filter started today
        if (common.validateValue(obj.started_today))
            extraWhere += " AND Convert(date, A.STARTED) = Convert(date, getdate())";



        var sqlHD = " SELECT "
            + "    A.AUCTIONS, "
            + "    A.NAME, "
            + "    A.DESCRIPTION, "
            + "    A.CURRENTLY, "
            + "    A.BUY_PRICE, "
            + "    A.FIRST_BID, "
            + "    A.NUMBER_OF_BIDS, "
            + "    ISNULL(A.LATITUDE,0) AS LATITUDE, "
            + "    ISNULL(A.LONGITUDE,0) AS LONGITUDE, "
            + "    A.STARTED, "
            + "    A.ENDS, "
            + "    A.ISSTARTED, "
            + "    A.ISACTIVE, "
            + "    CASE WHEN A.STARTED > GETDATE() OR (SELECT COUNT(*) FROM BIDS WHERE AUCTIONS = A.AUCTIONS) > 0 THEN 0 ELSE 1 END AS ISEDIT ,"
            //COUNTRY
            + "    A.COUNTRY, "
            + "    CA.NAME AS COUNTRY_NAME, "
            //SELLER
            + "    A.SELLER, "
            + "    U.SELLER_RATING, "
            + "    U.FIRSTNAME AS SELLER_FIRSTNAME , "
            + "    U.LASTNAME AS SELLER_LASTNAME  , "
            + "    U.USERNAME AS SELLER_USERNAME  , "
            //SOLD_TO
            + "    A.SOLD_TO, "
            + "    US.FIRSTNAME AS SOLD_TO_FIRSTNAME, "
            + "    US.LASTNAME AS SOLD_TO_LASTNAME , "
            + "    US.USERNAME AS SOLD_TO_USERNAME , "
            + "    US.BIDDER_RATING "
            + " FROM AUCTIONS A "
            + " LEFT JOIN COUNTRIES CA ON CA.COUNTRIES = A.COUNTRY "
            + " LEFT JOIN USERS U ON U.USERS = A.SELLER "
            + " LEFT JOIN USERS US ON US.USERS = A.SOLD_TO ";

        sqlHD += mainWhere + extraWhere;


        const HDresult = await DBrequest.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "AUCTIONS": HDresult.recordset[i].AUCTIONS,
                "NAME": HDresult.recordset[i].NAME,
                "DESCRIPTION": HDresult.recordset[i].DESCRIPTION,
                "CURRENTLY": HDresult.recordset[i].CURRENTLY,
                "BUY_PRICE": HDresult.recordset[i].BUY_PRICE,
                "FIRST_BID": HDresult.recordset[i].FIRST_BID,
                "NUMBER_OF_BIDS": HDresult.recordset[i].NUMBER_OF_BIDS,
                "LATITUDE": HDresult.recordset[i].LATITUDE == 0 ? 37.97980251 : HDresult.recordset[i].LATITUDE,
                "LONGITUDE": HDresult.recordset[i].LONGITUDE == 0 ? 23.73664856 : HDresult.recordset[i].LONGITUDE,
                "STARTED": HDresult.recordset[i].STARTED,
                "ENDS": HDresult.recordset[i].ENDS,
                "ISSTARTED": HDresult.recordset[i].ISSTARTED == 0 ? null : HDresult.recordset[i].ISSTARTED,
                "ISEDIT": HDresult.recordset[i].ISEDIT,
                "ISACTIVE": HDresult.recordset[i].ISACTIVE,

                "COUNTRY": HDresult.recordset[i].COUNTRY,
                "COUNTRY_NAME": HDresult.recordset[i].COUNTRY_NAME,

                "SELLER": HDresult.recordset[i].SELLER,
                "SELLER_RATING": HDresult.recordset[i].SELLER_RATING,
                "SELLER_FIRSTNAME": HDresult.recordset[i].SELLER_FIRSTNAME,
                "SELLER_LASTNAME": HDresult.recordset[i].SELLER_LASTNAME,
                "SELLER_USERNAME": HDresult.recordset[i].SELLER_USERNAME,

                "SOLD_TO": HDresult.recordset[i].SOLD_TO,
                "SOLD_TO_FIRSTNAME": HDresult.recordset[i].SOLD_TO_FIRSTNAME,
                "SOLD_TO_LASTNAME": HDresult.recordset[i].SOLD_TO_LASTNAME,
                "SOLD_TO_USERNAME": HDresult.recordset[i].SOLD_TO_USERNAME,
                "BIDDER_RATING": HDresult.recordset[i].BIDDER_RATING,

                "BIDS": []
            });
        }


        var sqlDT = " SELECT "
            + "             A.AUCTIONS AS AUCTIONS, "
            + "             A.NAME AS AUCTION_NAME, "
            + "             B.BID AS BID_ID, "
            + "             B.TIME AS BID_TIME, "
            + "             B.AMOUNT AS BID_AMOUNT, "
            + "             U.BIDDER_RATING AS BIDDER_RATING, "
            + "             U.LATITUDE AS BIDDER_LATITUDE, "
            + "             U.LONGITUDE AS BIDDER_LONGITUDE, "
            + "             U.COUNTRY AS BIDDER_COUNTRY, "
            + "             U.FIRSTNAME AS BIDDER_FIRSTNAME, "
            + "             U.LASTNAME AS BIDDER_LASTNAME, "
            + "             U.USERNAME AS BIDDER_USERNAME, "
            + "             C.NAME AS BIDDER_COUNTRY_NAME "
            + " FROM BIDS BS "
            + " LEFT JOIN AUCTIONS A ON A.AUCTIONS = BS.AUCTIONS "
            + " LEFT JOIN BID B ON B.BID = BS.BID "
            + " INNER JOIN USERS U ON U.USERS = B.BIDDER "
            + " INNER JOIN COUNTRIES C ON C.COUNTRIES = U.COUNTRY ";

        sqlDT += mainWhere + extraWhere;


        const DTresult = await sql.query(sqlDT);


        for (var i = 0; i < DTresult.recordset.length; i++) {

            const index = response.data.map(object => object.AUCTIONS).indexOf(DTresult.recordset[i].AUCTIONS);

            if (index == -1) continue;

            response.data[index].BIDS.push({
                "AUCTIONS": DTresult.recordset[i].AUCTIONS,
                "AUCTION_NAME": DTresult.recordset[i].AUCTION_NAME,
                "BID_ID": DTresult.recordset[i].BID_ID,
                "BID_TIME": DTresult.recordset[i].BID_TIME,
                "BID_AMOUNT": DTresult.recordset[i].BID_AMOUNT,
                "BIDDER_RATING": DTresult.recordset[i].BIDDER_RATING,
                "BIDDER_LATITUDE": DTresult.recordset[i].BIDDER_LATITUDE,
                "BIDDER_LONGITUDE": DTresult.recordset[i].BIDDER_LONGITUDE,
                "BIDDER_COUNTRY": DTresult.recordset[i].BIDDER_COUNTRY,
                "BIDDER_FIRSTNAME": DTresult.recordset[i].BIDDER_FIRSTNAME,
                "BIDDER_LASTNAME": DTresult.recordset[i].BIDDER_LASTNAME,
                "BIDDER_USERNAME": DTresult.recordset[i].BIDDER_USERNAME,
                "BIDDER_COUNTRY_NAME": DTresult.recordset[i].BIDDER_COUNTRY_NAME
            });
        }







        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err;
        return response;
    }

}

async function getMessages(obj) {
    try {
        const response = common.initResponse();
        var DBrequest = new sql.Request();

        var extraWhere = "";

        var mainWhere = " WHERE 1=1 ";


        if (common.validateValue(obj.messageid))
            extraWhere += " AND M.MESSAGES = " + obj.messageid;
        if (common.validateValue(obj.creator))
            extraWhere += " AND M.CREATOR = " + obj.creator;
        if (common.validateValue(obj.recipient))
            extraWhere += " AND M.RECIPIENT = " + obj.recipient;
        if (common.validateValue(obj.isread))
            extraWhere += " AND M.ISREAD = " + obj.isread;
        if (common.validateValue(obj.create_date))
            extraWhere += " AND M.CREATE_DATE = " + obj.create_date+"'";
        if (common.validateValue(obj.expire_date))
            extraWhere += " AND M.EXPIRE_DATE = " + obj.expire_date + "'";
        if (common.validateValue(obj.parent_message_id))
            extraWhere += " AND M.PARENT_MESSAGE_ID = " + obj.parent_message_id;

        //filter ends today
        //if (common.validateValue(obj.ends_today))
        //    extraWhere += " AND Convert(date, A.ENDS) = Convert(date, getdate())";
        //filter started today
        //if (common.validateValue(obj.started_today))
        //    extraWhere += " AND Convert(date, A.STARTED) = Convert(date, getdate())";



        var sqlHD = " SELECT "
            + "    M.MESSAGES, "
            + "    M.SUBJECT, "
            + "    M.MESSAGE_BODY, "
            + "    M.CREATE_DATE, "
            + "    M.EXPIRE_DATE, "
            + "    M.ISREAD, "
            // Recipient User Info
            + "    M.RECIPIENT, "
            + "    U.FIRSTNAME AS RECIPIENT_FIRSTNAME, "
            + "    U.LASTNAME AS RECIPIENT_LASTNAME, "
            + "    U.USERNAME AS RECIPIENT_USERNAME, "
            + "    U.EMAIL AS RECIPIENT_EMAIL, "
            + "    U.PHONE01 AS RECIPIENT_PHONE01, "
            + "    U.PHONE02 AS RECIPIENT_PHONE02, "
            + "    U.COUNTRY AS RECIPIENT_COUNTRY, "
            + "    C.NAME AS RECIPIENT_COUNTRY_NAME, "
            + "    U.CITY AS RECIPIENT_CITY, "
            + "    U.DISTRICT AS RECIPIENT_DISTRICT, "
            + "    U.ADDRESS AS RECIPIENT_ADDRESS, "
            + "    U.IMAGE AS RECIPIENT_IMAGE, "
            // Creator User Info
            + "    M.CREATOR, "
            + "    UC.FIRSTNAME AS CREATOR_FIRSTNAME, "
            + "    UC.LASTNAME AS CREATOR_LASTNAME, "
            + "    UC.USERNAME AS CREATOR_USERNAME, "
            + "    UC.EMAIL AS CREATOR_EMAIL, "
            + "    UC.PHONE01 AS CREATOR_PHONE01, "
            + "    UC.PHONE02 AS CREATOR_PHONE02, "
            + "    UC.COUNTRY AS CREATOR_COUNTRY, "
            + "    CU.NAME AS CREATOR_COUNTRY_NAME, "
            + "    UC.CITY AS CREATOR_CITY, "
            + "    UC.DISTRICT AS CREATOR_DISTRICT, "
            + "    UC.ADDRESS AS CREATOR_ADDRESS, "
            + "    UC.IMAGE AS CREATOR_IMAGE "
            + " FROM MESSAGES M "
            + " LEFT JOIN USERS U ON U.USERS = M.RECIPIENT "
            + " LEFT JOIN USERS UC ON UC.USERS = M.CREATOR "
            + " LEFT JOIN COUNTRIES C ON C.COUNTRIES = U.COUNTRY "
            + " LEFT JOIN COUNTRIES CU ON CU.COUNTRIES = UC.COUNTRY ";

        sqlHD += mainWhere + extraWhere;


        const HDresult = await DBrequest.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "MESSAGES": HDresult.recordset[i].MESSAGES,
                "SUBJECT": HDresult.recordset[i].SUBJECT,
                "MESSAGE_BODY": HDresult.recordset[i].MESSAGE_BODY,
                "CREATE_DATE": HDresult.recordset[i].CREATE_DATE,
                "EXPIRE_DATE": HDresult.recordset[i].EXPIRE_DATE,
                "ISREAD": HDresult.recordset[i].ISREAD,

                "RECIPIENT": HDresult.recordset[i].RECIPIENT,
                "RECIPIENT_FIRSTNAME": HDresult.recordset[i].RECIPIENT_FIRSTNAME,
                "RECIPIENT_LASTNAME": HDresult.recordset[i].RECIPIENT_LASTNAME,
                "RECIPIENT_USERNAME": HDresult.recordset[i].RECIPIENT_USERNAME,
                "RECIPIENT_EMAIL": HDresult.recordset[i].RECIPIENT_EMAIL,
                "RECIPIENT_PHONE01": HDresult.recordset[i].RECIPIENT_PHONE01,
                "RECIPIENT_PHONE02": HDresult.recordset[i].RECIPIENT_PHONE02,
                "RECIPIENT_COUNTRY": HDresult.recordset[i].RECIPIENT_COUNTRY,
                "RECIPIENT_COUNTRY_NAME": HDresult.recordset[i].RECIPIENT_COUNTRY_NAME,
                "RECIPIENT_CITY": HDresult.recordset[i].RECIPIENT_CITY,
                "RECIPIENT_DISTRICT": HDresult.recordset[i].RECIPIENT_DISTRICT,
                "RECIPIENT_ADDRESS": HDresult.recordset[i].RECIPIENT_ADDRESS,
                "RECIPIENT_IMAGE": HDresult.recordset[i].RECIPIENT_IMAGE,

                "CREATOR": HDresult.recordset[i].CREATOR,
                "CREATOR_FIRSTNAME": HDresult.recordset[i].CREATOR_FIRSTNAME,
                "CREATOR_LASTNAME": HDresult.recordset[i].CREATOR_LASTNAME,
                "CREATOR_USERNAME": HDresult.recordset[i].CREATOR_USERNAME,
                "CREATOR_EMAIL": HDresult.recordset[i].CREATOR_EMAIL,
                "CREATOR_PHONE01": HDresult.recordset[i].CREATOR_PHONE01,
                "CREATOR_PHONE02": HDresult.recordset[i].CREATOR_PHONE02,
                "CREATOR_COUNTRY": HDresult.recordset[i].CREATOR_COUNTRY,
                "CREATOR_COUNTRY_NAME": HDresult.recordset[i].CREATOR_COUNTRY_NAME,
                "CREATOR_CITY": HDresult.recordset[i].CREATOR_CITY,
                "CREATOR_DISTRICT": HDresult.recordset[i].CREATOR_DISTRICT,
                "CREATOR_ADDRESS": HDresult.recordset[i].CREATOR_ADDRESS,
                "CREATOR_IMAGE": HDresult.recordset[i].CREATOR_IMAGE,
                "CHILD_MESSAGES": []
            });
        }


        // Child messages Detail
        var sqlDT = " SELECT "
            + "    M.MESSAGES , "
            + "    MC.MESSAGES AS CHILD_MESSAGE, "
            + "    MC.SUBJECT, "
            + "    MC.MESSAGE_BODY, "
            + "    MC.CREATE_DATE, "
            + "    MC.EXPIRE_DATE, "
            + "    MC.ISREAD, "
            // Recipient User Info
            + "    MC.RECIPIENT, "
            + "    U.FIRSTNAME AS RECIPIENT_FIRSTNAME, "
            + "    U.LASTNAME AS RECIPIENT_LASTNAME, "
            + "    U.USERNAME AS RECIPIENT_USERNAME, "
            + "    U.EMAIL AS RECIPIENT_EMAIL, "
            + "    U.PHONE01 AS RECIPIENT_PHONE01, "
            + "    U.PHONE02 AS RECIPIENT_PHONE02, "
            + "    U.COUNTRY AS RECIPIENT_COUNTRY, "
            + "    C.NAME AS RECIPIENT_COUNTRY_NAME, "
            + "    U.CITY AS RECIPIENT_CITY, "
            + "    U.DISTRICT AS RECIPIENT_DISTRICT, "
            + "    U.ADDRESS AS RECIPIENT_ADDRESS, "
            + "    U.IMAGE AS RECIPIENT_IMAGE, "
            // Creator User Info
            + "    MC.CREATOR, "
            + "    UC.FIRSTNAME AS CREATOR_FIRSTNAME, "
            + "    UC.LASTNAME AS CREATOR_LASTNAME, "
            + "    UC.USERNAME AS CREATOR_USERNAME, "
            + "    UC.EMAIL AS CREATOR_EMAIL, "
            + "    UC.PHONE01 AS CREATOR_PHONE01, "
            + "    UC.PHONE02 AS CREATOR_PHONE02, "
            + "    UC.COUNTRY AS CREATOR_COUNTRY, "
            + "    CU.NAME AS CREATOR_COUNTRY_NAME, "
            + "    UC.CITY AS CREATOR_CITY, "
            + "    UC.DISTRICT AS CREATOR_DISTRICT, "
            + "    UC.ADDRESS AS CREATOR_ADDRESS, "
            + "    UC.IMAGE AS CREATOR_IMAGE "
            + " FROM MESSAGES M "
            + " INNER JOIN MESSAGES MC ON MC.PARENT_MESSAGE_ID = M.MESSAGES "
            + " LEFT JOIN USERS U ON U.USERS = MC.RECIPIENT "
            + " LEFT JOIN USERS UC ON UC.USERS = MC.CREATOR "
            + " LEFT JOIN COUNTRIES C ON C.COUNTRIES = U.COUNTRY "
            + " LEFT JOIN COUNTRIES CU ON CU.COUNTRIES = UC.COUNTRY ";

        
        sqlDT += mainWhere + extraWhere;


        var DTresult = await sql.query(sqlDT);


        for (var i = 0; i < DTresult.recordset.length; i++) {

            const index = response.data.map(object => object.MESSAGES).indexOf(DTresult.recordset[i].MESSAGES);

            if (index == -1) continue;

            response.data[index].CHILD_MESSAGES.push({
                "CHILD_MESSAGE": HDresult.recordset[i].CHILD_MESSAGE,
                "SUBJECT": HDresult.recordset[i].SUBJECT,
                "MESSAGE_BODY": HDresult.recordset[i].MESSAGE_BODY,
                "CREATE_DATE": HDresult.recordset[i].CREATE_DATE,
                "EXPIRE_DATE": HDresult.recordset[i].EXPIRE_DATE,
                "ISREAD": HDresult.recordset[i].ISREAD,

                "RECIPIENT": HDresult.recordset[i].RECIPIENT,
                "RECIPIENT_FIRSTNAME": HDresult.recordset[i].RECIPIENT_FIRSTNAME,
                "RECIPIENT_LASTNAME": HDresult.recordset[i].RECIPIENT_LASTNAME,
                "RECIPIENT_USERNAME": HDresult.recordset[i].RECIPIENT_USERNAME,
                "RECIPIENT_EMAIL": HDresult.recordset[i].RECIPIENT_EMAIL,
                "RECIPIENT_PHONE01": HDresult.recordset[i].RECIPIENT_PHONE01,
                "RECIPIENT_PHONE02": HDresult.recordset[i].RECIPIENT_PHONE02,
                "RECIPIENT_COUNTRY": HDresult.recordset[i].RECIPIENT_COUNTRY,
                "RECIPIENT_COUNTRY_NAME": HDresult.recordset[i].RECIPIENT_COUNTRY_NAME,
                "RECIPIENT_CITY": HDresult.recordset[i].RECIPIENT_CITY,
                "RECIPIENT_DISTRICT": HDresult.recordset[i].RECIPIENT_DISTRICT,
                "RECIPIENT_ADDRESS": HDresult.recordset[i].RECIPIENT_ADDRESS,
                "RECIPIENT_IMAGE": HDresult.recordset[i].RECIPIENT_IMAGE,

                "CREATOR": HDresult.recordset[i].CREATOR,
                "CREATOR_FIRSTNAME": HDresult.recordset[i].CREATOR_FIRSTNAME,
                "CREATOR_LASTNAME": HDresult.recordset[i].CREATOR_LASTNAME,
                "CREATOR_USERNAME": HDresult.recordset[i].CREATOR_USERNAME,
                "CREATOR_EMAIL": HDresult.recordset[i].CREATOR_EMAIL,
                "CREATOR_PHONE01": HDresult.recordset[i].CREATOR_PHONE01,
                "CREATOR_PHONE02": HDresult.recordset[i].CREATOR_PHONE02,
                "CREATOR_COUNTRY": HDresult.recordset[i].CREATOR_COUNTRY,
                "CREATOR_COUNTRY_NAME": HDresult.recordset[i].CREATOR_COUNTRY_NAME,
                "CREATOR_CITY": HDresult.recordset[i].CREATOR_CITY,
                "CREATOR_DISTRICT": HDresult.recordset[i].CREATOR_DISTRICT,
                "CREATOR_ADDRESS": HDresult.recordset[i].CREATOR_ADDRESS,
                "CREATOR_IMAGE": HDresult.recordset[i].CREATOR_IMAGE,
            });
        }



        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err;
        return response;
    }

}



async function getAvailableRecipients(obj) {
    try {

        const response = common.initResponse();
        var DBrequest = new sql.Request();


        var mainWhere = "";

        if (common.validateValue(obj.userid)) {

            var paramsUser = { userid: obj.userid }
            var vUser = await getUsers(paramsUser);

            if (vUser.recordcount == 0) {

                response.status = false;
                response.error = "User doesnt exists as user!";
                return response;
            }
        }

        mainWhere = " WHERE (A.SOLD_TO = " + obj.userid + " OR A.SELLER = " + obj.userid + " ) AND A.SOLD_TO IS NOT NULL AND A.SELLER IS NOT NULL";


        var sqlHD = " SELECT "
                    +"         CASE "
                    +"         WHEN A.SOLD_TO = @userid0 THEN A.SELLER "
		            +"         ELSE A.SOLD_TO "
	                +"     END AS RECIPIENT, "
                    +"             U.USERNAME "
                    +" FROM AUCTIONS A "
                    +" LEFT JOIN USERS U "
                    +"         ON CASE  "
                    +"            WHEN A.SOLD_TO = @userid1 THEN A.SELLER  "
                    +"            WHEN A.SELLER = @userid2 THEN A.SOLD_TO "
                    +"            ELSE 0 " 
                    +"         END = U.USERS ";

        sqlHD += mainWhere;

        const HDresult = await DBrequest
            .input('userid0', obj.userid)
            .input('userid1', obj.userid)
            .input('userid2', obj.userid)
            .query(sqlHD);

        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "RECIPIENT": HDresult.recordset[i].RECIPIENT,
                "USERNAME": HDresult.recordset[i].USERNAME
            });
        }

        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err;
        return response;
    }

}

async function getUnreadMessages(obj) {
    try {
        const response = common.initResponse();


        var extraWhere = "";

        var mainWhere = " WHERE M.ISREAD=0 ";

        if (common.validateValue(obj.userid))
            extraWhere += " AND M.RECIPIENT = " + obj.userid;


        var sqlHD = " SELECT "
            + "    COUNT(*) AS TOTAL_UNREAD_MESSAGES "
            + " FROM MESSAGES M ";

        sqlHD += mainWhere + extraWhere;


        const HDresult = await sql.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;

        for (var i = 0; i < HDresult.recordset.length; i++) {
            response.data.push({
                "TOTAL_UNREAD_MESSAGES": HDresult.recordset[i].TOTAL_UNREAD_MESSAGES
            });
        }

        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err;
        return response;
    }

}

async function getXmlFileData(obj) {
    try {
        const response = common.initResponse();


        //var extraWhere = "";

        //var mainWhere = " WHERE 1=1 ";

        //if (common.validateValue(obj.userid))
        //    extraWhere += " AND M.RECIPIENT = " + obj.userid;


        var sqlHD = "SELECT ( SELECT "
            + "             A.AUCTIONS AS AUCTIONS, "
            + "             A.NAME AS AUCTION_NAME, "
            + "             B.BID AS BID_ID, "
            + "             B.TIME AS BID_TIME, "
            + "             B.AMOUNT AS BID_AMOUNT, "
            + "             U.BIDDER_RATING AS BIDDER_RATING, "
            + "             U.LATITUDE AS BIDDER_LATITUDE, "
            + "             U.LONGITUDE AS BIDDER_LONGITUDE, "
            + "             U.COUNTRY AS BIDDER_COUNTRY, "
            + "             U.FIRSTNAME AS BIDDER_FIRSTNAME, "
            + "             U.LASTNAME AS BIDDER_LASTNAME, "
            + "             U.USERNAME AS BIDDER_USERNAME, "
            + "             C.NAME AS BIDDER_COUNTRY_NAME "
            + " FROM BIDS BS "
            + " LEFT JOIN AUCTIONS A ON A.AUCTIONS = BS.AUCTIONS "
            + " LEFT JOIN BID B ON B.BID = BS.BID "
            + " INNER JOIN USERS U ON U.USERS = B.BIDDER "
            + " INNER JOIN COUNTRIES C ON C.COUNTRIES = U.COUNTRY "
            + " FOR XML AUTO ) AS XML_DATA";

        //sqlHD += mainWhere + extraWhere;


        const HDresult = await sql.query(sqlHD)
        response.recordcount = HDresult.recordset.length;
        //response.data = result.recordset;


        response.data.push(HDresult.recordset[0]);

        response.status = true;

        return response;
    }
    catch (error) {
        response.error = err.message;
        return response;
    }

}


module.exports = {
    getUsers: getUsers,
    getCategories: getCategories,
    getAuctions: getAuctions,
    getAuctionBIDS: getAuctionBIDS,
    getCountries: getCountries,
    getMessages: getMessages,
    getAvailableRecipients: getAvailableRecipients,
    getUnreadMessages: getUnreadMessages,
    getXmlFileData: getXmlFileData
}