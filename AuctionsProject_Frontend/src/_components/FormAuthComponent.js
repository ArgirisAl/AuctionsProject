import React, { Component, useState, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormGroup, FormControl, ControlLabel, Form, Row, Col } from "react-bootstrap";
import AuthService from '../_services/AuthService';
import Login from "./LoginComponent";
import Register from "./RegisterComponent";


export default function AuthForm() {
    const [login, setLogin] = useState()
    console.log(login)

    return (
        <div>
            {!login ? (
                <div>
                    <div
                        className='App d-flex flex-column align-items-center'
                        style={{
                            width: '360px',
                            padding: '8 % 0 0',
                            margin: 'auto',
                            fontFamily: 'Comfortaa, cursive'
                        }}
                    >
                        <h1>Welcome to Auction Project!</h1>
                    <Login />
                    <Button
                        type='button'
                        variant="link"
                        style={{
                            marginLeft: '0px',
                            marginTop: '-100px',
                            marginBottom: '10px'
                        }}
                        onClick={() => setLogin(true)}
                    >Register
                        </Button>
                    </div>
                </div>
            ) : (
                    <div>
                        <div
                            className='App d-flex flex-column align-items-center'
                            style={{
                                width: '360px',
                                padding: '8 % 0 0',
                                margin: 'auto',
                                fontFamily: 'Comfortaa, cursive'
                            }}
                        >
                            <h1>Welcome to Auction Project!</h1>
                        <Register />
                        <Button
                            type='button'
                            variant="link"
                            style={{
                                marginLeft: '0px',
                                marginTop: '-100px',
                                marginBottom: '10px'
                            }}
                            onClick={() => setLogin(false)
                            }>
                            Login
                            </Button>
                        </div>
                </div>
            )}
        </div>
    )
}
