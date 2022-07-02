import React, { useEffect, useState, createContext, useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Modal, Button, FormControl, Form, Alert } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import validator from "validator";
import AuthService from '../../_services/AuthService';
import AuctionBidModal from './_modal/ModalAuctionBid'
import auction_image from '../_images/blank_auction_image.jpg';


export default function ListMessages(props) {


    const navigate = useNavigate();
    const [locateLine, setLocateLine] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [currentUser, setCurrentUser] = useState(undefined);


    // Button Delete
    const [showDelete, setShowDelete] = useState(false);
    const handleCloseDelete = () => setShowDelete(false);
    const handleShowDelete = () => setShowDelete(true);
    const deleteUser = (user) => {

        try {
            //const auctionid = user.AUCTIONS;
            //const response = axios.post("http://localhost:1337/updateAuction", null, { params: {
            //        auctionid,
            //        isstarted: 0
            //    }})
            //    .then(response => {
            //        setData(response.data);
            //        setLoading(true);
            //        window.location.reload();
            //    });


        } catch (error) {
            setError(error.message);
        } finally {

        }
    };


    // Button Preview
    const [showPreview, setShowPreview] = useState(false);
    const handleClosePreview = () => setShowPreview(false);
    const handleShowPreview = () => setShowPreview(true);
    const readMessage = (message) => {
        console.log(message);
        try {
            const messageid = message.MESSAGES;
            const response = axios.post("http://localhost:1337/setReadMessage", {
                messageid,
                isread: 1
            })
                .then(response => {
                    //window.location.reload();
                });
        } catch (error) {
            setError(error.message);
        } finally {

        }
    };


    // Button Redirect
    const redirUserProfile = (auction) => { navigate({ pathname: '/auction/' + auction.AUCTIONS, replace: true }); };

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user) {
                    setCurrentUser(AuthService.getCurrentUser());
                }
            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchUser();

    }, []);




    if (props.loading) {
        return <h2>Loading...</h2>
    }



    //The UI for the UsersList to be shown
    const ListMessages = (props) => {
        //destrcture the props
        const {
            MESSAGES,
            CHILD_MESSAGES,
            EXPIRE_DATE,
            ISREAD,
            MESSAGE_BODY,
            CREATE_DATE,
            SUBJECT,

            CREATOR,
            CREATOR_ADDRESS,
            CREATOR_CITY,
            CREATOR_COUNTRY,
            CREATOR_COUNTRY_NAME,
            CREATOR_DISTRICT,
            CREATOR_EMAIL,
            CREATOR_FIRSTNAME,
            CREATOR_IMAGE,
            CREATOR_LASTNAME,
            CREATOR_PHONE01,
            CREATOR_PHONE02,
            CREATOR_USERNAME,

            RECIPIENT,
            RECIPIENT_ADDRESS,
            RECIPIENT_CITY,
            RECIPIENT_COUNTRY,
            RECIPIENT_COUNTRY_NAME,
            RECIPIENT_DISTRICT,
            RECIPIENT_EMAIL,
            RECIPIENT_FIRSTNAME,
            RECIPIENT_IMAGE,
            RECIPIENT_LASTNAME,
            RECIPIENT_PHONE01,
            RECIPIENT_PHONE02,
            RECIPIENT_USERNAME

        } = props.data
        console.log(props);
        return (
            <div>
                {currentUser ? (
                    <Container>



                        { /************************************ INBOX *******************************************/}
                        {props.inbox && (
                            <div>
                        <Alert variant="success">
                                    <Alert.Heading>Από : {CREATOR_USERNAME}</Alert.Heading>
                                    <Alert.Heading>Θέμα : {SUBJECT}</Alert.Heading>
                            <p>
                                        {MESSAGE_BODY}
                            </p>
                            <hr />
                            <p className="mb-0">
                                {true && (
                                    <div>
                                        <Button style={{ margin: '5px' }} size="sm" variant="outline-danger" onClick={() => { handleShowDelete(); setLocateLine(props.data); }} >Διαγραφή</Button>
                                        <Button style={{ margin: '5px' }} size="sm" variant="outline-primary" onClick={() => { handleShowPreview(); setLocateLine(props.data); readMessage(props.data); }} >Προβολή</Button>
    
    
                                        {locateLine && (
                                            <Modal
                                                size="lg"
                                                show={showDelete}
                                                onHide={handleCloseDelete}
                                            >
    
                                                <Modal.Header closeButton>
                                                    <Modal.Title>a</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>{locateLine.SUBJECT}</Modal.Body>
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
    
    
    
                                        {locateLine && (
                                                    <Modal
                                                        size="lg"
                                                        show={showPreview}
                                                        onHide={handleClosePreview}
                                                    >

                                                        <Modal.Header closeButton>
                                                            <Modal.Title>
                                                                Προς :{CREATOR_USERNAME}
                                                                <br />
                                                                Ημερομηνία : {CREATE_DATE}
                                                                <br />
                                                                Θέμα : {SUBJECT}
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            {MESSAGE_BODY}

                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="primary" onClick={() => { handleClosePreview(); }}>
                                                                OK
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                        )}
                                    </div>
    
                                )}
                            </p>
                                </Alert>
                            </div>
                        )}
                        { /************************************ END INBOX *******************************************/}

                        { /************************************ OUTGOING *******************************************/}
                        {props.outgoing && (
                            <div>
                                <Alert variant="success">
                                    <Alert.Heading>Προς : {RECIPIENT_USERNAME}</Alert.Heading>
                                    <Alert.Heading>Θέμα : {SUBJECT}</Alert.Heading>

                                    <p>
                                        {MESSAGE_BODY}
                                    </p>
                                    <hr />
                                    <p className="mb-0">
                                        {true && (
                                            <div>
                                                <Button style={{ margin: '5px' }} size="sm" variant="outline-danger" onClick={() => { handleShowDelete(); setLocateLine(props.data); }} >Διαγραφή</Button>
                                                <Button style={{ margin: '5px' }} size="sm" variant="outline-primary" onClick={() => { handleShowPreview(); setLocateLine(props.data); }} >Προβολή</Button>


                                                {locateLine && (
                                                    <Modal
                                                        size="lg"
                                                        show={showDelete}
                                                        onHide={handleCloseDelete}
                                                    >

                                                        <Modal.Header closeButton>
                                                            <Modal.Title>a</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>{locateLine.SUBJECT}</Modal.Body>
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



                                                {locateLine && (
                                                    <Modal
                                                        size="lg"
                                                        show={showPreview}
                                                        onHide={handleClosePreview}
                                                    >

                                                        <Modal.Header closeButton>
                                                            <Modal.Title>
                                                                Προς :{RECIPIENT_USERNAME}
                                                                <br />
                                                                Ημερομηνία : {CREATE_DATE}
                                                                <br />
                                                                Θέμα : {SUBJECT}
                                                                <br />
                                                                Διαβάστηκε : {ISREAD == null || ISREAD == 0 ? 'Όχι' : 'Ναι'}
                                                            </Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            {MESSAGE_BODY}

                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="primary" onClick={() => { handleClosePreview(); }}>
                                                                OK
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                )}
                                            </div>

                                        )}
                                    </p>
                                </Alert>
                            </div>
                        )}
                        { /************************************ END OUTGOING *******************************************/}


                    </Container>
                ) : (
                    <div>
                        <Card style={{ margin: '5px' }}>
                                <Card.Header style={{ margin: '5px' }}>{SUBJECT}</Card.Header>
                            <Card.Body>
                                    <Card.Title>{SUBJECT}</Card.Title>
                                <Card.Text>
                                    With supporting text below as a natural lead-in to additional content.
                                </Card.Text>
                            </Card.Body>
                        </Card>
                    </div>
                )}
            </div>
        )
    
    }


    //console.log(props);
    //console.log(currentUser);
    //console.log(props.messages.filter(messages => messages.CREATOR == 4));


    return (

        <div className="list-group mb-3">

            {props.messages.length > 0 && currentUser ? (
                <div>

                    {props.inbox && (
                        <div>
                            {props.messages.filter(messages => messages.RECIPIENT == currentUser.data[0].USERID).length > 0 ? props.messages.filter(messages => messages.RECIPIENT == currentUser.data[0].USERID).map(filteredOutgoingMessages =>
                                <ListMessages key={filteredOutgoingMessages.MESSAGES} data={filteredOutgoingMessages} inbox={props.inbox} />

                            ) : (
                                <div>

                                </div>
                            )}
                        </div>
                    )}


                    {props.outgoing && (
                        <div>
                            {props.messages.filter(messages => messages.CREATOR == currentUser.data[0].USERID).length > 0 ? props.messages.filter(messages => messages.CREATOR == currentUser.data[0].USERID).map(filteredOutgoingMessages =>
                                <ListMessages key={filteredOutgoingMessages.MESSAGES} data={filteredOutgoingMessages} outgoing={props.outgoing} />

                            ) : (
                                <div>

                                </div>
                            )}
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
