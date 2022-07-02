import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Button, Form, Nav, Tab, Row, Col, Alert, Modal, Navbar, Container, NavDropdown, FormControl } from "react-bootstrap";
import { Section } from 'mdb-react-ui-kit';
import * as Icon from 'react-bootstrap-icons';
import AuthService from '../_services/AuthService';
import ListMessages from './_pageStructure/ListMessagesComponent';
import NewMessage from './_pageStructure/_modal/ModalNewMessage';

export default function Messaging(props) {

    const [currentUser, setCurrentUser] = useState(undefined);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState(null);



    const [showNewMessage, setShowNewMessage] = useState(false);
    const handleCloseNewMessage = () => setShowNewMessage(false);
    const handleShowNewMessage = () => setShowNewMessage(true);


    //url :id
    let { id } = useParams();


    useEffect(() => {

        const fetchMessages = async () => {
            try {
                const response = await axios.get("http://localhost:1337/getMessages/?userid=" + id);
                setMessages(response.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
            } finally {
        
            }
        }
        fetchMessages();


        const fetchCurrentUser = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user)
                    setCurrentUser(user.data[0].USERID);

            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchCurrentUser();

    }, []);


    //console.log(currentUser);

    return (
        <div>
            {!loading && messages ? (
                <div >
                    {/*ToolBar*/}
                    <Navbar bg="light" expand="lg">
                        <Container fluid>
                            <Navbar.Brand href="#"></Navbar.Brand>
                            <Navbar.Toggle aria-controls="navbarScroll" />
                            <Navbar.Collapse id="navbarScroll">
                                <Nav
                                    className="me-auto my-2 my-lg-0"
                                    style={{ maxHeight: '100px' }}
                                    navbarScroll
                                >
                                    <Nav.Link href="#" onClick={() => { handleShowNewMessage(); }}><Icon.ChatDotsFill color="MidnightBlue" size={25} style={{}} /><strong>Νέο Μήνυμα</strong></Nav.Link>
                                </Nav>

                                <Modal
                                    show={showNewMessage}
                                    size="lg"
                                    aria-labelledby="example-custom-modal-styling-title"
                                    class="modal-lg modal-dialog"
                                >
                                    <Modal.Header>
                                    </Modal.Header>

                                    <Modal.Body variant={'danger'}>
                                        <NewMessage data={messages.data} user={currentUser} />
                                    </Modal.Body>

                                    <Modal.Footer>
                                        <Button size="sm" variant="secondary" onClick={handleCloseNewMessage}>
                                            Άκυρο
                                        </Button>
                                    </Modal.Footer>
                                </Modal>


                                <Form className="d-flex">
                                    <FormControl
                                        type="search"
                                        placeholder="Search"
                                        className="me-2"
                                        aria-label="Search"
                                    />
                                    <Button variant="outline-success">Search</Button>
                                </Form>
                            </Navbar.Collapse>
                        </Container>
                    </Navbar>
                    {/* End ToolBar*/}


                    <Tab.Container id="left-tabs-example" defaultActiveKey="first"  >
                        <Row>
                            <Col sm={3}>
                                <Nav variant="pills" className="flex-column">
                                    <Nav.Item>
                                        <Nav.Link eventKey="first">Εισερχόμενα</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">Απεσταλμένα</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>

                            <Col sm={9}>
                                <Tab.Content>

                                    <Tab.Pane eventKey="first">
                                        <ListMessages messages={messages.data} inbox={true} />
                                    </Tab.Pane>

                                    <Tab.Pane eventKey="second">
                                        <ListMessages messages={messages.data} outgoing={true} />
                                    </Tab.Pane>

                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>



                </div>

            ) : (
                    <div>
                        loading...
                    </div>
            )}
        </div>
    );


}