import axios from 'axios';
import authHeader from './AuthHeader';

const API_URL = 'hhtp://'


class UserService {
    getPublicContent() {
        return axios.get(API_URL + "all")
    }

    getUserBoard() {
        return axios.get(API_URL + "user", { header: authHeader() });
    }

    getModeratorBoard() {
        return axios.get(API_URL + "mod", { header: authHeader() });
    }

    getAdminBoard() {
        return axios.get(API_URL + "admin", { header: authHeader() });
    }
}

export default new UserService();