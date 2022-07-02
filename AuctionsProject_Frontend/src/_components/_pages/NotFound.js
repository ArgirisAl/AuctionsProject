import React, { useState } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Alert } from "react-bootstrap";


export default function Notfound() {


    return (
        <div>
            <Alert >
                <Alert.Link href="/"> Page Not Found </Alert.Link>.
            </Alert>
        </div>
    )
}
