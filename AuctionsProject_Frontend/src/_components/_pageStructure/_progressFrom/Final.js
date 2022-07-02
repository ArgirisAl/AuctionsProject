import React, { useEffect, useState, useMemo } from 'react';
import { Button, FormControl, Form, Row, Col, InputGroup, Alert } from "react-bootstrap";
import axios from 'axios';
import AuthService from '../../../_services/AuthService';


const Final = ({ handleOnSubmit, prevStep, values }) => {
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const [message, setMessage] = useState()
    const [successful, setSuccessful] = useState()
    const [currentUser, setCurrentUser] = useState(undefined);

    
    useEffect(() => {

        const fetchUser = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user) {
                    setCurrentUser(AuthService.getCurrentUser());
                }
            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchUser();
        

    }, []);
    // after form submit validating the form data using validator
    const submitFormData = (e) => {
        e.preventDefault();

        const postAuction = async () => {
            try {


                const {
                    categories,
                    buy_price,
                    first_bid,
                    lat,
                    lng,
                    started,
                    ends,
                    description,
                    name
                } = values;


                //const response = await axios.post("http://localhost:1337/setAuctions", {
                //    name: description,
                //    categories,
                //    buy_price,
                //    first_bid,
                //    lat,
                //    lng,
                //    started,
                //    ends,
                //    description,
                //    name,
                //    seller: currentUser.data[0].USERID
                //
                //});

                const response = axios.post("http://localhost:1337/setAuctions", {
                    name: description,
                    categories,
                    buy_price,
                    first_bid,
                    lat,
                    lng,
                    started,
                    ends,
                    description,
                    name,
                    seller: currentUser.data[0].USERID

                })
                    .then(response => {
                        setData(response.data);
                        setSuccessful(true);
                        setMessage("Επιτυχής καταχώρηση με κωδικό : " + response.data.recordID + " ");
                });

                

            } catch (error) {
                setError(error.message);
                setSuccessful(false);
            } finally {

            }
        }
        postAuction();

    };
    console.log({ message });
    console.log(data);
    //destructuring the object from values
    const {
        categories,
        buy_price,
        first_bid,
        lat,
        lng,
        started,
        ends,
        description,
        name
    } = values;

   // console.log({ successful});
    //console.log(currentUser);
    return (
        <>
            {!successful ? (
                <div>
                    <Form onSubmit={submitFormData}>


                        <p>
                            <strong>categories :</strong> {categories}{" "}
                        </p>
                        <p>
                            <strong>buy_price :</strong> {buy_price}{" "}
                        </p>
                        <p>
                            <strong>first_bid :</strong> {first_bid}{" "}
                        </p>
                        <p>
                            <strong>lat :</strong> {lat}{" "}
                        </p>
                        <p>
                            <strong>lng :</strong> {lng}{" "}
                        </p>
                        <p>
                            <strong>started :</strong> {started}{" "}
                        </p>
                        <p>
                            <strong>ends :</strong> {ends}{" "}
                        </p>
                        <p>
                            <strong>description :</strong> {description}{" "}
                        </p>
                        <p>
                            <strong>name :</strong> {name}{" "}
                        </p>

                        {error && (
                            <div className="form-group">
                                <div
                                    className={
                                        successful
                                            ? "alert alert-successful"
                                            : "alert alert-danger"
                                    }
                                    role="alert"
                                >
                                    {message}
                                </div>
                            </div>
                        )}

                        <div style={{ display: "flex", justifyContent: "space-around" }}>
                            <Button variant="primary" onClick={prevStep}>
                                Προηγούμενο
                            </Button>

                            <Button variant="primary" type="submit" value="Submit">
                                Καταχώρηση
                            </Button>
                        </div>
                    </Form>
                </div>
            ) : (
                    <div>
                        <div className="form-group">
                            <div
                                className={
                                    successful
                                        ? "alert alert-successful"
                                        : "alert alert-danger"
                                }
                                role="alert"
                            >
                                <Alert >
                                    {message}
                                    <Alert.Link href="/"> Αρχική Σελίδα</Alert.Link>.
                                </Alert>
                            </div>
                        </div>

                    </div>
               )}
        </>
    );
};

export default Final;
