import React, { Component, useState, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormGroup, FormControl, ControlLabel, Form, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import AuthService from '../_services/AuthService';

export default function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({})
    const [errors, setErrors] = useState({})
    const [message, setMessage] = useState()
    const [successful, setSuccessful] = useState()
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [error, setError] = useState("");


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

    const handleSubmit = e => {
        e.preventDefault()
        // get our new errors
        const newErrors = findFormErrors()
        // Conditional logic:
        if (Object.keys(newErrors).length > 0) {
            // We got errors!
            setErrors(newErrors)
        } else {
            const { username, password } = form
            // No errors! Put any logic here for the form submission!
            //alert('Thank you for your feedback!')
            AuthService.login(
                username,
                password
            ).then((data) => {

                console.log(data);

                if (!data.status) {
                    setMessage(data.error);
                    setSuccessful(false);
                }
                else {

                    if (data.data[0].ROLES.some(({ ROLE_NAME }) => ROLE_NAME === 'ROLE_ADMIN'))
                        navigate("/dashboard", { replace: true });
                    else
                        navigate("/home", { replace: true });
                    window.location.reload();
                }

            },
                error => {
                    const resMessage =
                        (error.response &&
                            error.response.data &&
                            error.response.data.message) ||
                        error.message ||
                        error.toString();

                    setMessage(resMessage);
                    setSuccessful(false);

                }
            );




        }
    }
    const findFormErrors = () => {
        const { username, password } = form
        const newErrors = {}
        // username errors
        if (!username || username === '') newErrors.username = 'cannot be blank!'
        else if (username.length > 30) newErrors.username = 'username is too long!'
        // password errors
        if (!password || password === '') newErrors.password = 'cannot be blank!'
        else if (password.length > 100) newErrors.password = 'comment is too long!'

        return newErrors
    }


    return (
        <div>
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
                        {message}
                    </div>
                </div>
            )}
            {!successful && (
                <div className="container">
                    <Form
                        style={{
                            width: 'auto',
                            position: 'relative',
                            zIndex: '1',
                            background: '#FFFFFF',
                            borderRadius: '10px',
                            maxWidth: '360px',
                            margin: '0 auto 100px',
                            padding: '45px',
                            textAlign: 'center'
                        }}
                    >
                        <Form.Group>
                            <Form.Label
                                style={{
                                    outline: '0',
                                    width: '100%',
                                    border: '0',
                                    borderRadius: '5px',
                                    margin: '0 0 5px',
                                    padding: '5px',
                                    boxSizing: 'border-box',
                                    fontSize: '14px',
                                    fontFamily: 'Comfortaa, cursive'
                                }}
                            >
                                Username
                            </Form.Label>
                            <Form.Control
                                type='text'
                                onChange={e => setField('username', e.target.value)}
                                isInvalid={!!errors.username}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.username}</Form.Control.Feedback>
                        </Form.Group>

                        <Form.Group>
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type='password'
                                onChange={e => setField('password', e.target.value)}
                                isInvalid={!!errors.password}
                            />
                            <Form.Control.Feedback type='invalid'>{errors.password}</Form.Control.Feedback>
                        </Form.Group>

                        <Button type='submit' onClick={handleSubmit}>Είσοδος</Button>

                    </Form>
                </div>
            )}
        </div>
    )
}
