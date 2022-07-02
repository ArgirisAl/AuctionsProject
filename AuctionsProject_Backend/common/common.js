'use strict';

const initResponse = () => {

    const initResponse = {
        status: false,
        error: "",
        token: "",
        message: "",
        recordcount: 0,
        data: []
    }

    return initResponse;
};


const validateValue = (value) => {

    if (value !== undefined && value !== null && value !== '')
        return true;
    else
        return false;
};

module.exports = {
    initResponse: initResponse,
    validateValue: validateValue
}