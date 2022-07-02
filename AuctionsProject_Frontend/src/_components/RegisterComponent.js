import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormControl, Form, Row, Col, InputGroup, Alert } from "react-bootstrap";
import AuthService from '../_services/AuthService';
import validator from "validator";
import axios from 'axios';


import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";


export default function Register() {


    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [form, setForm] = useState({});
    const [message, setMessage] = useState();
    const [successful, setSuccessful] = useState();
    const [data, setData] = useState(null);

    const [errors, setErrors] = useState({})
    const [error, setError] = useState("");
    

    const center = {
        lat: 37.97980251076412,
        lng: 23.736648559570316,
    }
    const [mPosition, setMPosition] = useState(center);

    function DraggableMarker() {
        const [draggable, setDraggable] = useState(false)
        const [position, setPosition] = useState(center)
        const markerRef = useRef(null)

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        setPosition(marker.getLatLng())
                        setMPosition({ position })
                    }
                },
            }),
            [],
        )
        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d)
        }, [])

        //console.log({ position });

        //console.log({ mPosition });
        return (
            <Marker
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>
                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable
                            ? 'Αλλαγή τοποθεσίας!'
                            : 'Πατήστε για αλλαγή τοποθεσίας!'}
                    </span>
                </Popup>
            </Marker>
        )
    }

    const setField = (field, value) => {
        setForm({
            ...form,
            [field]: value
        })
        // Check and see if errors exist, and remove them from the error object:
        if (!!errors[field]) setErrors({
            ...errors,
            [field]: null
        })
    }


    useEffect(() => {

        const fetchCountries = async () => {
            try {
                const response = await axios.get("http://localhost:1337/getCountries");
                setData(response.data);
                setLoading(true);
                
            } catch (error) {
                setError(error.message);
            } finally {

            }
        }
        fetchCountries();

    }, []);

    
    const handleSubmit = e => {

        e.preventDefault()
        // get our new errors
        const newErrors = findFormErrors()
        // Conditional logic:
        console.log(Object.keys(newErrors));
        if (Object.keys(newErrors).length > 0) {
            // We got errors!
            setErrors(newErrors);
            window.scrollTo(0, 0)
        } else {
            const {
                username,
                password,
                firstname,
                lastname,
                email,
                phone01,
                phone02,
                country,
                city,
                district,
                address,
                zip,
                afm,
                image
            } = form


            AuthService.register(
                username,
                password,
                firstname,
                lastname,
                email,
                phone01,
                phone02,
                country,
                city,
                district,
                address,
                mPosition.lat,
                mPosition.lng,
                zip,
                afm,
                image
            ).then(
                response => {
                    console.log(response);
                    setMessage("Ευχαριστούμε για την εγγραφή " + firstname +". Αναμένεται ενεργοποίηση από τον διαχειριστή της σελίδας. ");
                    setSuccessful(true);
                },
                error => {
                    console.log(error);
                    const resMessage =
                        (error.response &&
                            error.response.data ||
                            error.response.data.message) ||
                        error.message ||
                        error.toString();
                    setError(resMessage);
                    setSuccessful(false);

                }
            );
        }
    }
    const findFormErrors = () => {
        const {
            username,
            password,
            comf_password,
            firstname,
            lastname,
            email,
            phone01,
            phone02,
            country,
            city,
            district,
            address,
            zip,
            afm,
            image,
            terms
        } = form
        const newErrors = {}
        //console.log(firstname);
        // firstname errors
        if (!firstname || firstname === '') newErrors.firstname = 'Το Όνομα είναι υποχρεωτικό πεδίο!'; 

        // lastname errors
        if (!lastname || lastname === '') newErrors.lastname = 'Το Επώνυμο είναι υποχρεωτικό πεδίο!'

        // username errors
        if (!username || username === '') newErrors.username = 'Το Όνομα Χρήστη είναι υποχρεωτικό πεδίο!'

        // password errors
        if (!password || password === '') newErrors.password = 'Ο Κωδικός είναι υποχρεωτικό πεδίο!'

        // comf_password errors
        if (!comf_password || comf_password === '') newErrors.comf_password = 'Η Επιβεβαίωση Κωδικού είναι υποχρεωτικό πεδίο!'
        else if (comf_password != password) newErrors.comf_password = 'Έχετε πληκτρολογίσει λάθος Επιβεβαίωση Κωδικού!'

        // email errors
        if (!email || email === '') newErrors.email = 'Το E-mail είναι υποχρεωτικό πεδίο!'
        else if (!validator.isEmail(email)) newErrors.email = 'Μη έγκυρό E-mail!'

        // phone01 errors
        if (!phone01 || phone01 === '') newErrors.phone01 = 'Το Τηλέφωνο 1 είναι υποχρεωτικό πεδίο!'
        else if (!validator.isMobilePhone(phone01)) newErrors.phone01 = 'Λάθος τηλέφωνο'

        // address errors
        if (!address || address === '') newErrors.address = 'Η Διεύθυνση είναι υποχρεωτικό πεδίο!'

        // country errors
        if (!country || country === '') newErrors.country = 'Η Χώρα είναι υποχρεωτικό πεδίο!'

        // city errors
        if (!city || city === '') newErrors.city = 'Η Πόλη είναι υποχρεωτικό πεδίο!'

        // district errors
        if (!district || district === '') newErrors.district = 'Η Περιοχή είναι υποχρεωτικό πεδίο!'

        // zip errors
        if (!zip || zip === '') newErrors.zip = 'Ο Ταχυδρομικός Κώδικας είναι υποχρεωτικό πεδίο!'
        else if (!validator.isNumeric(zip)) newErrors.zip = 'Μη έγκυρός Ταχυδρομικός Κώδικας!'

        // image errors
        //if (!image || image === '') newErrors.image = 'cannot be blank!'

        // terms errors
        if (!terms || terms === '') newErrors.terms = 'Πρέπει να επιβεβαιώσετε!'

        //console.log(newErrors);
        return newErrors
    }

    return (
        <div>
            {loading ? (
            <div>
                {!successful && (
                    <div
                        className="container"
                        style={{
                            margin: '0 auto 100px',
                            padding: '45px',
                            height: '100%',
                            overflow: 'hidden'
                        }}
                    >
                            <Form onSubmit={handleSubmit}>
                            <Row className="mb-2">

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Όνομα</Form.Label>
                                    <Form.Control
                                            //required
                                            type="text"
                                            placeholder="Όνομα"
                                            onChange={e => setField('firstname', e.target.value)}
                                            isInvalid={!!errors.firstname}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                            {errors.firstname}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group as={Col} md="6">
                                    <Form.Label>Επώνυμο</Form.Label>
                                    <Form.Control
                                        //required
                                        type="text"
                                        placeholder="Επώνυμο"
                                        onChange={e => setField('lastname', e.target.value)}
                                        isInvalid={!!errors.lastname}
                                    />
                                        <Form.Control.Feedback type="valid">Φαίνεται καλό!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.lastname}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>


                            <Row className="mb-1">
                                <Form.Group as={Col} md="15">

                                    <Form.Label>E-mail</Form.Label>
                                    <InputGroup className="mb-1">
                                        <FormControl
                                            id="email"
                                            type="text"
                                            placeholder="email"
                                            //required
                                                onChange={e => setField('email', e.target.value)}
                                                isInvalid={!!errors.email}
                                            />
                                            <Form.Control.Feedback type="invalid">
                                                {errors.email}
                                            </Form.Control.Feedback>
                                    </InputGroup>
                                </Form.Group>
                            </Row>


                            <Row className="mb-2">

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Χώρα</Form.Label>
                                    <Form.Control
                                        as="select"
                                        //required
                                        type="text"
                                        placeholder="Χώρα"
                                        onChange={e => setField('country', e.target.value)}
                                        isInvalid={!!errors.country}
                                    >
                                        <option className="d-none" value="">
                                            Επιλογή Χώρας
                                        </option>

                                            {data.data && data.data.map((e, COUNTRIES) => {
                                                return <option key={COUNTRIES} value={e.COUNTRIES}>{e.NAME}</option>;
                                            })}

                                    </Form.Control>
                                    <Form.Control.Feedback>Φαίνεται καλό!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                            {errors.country}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group as={Col} md="6">
                                    <Form.Label>Πόλη</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Πόλη"
                                        //required
                                        onChange={e => setField('city', e.target.value)}
                                        isInvalid={!!errors.city}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                            {errors.city}
                                    </Form.Control.Feedback>
                                </Form.Group>
                            </Row>



                            <Row className="mb-3">

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Διεύθυνση</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Διεύθυνση"
                                        //required
                                        onChange={e => setField('address', e.target.value)}
                                        isInvalid={!!errors.address}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                            {errors.address}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="3">
                                    <Form.Label>Περιοχή</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Περιοχή"
                                        //required
                                        onChange={e => setField('district', e.target.value)}
                                        isInvalid={!!errors.district}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                            {errors.district}
                                    </Form.Control.Feedback>
                                </Form.Group>




                                <Form.Group as={Col} md="3">
                                    <Form.Label>Ταχυδρομικός Κώδικας</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Τ.Κ"
                                        //required
                                        onChange={e => setField('zip', e.target.value)}
                                        isInvalid={!!errors.zip}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                            {errors.zip}
                                    </Form.Control.Feedback>
                                </Form.Group>

                            </Row>

                            <Row className="mb-2">

                                <Form.Group as={Col} md="6">
                                    <Form.Label>Τηλέφωνο 1</Form.Label>
                                    <Form.Control
                                        //required
                                        type="text"
                                        placeholder="Τηλέφωνο 1"
                                        onChange={e => setField('phone01', e.target.value)}
                                        isInvalid={!!errors.phone01}
                                    />
                                    <Form.Control.Feedback>Φαίνεται καλό!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                            {errors.phone01}
                                    </Form.Control.Feedback>
                                </Form.Group>


                                <Form.Group as={Col} md="6">
                                    <Form.Label>Τηλέφωνο 2</Form.Label>
                                    <Form.Control
                                        type="text"
                                        placeholder="Τηλέφωνο 2"
                                        onChange={e => setField('phone02', e.target.value)}
                                        isInvalid={!!errors.phone02}
                                    />
                                </Form.Group>
                            </Row>


                            <Row className="mb-4">

                                <Form.Group as={Col} md="3">
                                    <Form.Label>Όνομα Χρήστη</Form.Label>
                                    <Form.Control
                                        //required
                                        type="username"
                                        placeholder="Όνομα Χρήστη"
                                        onChange={e => setField('username', e.target.value)}
                                        isInvalid={!!errors.username}
                                    />
                                    <Form.Control.Feedback>Φαίνεται καλό!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                            {errors.username}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="3">
                                    <Form.Label>Κωδικός</Form.Label>
                                    <Form.Control
                                        //required
                                        type="password"
                                        placeholder="Κωδικός"
                                        onChange={e => setField('password', e.target.value)}
                                        isInvalid={!!errors.password}
                                    />
                                    <Form.Control.Feedback>Φαίνεται καλό!</Form.Control.Feedback>
                                    <Form.Control.Feedback type="invalid">
                                            {errors.password}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Form.Group as={Col} md="3">
                                    <Form.Label>Επιβεβαίωση Κωδικού</Form.Label>
                                    <Form.Control
                                            //required
                                            type="password"
                                            placeholder="Επιβεβαίωση Κωδικού"
                                            onChange={e => setField('comf_password', e.target.value)}
                                            isInvalid={!!errors.comf_password}
                                    />
                                    <Form.Control.Feedback>Φαίνεται καλό!</Form.Control.Feedback>
                                        <Form.Control.Feedback type="invalid">
                                            {errors.comf_password}
                                        </Form.Control.Feedback>
                                </Form.Group>


                            </Row>


                                <Form.Group className="mb-3">
                                    <Form.Label>Φωτογραφία</Form.Label>
                                    <Form.Control
                                        type="file"
                                        placeholder="image"
                                        //required
                                        onChange={e => setField('image', e.target.value)}
                                        isInvalid={!!errors.image}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        Παρακαλώ επιλέξτε αρχείο!
                                    </Form.Control.Feedback>
                                </Form.Group>



                                {/*
                                <Form.Label>Επιλογή Τοποθεσίας</Form.Label>
                                <MapContainer
                                    className="markercluster-map"
                                    center={center}
                                    zoom={15}
                                    maxZoom={18}
                                    style={{ width: "100%", height: "80vh" }}

                                >
                                    <TileLayer
                                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                                    />
                                    <DraggableMarker />
                                </MapContainer>



                                */}

                                <Form.Group
                                    className="mb-1"
                                    style={{
                                        margin: '5px',
                                        padding: '5px',
                                    }}
                                >
                                    <Form.Check
                                        //required
                                        label="Όροι και προϋποθέσεις"
                                        //feedback="Πρέπει να επιβεβαιώσετε!"
                                        //feedbackType="invalid"
                                        onChange={e => setField('terms', e.target.value)}
                                        isInvalid={!!errors.terms}
                                    />
                                    <Form.Control.Feedback type="invalid">
                                        {errors.terms}
                                    </Form.Control.Feedback>
                                </Form.Group>

                                <Button type="submit" >Εγγραφή</Button>

                                {error && (
                                        <div className={"alert alert-danger"} role="alert" >{error}</div>
                                )}

                        </Form>
                    </div>
                )}
                {message && (
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
                                <Alert.Link href="/"> Αρχική Σελίδα!</Alert.Link>.
                            </Alert>

                        </div>
                    </div>
                )}
                </div>
            ) : (
                <div>
                    loading...
                </div>
            )}
        </div>
    )
}

