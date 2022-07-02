'use strict';
var sql = require("mssql");
var getData = require('./getData');
var common = require('..//common/common');

async function delCategories(obj) {
    const response = common.initResponse();
    var DBrequest = new sql.Request();

    try {

        var sqlCategories = " DELETE FROM CATEGORIES WHERE CODE = @code AND NAME = @name ";
        await DBrequest
            .input('code', obj.code)
            .input('name', obj.name)
            .query(sqlCategories);

        response.status = true;

        return response;


    } catch (err) {
        response.error = err;
        return response;
    }
}

async function deleteUser(obj) {
    const response = common.initResponse();
    var DBrequest = new sql.Request();

    try {

        var sqlUsers = " DELETE FROM USERS WHERE USERS = @userid";
        await DBrequest
            .input('userid', obj.userid)
            .query(sqlUsers);

        response.status = true;

        return response;


    } catch (err) {
        response.error = err;
        return response;
    }
}

module.exports = {
    delCategories: delCategories,
    deleteUser: deleteUser
}