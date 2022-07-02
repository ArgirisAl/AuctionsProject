import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert, FormGroup, FormControl, ControlLabel, Form, Row, Col } from "react-bootstrap";


export default function PendingPage() {


    return (
        <div>
            <Alert >
                This is a success alert with{' '}
                <Alert.Link href="#">an example link</Alert.Link>. Give it a click if you
                like.
            </Alert>
        </div>
    )
}
