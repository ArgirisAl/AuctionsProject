import React, { useEffect, useState } from 'react';
import { Modal, InputGroup, Button, FormControl, Form } from "react-bootstrap";
import validator from "validator";
import axios from 'axios';
import AuthService from '../../../_services/AuthService';


const AuctionBidModal = (data) => {

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [bidValue, setBidValue] = useState();
    const [currentUser, setCurrentUser] = useState(undefined);

    // Confirmation Modal
    const [showConfirm, setShowConfirm] = useState(false);
    const handleCloseConfirm = () => setShowConfirm(false);
    const handleShowConfirm = () => setShowConfirm(true);

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

        if (validator.isNumeric(bidValue) && (parseInt(bidValue) <= parseInt(data.data.BUY_PRICE))) {
            setError(false);
            //console.log(bidValue);
            //console.log(data.data.AUCTIONS);
            //console.log(currentUser.data[0].USERID);

            const auctionid = data.data.AUCTIONS;
            const bidder = currentUser.data[0].USERID;
            const amount = bidValue;
            try {
                
                const response = axios.post("http://localhost:1337/setAuctionBids", {
                    auctionid,
                    bidder,
                    amount
                })
                    .then(response => {
                        window.location.reload();
                    });
            
            } catch (error) {
                setError(error.message);
            } finally {
            
            }

        } else if (validator.isEmpty(bidValue)) {
            setError(true);
            setErrorMessage("Η Προσφορά είναι υποχρεωτικό πεδίο!");
        } else if (!validator.isNumeric(bidValue)) {
            setError(true);
            setErrorMessage("Άκυρη τιμή πεδίου!");
        } else if (parseInt(bidValue) > parseInt(data.data.BUY_PRICE)) {
            setError(true);
            setErrorMessage("Μέγιστη Τιμή Προσφοράς : " + data.data.BUY_PRICE +"€" );
        }
    };

    return (
        <div>
            <Form onSubmit={submitFormData}>


                <Form.Group className="mb-3">


                    <Form.Label>Δώστε Προσφορά (Μέγιστη Τιμή Προσφοράς: {data.data.BUY_PRICE}€)</Form.Label>
                    <InputGroup className="mb-3" onChange={e => setBidValue(e.target.value)}>
                        <InputGroup.Text>€</InputGroup.Text>
                        <FormControl aria-label="Amount (to the nearest dollar)" />
                        <InputGroup.Text></InputGroup.Text>
                    </InputGroup>

                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            {errorMessage}
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>

                <Button type="submit" variant="primary">
                    Καταχώρηση Προσφοράς
                </Button>

            </Form>
        </div>
    );
};

export default AuctionBidModal;
