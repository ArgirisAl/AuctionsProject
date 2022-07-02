import React, { useEffect, useState } from 'react';
import { Modal, InputGroup, Button, FormControl, Form } from "react-bootstrap";
import validator from "validator";
import axios from 'axios';
import AuthService from '../../../_services/AuthService';


const NewMessage = (data) => {

    const [error, setError] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const [recipients, setRecipients] = useState(undefined);
    const [loading, setLoading] = useState(true);


    // handle form values
    const [messageBody, setMessageBody] = useState("");
    const [recipient, setRecipient] = useState("");
    const [subject, setSubject] = useState("");
    

    // Confirmation Modal
    const [showConfirm, setShowConfirm] = useState(false);
    const handleCloseConfirm = () => setShowConfirm(false);
    const handleShowConfirm = () => setShowConfirm(true);

    useEffect(() => {
        const fetchAvailableRecipients = async () => {
            try {
                const response = await axios.get("http://localhost:1337/getAvailableRecipients/?userid="+ data.user );
                setRecipients(response.data);
                setLoading(false);
        
            } catch (error) {
                setError(error.message);
            } finally {
        
            }
        }
        fetchAvailableRecipients();
    }, []);


    // after form submit validating the form data using validator
    const submitFormData = (e) => {
        e.preventDefault();
        console.log(e);

        //if (validator.isNumeric(bidValue) && (parseInt(bidValue) <= parseInt(data.data.BUY_PRICE))) {
        //    setError(false);
        //    //console.log(bidValue);
        //    //console.log(data.data.AUCTIONS);
        //    //console.log(currentUser.data[0].USERID);
        //
        //    const auctionid = data.data.AUCTIONS;
        //    const bidder = currentUser.data[0].USERID;
        //    const amount = bidValue;
        //    try {
        //
        //        const response = axios.post("http://localhost:1337/setAuctionBids", {
        //            auctionid,
        //            bidder,
        //            amount
        //        })
        //            .then(response => {
        //                window.location.reload();
        //            });
        //
        //    } catch (error) {
        //        setError(error.message);
        //    } finally {
        //
        //    }
        //
        //} else if (validator.isEmpty(bidValue)) {
        //    setError(true);
        //    setErrorMessage("Η Προσφορά είναι υποχρεωτικό πεδίο!");
        //} else if (!validator.isNumeric(bidValue)) {
        //    setError(true);
        //    setErrorMessage("Άκυρη τιμή πεδίου!");
        if (validator.isEmpty(recipient)) {
            setError(true);
            setErrorMessage("Ο Λήπτης είναι υποχρεωτικό πεδίο! ");
        }
        else if (validator.isEmpty(subject)) {
            setError(true);
            setErrorMessage("Το Θέμα μηνύματος είναι υποχρεωτικό πεδίο! ");
        }
        else if (validator.isEmpty(messageBody)) {
            setError(true);
            setErrorMessage("Το Σώμα μηνύματος είναι υποχρεωτικό πεδίο! ");
        }
        else {
            setError(false);
            try {
        
                const response = axios.post("http://localhost:1337/setMessage", {
                    creator: data.user,
                    recipient,
                    subject,
                    message_body:messageBody
                })
                    .then(response => {
                        window.location.reload();
                    });
        
            } catch (error) {
                setError(error.message);
            } finally {
        
            }
        
        }
    };

    //console.log(data);
    //console.log(recipient);
    //console.log(subject);
    //console.log(messageBody);

    return (
    <div>
        { data ? (
            <div>
                <Form onSubmit={submitFormData}>


                        <Form.Group className="mb-3" >

                            <Form.Label >Επιλογή Λήπτη</Form.Label>
                            <Form.Select aria-label="Default select example" style={{ marginBottom: "20px" }} onChange={e => setRecipient(e.target.value)}>
                                <option></option>
                                {!loading && recipients.data.map((e, RECIPIENTS) => {
                                    return <option key={RECIPIENTS} value={e.RECIPIENT}>{e.USERNAME}</option>;
                                })}
                            </Form.Select>
                            
                            <InputGroup className="mb-3" onChange={e => setSubject(e.target.value)}>
                                <InputGroup.Text id="basic-addon3" >
                                    Θέμα
                                </InputGroup.Text>
                                <Form.Control id="basic-url" aria-describedby="basic-addon3" />
                            </InputGroup>


                            <InputGroup className="mb-3" onChange={e => setMessageBody(e.target.value)}>
                                <InputGroup >
                                    <Form.Control as="textarea" aria-label="With textarea" />
                                </InputGroup>
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
                        Αποστολή μηνύματος
                    </Button>

                </Form>
            </div>
            ) : (
                    <div>
                    </div>
                    )}
            </div>
    );
};

export default NewMessage;
