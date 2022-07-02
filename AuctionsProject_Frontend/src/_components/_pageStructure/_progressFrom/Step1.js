import React, { useEffect, useState, useMemo } from 'react';
import { Form, Button } from "react-bootstrap";
import validator from "validator";
import { MultiSelect } from "react-multi-select-component";
import axios from 'axios';


const options = [
    { label: "Cat1", value: "Cat1" },
    { label: "Cat2", value: "Cat2" },
    { label: "Cat3", value: "Cat3" },
];

const data = [{ value: 'One', selected: true }, { value: 'Two' }, { value: 'Three' }]


// creating functional component ans getting props from app.js and destucturing them
const Step1 = ({ nextStep, handleFormData, values }) => {
    //creating error state for validation
    const [error, setError] = useState(false);
    const [selected, setSelected] = useState([]);
    const [categories, setCategories] = useState([]);

    useEffect(() => {

        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:1337/getCategories");


                //setCategories(response.data.data);
                //setCategories(oldArray => [...oldArray, { "CATEGORIES": 0, "NAME": 'Επιλογή κατηγορίας' }]);

                setCategories(response.data.data);
                setCategories(oldArray => [...oldArray, { "CATEGORIES": 0, "NAME": 'Καμία Κατηγορία' }]);
            } catch (error) {
                setError(error.message);
            } finally {

            }
        }
        fetchCategories();

    }, []);


    // after form submit validating the form data using validator
    const submitFormData = (e) => {
        e.preventDefault();

        // checking if value of first name and last name is empty show error else take to step 2
        if (
            values.categories.length <= 0
        ) {
            setError(true);
        } else {
            nextStep();
        }
    };


    return (
        <div>
            <Form onSubmit={submitFormData}>
                <Form.Group className="mb-3">
                    <Form.Label>Κατηγορία</Form.Label>
                    <Form.Control as="select" multiple value={values.categories} onChange={handleFormData("categories")}>
                        {categories && categories.map((e, CATEGORIES) => {

                            return <option key={CATEGORIES} value={e.CATEGORIES}>{e.NAME}</option>;
                        })}
                    </Form.Control>
                    {error ? (
                        <Form.Text style={{ color: "red" }}>
                            Η "Κατηγορία" είναι υποχρεωτικό πεδίο!
                        </Form.Text>
                    ) : (
                        ""
                    )}
                </Form.Group>

                <Button variant="primary" type="submit">
                    Επόμενο
                </Button>

            </Form>
        </div>
    );
};

export default Step1;
