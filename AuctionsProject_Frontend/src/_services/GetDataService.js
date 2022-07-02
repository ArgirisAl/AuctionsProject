import axios from 'axios';
//const API_URL = process.env.REACT_APP_API_URL
const API_URL = 'http://localhost:1337/'





class GetData {




    GetUserAuctions(userid) {

        return axios.get(API_URL + "getAuctions", {
            userid
        })
            .then(response => {
                console.log(response);

                return response.data;
            });
    }



}


export default new GetData();
