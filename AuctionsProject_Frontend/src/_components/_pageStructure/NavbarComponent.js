import React, { useEffect, useState, useMemo } from 'react';
import { BrowserRouter, Router, Routes, Route, Link, NavLink, Switch, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Button, FormGroup, FormControl, ControlLabel, Form, Badge, Nav, Navbar, Container, NavDropdown } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";
import axios from 'axios';


import AuthService from '../../_services/AuthService';
import Home from "../HomeComponent";
import UserProfile from "../ProfileUserComponent";
import AuctionProfile from "../ProfileAuctionComponent";
import BoardUser from "../../_components/BoardUserComponent";
import BoardModerator from "../BoardModeratorComponent";
import BoardAdmin from "../BoardAdminComponent";
import Login from "../LoginComponent";
import Register from "../../_components/RegisterComponent";
import Notfound from "../../_components/_pages/NotFound";
//import Footer from "../../_components/_pageStructure/FooterComponent";
import SearchAuctions from "../SearchAuctions";
import Messaging from "../../_components/MessagingComponent";


export default function NavBar() {

    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [showUserBoard, setShowUserBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [error, setError] = useState("");
    const [profileUrl, setProfileUrl] = useState("");
    const [profileMessagesUrl, setProfileMessagesUrl] = useState("");
    const [unreadMessages, setUnreadMessages] = useState();

    useEffect(() => {
        
        const fetchUser = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user) {
                    
                    setCurrentUser(AuthService.getCurrentUser());
                    setShowModeratorBoard(user.data[0].ROLES.some(({ ROLE_NAME }) => ROLE_NAME === 'ROLE_MODERATOR'));
                    setShowAdminBoard(user.data[0].ROLES.some(({ ROLE_NAME }) => ROLE_NAME === 'ROLE_ADMIN'));
                    setShowUserBoard(user.data[0].ROLES.some(({ ROLE_NAME }) => ROLE_NAME === 'ROLE_USER'));
                    setProfileUrl("/profile/" + user.data[0].USERID);
                    setProfileMessagesUrl("/mymessages/" + user.data[0].USERID);
                }
            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchUser();

        const fetchUnreadMessages = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user) {
                    const response = await axios.get("http://localhost:1337/getUnreadMessages/?userid=" + user.data[0].USERID);
                    setUnreadMessages(response.data);
                }
            } catch (error) {
                setError(error.message);
            } finally {

            }
        }
        fetchUnreadMessages();

    }, []);

    console.log(unreadMessages);
    const logOut = () => AuthService.logout();

    return (
        <div>
            <div>
                {currentUser ? (
                    <div>
                        <div>
                            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
                                <Container>
                                    <Navbar.Brand href="/">e-Δημοπρασία</Navbar.Brand>

                                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                                    <Navbar.Collapse id="responsive-navbar-nav">

                                        <Nav className="me-auto">
                                            <Nav.Link href="/searchAuctions">Αναζήτηση Δημοπρασιών</Nav.Link>
                                        </Nav>

                                        <Nav>

                                            {unreadMessages && (
                                                <Button variant="primary" href={profileMessagesUrl}>
                                                    <Icon.ChatDotsFill color="MidnightBlue" size={25} style={{}} /> <Badge bg="secondary">{unreadMessages.data[0].TOTAL_UNREAD_MESSAGES}</Badge>
                                                    <span className="visually-hidden">unread messages</span>
                                                </Button>
                                            )}


                                             <NavDropdown title={currentUser.data[0].FIRSTNAME} id="collasible-nav-dropdown">
                                                 <NavDropdown.Item href={profileUrl}>Προφίλ</NavDropdown.Item>
                                                <NavDropdown.Item href={profileMessagesUrl}>Μηνύματα</NavDropdown.Item>
                                             
                                                {showAdminBoard ? (
                                                    <div>
                                                        <NavDropdown.Divider />
                                                        <NavDropdown.Item href="/dashboard">Σελίδα Διαχείρισης</NavDropdown.Item>
                                                    </div>
                                                ) : showModeratorBoard ? (
                                                    <div>
                                                        <NavDropdown.Divider />
                                                            <NavDropdown.Item href="/mod">Οι Δημοπρασίσες μου</NavDropdown.Item>
                                                    </div>
                                                    ) : (
                                                        <div>
                                                        </div>
                                                )}

                                             </NavDropdown>
                                         </Nav>

                                        <Nav>
                                            <Nav.Link onClick={logOut} href="/">Έξοδος</Nav.Link>
                                        </Nav>

                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            <div className="container mt-3">
                                <Routes>
                                    <Route exact path="/" element={<Home />} />
                                    <Route exact path="/home" element={<Home />} />
                                    <Route path="/user" element={<BoardUser />} />
                                    <Route path="/mod" element={<BoardModerator />} />
                                    <Route path="/dashboard" element={<BoardAdmin />} />
                                    <Route path="/profile/:id" element={<UserProfile />} />
                                    <Route path="/auction/:id" element={<AuctionProfile />} />
                                    <Route exact path="/searchAuctions" element={<SearchAuctions />} />
                                    <Route path="/mymessages/:id" element={<Messaging />} />
                                    <Route path="*" element={<Notfound />} />
                                </Routes>
                            </div>
                        </div>
                    </div>

                ) : (
                    <div>
                            <Navbar collapseOnSelect expand="lg" bg="dark" variant="dark" sticky="top">
                                <Container >
                                    <Navbar.Brand href="/">e-Δημοπρασία</Navbar.Brand>

                                    <Navbar.Toggle aria-controls="responsive-navbar-nav" />

                                    <Navbar.Collapse id="responsive-navbar-nav" className="justify-content-end">

                                        <Nav className="me-auto">
                                            <Nav.Link href="/searchAuctions">Αναζήτηση Δημοπρασιών</Nav.Link>
                                        </Nav>

                                        <Nav>
                                            <button type="button" className="btn btn-outline-primary" style={{margin:'5px'}}>
                                                <Nav.Link href="/signin">Είσοδος</Nav.Link>
                                            </button>
                                            <button type="button" className="btn btn-outline-primary" style={{ margin: '5px' }}>
                                                <Nav.Link eventKey={2} href="/signup">Εγγραφή</Nav.Link>
                                            </button>
                                        </Nav>

                                    </Navbar.Collapse>
                                </Container>
                            </Navbar>
                            <div className="container mt-3">
                                <Routes>
                                    <Route exact path="/" element={<Login />} />
                                    <Route exact path="/signin" element={<Login />} />
                                    <Route exact path="/signup" element={<Register />} />
                                    <Route exact path="/searchAuctions" element={<SearchAuctions />} />
                                    
                                    <Route path="*" element={<Notfound />} />
                                </Routes>
                            </div>
                    </div>
                )}
            </div>
            <div>
                {/*<Footer />*/ }
            </div>
        </div>
    );


}
