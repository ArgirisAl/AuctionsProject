import React, { useEffect, useState, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormGroup, FormControl, ControlLabel, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';
//import AuthService from '../_services/auth.service';

const SetAuction = (url) => {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        axios
            .get(url)
            .then((response) => setData(response.data))
            .catch((error) => setError(error.message))
            .finally(() => setLoaded(true));
    }, []);
    return { data, error, loaded };
};

export {
    SetAuction
}