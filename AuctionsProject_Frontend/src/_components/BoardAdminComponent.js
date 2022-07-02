import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, NavLink, Link  } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import moment from "moment";
import * as Icon from 'react-bootstrap-icons';
import DownloadLink from "react-download-link";
import { Button, Form, Nav, Tab, Row, Col, Navbar, Container, Modal, FormControl } from "react-bootstrap";
import {
    CDBSidebar,
    CDBSidebarHeader,
    CDBSidebarMenuItem,
    CDBSidebarContent,
    CDBSidebarMenu,
    CDBSidebarSubMenu,
    CDBSidebarFooter,
    CDBBadge,
    CDBContainer
} from 'cdbreact';

import userService from '../_services/UserService';
import AuthService from '../_services/AuthService';
import Notfound from "./_pages/NotFound";
import Pagination from "./_pageStructure/PaginationComponent";




export default function BoardAdmin() {
    const navigate = useNavigate();
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);


    const [showNewMessage, setShowNewMessage] = useState(false);
    const handleCloseNewMessage = () => setShowNewMessage(false);
    const handleShowNewMessage = () => setShowNewMessage(true);


    //Download XML
    var d = new Date();
    let downloadXMLFileName = "Auctions " + moment().format("YYYYMMDD-HHmmss") + ".xml";
    let downloadJSONFileName = "Auctions " + moment().format("YYYYMMDD-HHmmss") + ".txt";
    const [xmlData, setXmlData] = useState(false);
    const handleXMLExportData = () => {
        const fetchXmlData= async () => {
            try {
                const response = await axios.get("http://localhost:1337/getXmlFileData");
                setXmlData(response.data);
                //return response.data;
            } catch (error) {
                setError(error.message);
            } finally {

            }
        }
        fetchXmlData();
        //return "The time is 2" + new Date().toLocaleTimeString();
    };
    const getXMLExportData = () => {
        //console.log(xmlData.data[0].XML_DATA);
        return '<?xml version="1.0" encoding="UTF - 8"?>'+'\n'+xmlData.data[0].XML_DATA;
    };
    const getJSONExportData = () => {
        return xmlData.data[0].XML_DATA;
    };

    //filters
    const [activeUsersFilter, setActiveUsersFilter] = useState(false);
    const handleChange = () => {

        setActiveUsersFilter(current => !current);
        //console.log({ activeUsersFilter });
    };

    

    useEffect(() => {

        const fetchUser = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user) {

                    setCurrentUser(AuthService.getCurrentUser());
                    setShowAdminBoard(user.data[0].ROLES.some(({ ROLE_NAME }) => ROLE_NAME === 'ROLE_ADMIN'));
                }
            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchUser();


        const fetchPosts = async () => {
            try {
                const response = await axios.get("https://randomuser.me/api/?results=50");
                setPosts(response.data.results);
                setLoading(false);
            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchPosts();

    }, []);


    

    return (
        <div>
            {showAdminBoard ? (
                <div style={{
                }}>
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
                                    <Nav.Link href="#" onClick={() => { handleShowNewMessage(); }}>

                                        <Button style={{ margin: '5px' }} size="sm" variant="outline-primary" onClick={() => { handleXMLExportData(); }} ><Icon.FiletypeXml color="MidnightBlue" size={25} style={{}} /></Button>
                                        {xmlData && (
                                            <DownloadLink
                                                filename={downloadXMLFileName}
                                                label="Download XML"
                                                exportFile={() => getXMLExportData()}
                                            >
                                                {" "}
                                                Save
                                            </DownloadLink>
                                        )}
                                        <Button style={{ margin: '5px' }} size="sm" variant="outline-primary" onClick={() => { handleXMLExportData(); }} ><Icon.FiletypeCsv color="MidnightBlue" size={25} style={{}} /></Button>
                                        {xmlData && (
                                            <DownloadLink
                                                filename={downloadJSONFileName}
                                                label="Download JSON"
                                                exportFile={() => getJSONExportData()}
                                            >
                                                {" "}
                                                Save
                                            </DownloadLink>
                                        )}
                                    </Nav.Link>


 
                                </Nav>





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
                                        <Nav.Link eventKey="first">Διαχείριση Χρηστών</Nav.Link>
                                    </Nav.Item>
                                    <Nav.Item>
                                        <Nav.Link eventKey="second">Διαχείριση Δημοπρασιών</Nav.Link>
                                    </Nav.Item>
                                </Nav>
                            </Col>

                            <Col sm={9}>
                                <Tab.Content>
                                    <Tab.Pane eventKey="first">


                                        <Form style={{ }}>
                                            <Form.Check
                                                type="switch"
                                                id="custom-switch"
                                                label="Όλοι οι χρήστες"
                                                onChange={handleChange}
                                                value={activeUsersFilter}
                                                
                                            />
                                        </Form>

                                        {activeUsersFilter ? (
                                                <div>
                                                    
                                                    <Pagination url={"http://localhost:1337/getUsers"} allUsers={true} users={true} postsPerPage={5} />
                                                </div>
                                        ) : (
                                                <div>
                                                    <p>Λίστα Χρηστών προς έγκριση</p>
                                                    <Pagination url={"http://localhost:1337/getUsers"} allUsers={false} users={true} postsPerPage={5} />
                                                </div>
                                        )}
                                        

                                    </Tab.Pane>
                                    <Tab.Pane eventKey="second">
                                        <Pagination url={"http://localhost:1337/getAuctions"} showButtons={true} auctions={true} postsPerPage={5} />
                                    </Tab.Pane>
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
                </div>

            ) : (
                <div>
                   <Notfound/>
                </div>
            )}
        </div>
    );


}