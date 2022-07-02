import React, { useEffect, useState, useMemo } from 'react';
import { Form, Card, Button } from "react-bootstrap";
import validator from "validator";





// creating functional component ans getting props from app.js and destucturing them
const Step4 = ({ nextStep, handleFormData, prevStep, values }) => {

    //creating error state for validation
    const [error, setError] = useState(false);


    // after form submit validating the form data using validator
    const submitFormData = (e) => {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to next step
        if (values.started > values.ends || validator.isEmpty(values.started) || validator.isEmpty(values.started)  ) {
            setError(true);
        } else {
            nextStep();
        }
    };


    return (
        <>

            <Form onSubmit={submitFormData}>

                <Form.Group className="mb-3">
                    <Form.Label>Από</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="date"
                        placeholder="Από"
                        onChange={handleFormData("started")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            Η ημερομηνία "Από" είναι υποχρεωτικό πεδίο!
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Μέχρι</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="date"
                        placeholder="Μέχρι"
                        onChange={handleFormData("ends")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            Η ημερομηνία "Μέχρι" είναι υποχρεωτικό πεδίο!
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Σύντομη Περιγραφή</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        type="text"
                        placeholder="Σύντομη Περιγραφή"
                        onChange={handleFormData("name")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            Η "περιγραφή" είναι υποχρεωτικό πεδίο!
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Περιγραφή</Form.Label>
                    <Form.Control
                        style={{ border: error ? "2px solid red" : "" }}
                        
                        as="textarea"
                        rows={10}
                        placeholder="Περιγραφή"
                        onChange={handleFormData("description")}
                    />
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            Η "περιγραφή" είναι υποχρεωτικό πεδίο!
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

export default Step4;
