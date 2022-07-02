import axios from 'axios';
//const API_URL = process.env.REACT_APP_API_URL
const API_URL = 'http://localhost:1337/'

 



class AuthService {

    
    

    login(username, password) {
        
        console.log(process.env);
        console.log(process.env.REACT_APP_API_URL);

        return axios.post(API_URL + "login", {
                username,
                password
            })
            .then(response => {

                if (response.data.token) {
                    localStorage.setItem("user", JSON.stringify(response.data));
                }
        
                return response.data;
            });
    }

    logout() {
        localStorage.removeItem("user");
    }

    register(username, password, firstname, lastname, email, phone01, phone02, country, city, district, address, latitude, longitude, zip, afm, image) {

        return axios.post(API_URL + "register", {
            username,
            password,
            firstname,
            lastname,
            email ,
            phone01,
            phone02,
            country,
            city,
            district,
            address,
            latitude,
            longitude,
            zip,
            afm,
            image,
            roles: [2],
            isactive: 0
        });
    }

    getCurrentUser() {
        return JSON.parse(localStorage.getItem("user"));
    }

}


export default new AuthService();