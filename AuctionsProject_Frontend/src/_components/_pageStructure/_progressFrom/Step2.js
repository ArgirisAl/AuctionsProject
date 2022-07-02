import React, { useState } from "react";
import { Form, Card, Button } from "react-bootstrap";
import validator from "validator";

// creating functional component ans getting props from app.js and destucturing them
const Step2 = ({ nextStep, handleFormData, prevStep, values }) => {
    //creating error state for validation
    const [error, setError] = useState(false);

    // after form submit validating the form data using validator
    const submitFormData = (e) => {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to next step
        if (!validator.isCurrency(values.buy_price) || !validator.isCurrency(values.first_bid)) {
            setError(true);
        } else {
            nextStep();
        }
    };


    return (
        <>
            <Form onSubmit={submitFormData}>
                <Form.Group className="mb-3">
                    <Form.Label>Άμεση Τιμή Αγοράς</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="text"
                        placeholder="Άμεση Τιμή Αγοράς"
                        onChange={handleFormData("buy_price")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>


                <Form.Group className="mb-3">
                    <Form.Label>Ελάχιστη πρώτη προσφορά</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="text"
                        placeholder="Ελάχιστη πρώτη προσφορά"
                        onChange={handleFormData("first_bid")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            Η "Ελάχιστη πρώτη προσφορά" είναι υποχρεωτικό πεδίο!
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>



                <div style={{ display: "flex", justifyContent: "space-around" }}>
                    <Button variant="primary" onClick={prevStep}>
                        Προηγούμενο
                    </Button>

                    <Button variant="primary" type="submit">
                        Επόμενο
                    </Button>
                </div>
            </Form>
        </>
    );
};

export default Step2;
