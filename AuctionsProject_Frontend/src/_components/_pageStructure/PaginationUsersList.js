import React, { useEffect, useState, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, ListGroup, Modal, Button } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function UsersList(props) {
    const navigate = useNavigate();
    const [locateLine, setLocateLine] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);


    const [showActivate, setShowActivate] = useState(false);
    const handleCloseActivate = () => setShowActivate(false);
    const handleShowActivate = () => setShowActivate(true);
    const activateUser = (user) => {

        try {
            const userid = user.USERID;
            const response = axios.post("http://localhost:1337/activateUser/?userid=", {
                userid
            })
                .then(response => {
                    setData(response.data);
                    setLoading(true);
                    window.location.reload();
                });

        } catch (error) {
            setError(error.message);
        } finally {

        }
    };

    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    const deleteUser = (user) => {

        try {
            const userid = user.USERID;
            const response =axios.post("http://localhost:1337/deleteUser/?userid=", {
                userid
            })
            .then(response => {
                setData(response.data);
                setLoading(true);
                window.location.reload();
            });


            //const response = axios.post("http://localhost:1337/deleteUser/?userid=" + user.USERID);
            //setData(response.data);
            //setLoading(true);

        } catch (error) {
            setError(error.message);
        } finally {

        }
    };

    const redirUserProfile = (user) => {navigate({pathname: '/profile/' + user.USERID,replace: true});  };

    if (props.loading) {
        return <h2>Loading...</h2>
    }

    const Popup = props => {
        return (
            <div className="popup-box">
                <div className="box">
                    <span className="close-icon" onClick={props.handleClose}>x</span>
                    {props.content}
                </div>
            </div>
        );
    };

    //The UI for the UsersList to be shown
    const UsersList = (props) => {
        //destrcture the props
        const {
            ADDRESS,
            AFM,
            CITY,
            COUNTRY,
            DISTRICT,
            EMAIL,
            FIRSTNAME,
            INSDATE,
            LASTNAME,
            PHONE01,
            PHONE02,
            //roles
            USERID,
            USERNAME,
            ZIP,
            ISACTIVE
        } = props.data
        //console.log(props.data);
        return (
            <div>
                <Card style={{ margin: '5px' }}>
                    <Card.Header style={{ margin: '5px' }}>{FIRSTNAME} {LASTNAME}</Card.Header>
                    <Card.Body>
                        <Card.Title>Special title treatment</Card.Title>
                        <Card.Text>
                            With supporting text below as a natural lead-in to additional content.
                        </Card.Text>


                        <div style={{ display: 'flex' }}>

                            <Button style={{ margin: '5px' }} size="sm" variant="primary" onClick={() => { redirUserProfile(props.data); }} >Προφίλ</Button>
                            <Button style={{ margin: '5px' }} size="sm" variant="danger" onClick={() => { handleShowDelete(); setLocateLine(props.data); }} >Διαγραφή</Button>
              
                            {locateLine && (
                                <Modal
                                    size="sm"
                                    show={showDelete}
                                    onHide={handleCloseDelete}
                                >

                                    <Modal.Header closeButton>
                                        <Modal.Title>a</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>{locateLine.USERID}</Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={handleCloseDelete}>
                                            Close
                                        </Button>
                                        <Button variant="primary" onClick={() => { handleCloseDelete(); deleteUser(locateLine); }}>
                                            Save Changes
                                        </Button>
                                    </Modal.Footer>
                                </Modal>
                            )}

                            {!ISACTIVE && (
                                <div>
                                    <Button style={{ margin: '5px' }} size="sm" variant="warning" onClick={() => { handleShowActivate(); setLocateLine(props.data); }} >Ενεργοποίηση Χρήστη</Button>
                                    {locateLine && (
                                        <Modal
                                            size="sm"
                                            show={showActivate}
                                            onHide={handleCloseActivate}
                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>{locateLine.USERID }</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>Woohoo, you're reading this text in a modal!</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseActivate}>
                                                    Close
                                                </Button>
                                                <Button variant="primary" onClick={() => { handleCloseActivate(); activateUser(locateLine); }}>
                                                    Save Changes
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                    )}
                                </div>
                            )}




                        </div>
                    </Card.Body>
                </Card>
            </div>
        )
    }



    //console.log(props.allUsers);
    return (

        <div className="list-group mb-3">
            {props.posts.length > 0 ? (
                <div>
                    {props.allUsers ? (
                        <div>
                            {props.posts.length > 0 ? props.posts.map(post =>
                                <div>
                                    <UsersList key={post.USERID} data={post} />
                                </div>
                            ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]}
                        </div>
                    ) : (
                            <div>
                                {props.posts.filter(user => user.ISACTIVE == 0).length > 0 ? props.posts.filter(user => user.ISACTIVE == 0).map(filteredUsers => 
                                    <UsersList key={filteredUsers.USERID} data={filteredUsers}  />
                                
                                ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]}
                            </div>
                    )}
                </div>
            ) : (
                <div>
                    <p>Loading...</p>
                </div>
            )}
        </div>
    )
}
