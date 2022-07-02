import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, NavLink, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Button, Modal, Tabs, Tab, Row, Col } from "react-bootstrap";

import userService from '../_services/UserService';
import AuthService from '../_services/AuthService';
import Notfound from "./_pages/NotFound";
import Pagination from "./_pageStructure/PaginationComponent";
import MasterForm from "./_pageStructure/_progressFrom/MasterForm";




export default function BoardAdmin() {
    const navigate = useNavigate();
    const [showModeratorBoard, setShowModeratorBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);

    const [showNewAuction, setShowNewAuction] = useState(false);
    const handleCloseNewAuction = () => setShowNewAuction(false);
    const handleShowNewAuction = () => setShowNewAuction(true);


    useEffect(() => {

        const fetchUser = async () => {
            try {
                const user = AuthService.getCurrentUser();
                if (user) {

                    setCurrentUser(AuthService.getCurrentUser());
                    setShowModeratorBoard(user.data[0].ROLES.some(({ ROLE_NAME }) => ROLE_NAME === 'ROLE_MODERATOR'));
                }
            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchUser();


    }, []);



    //console.log(currentUser);
    return (
        <div>

            {showModeratorBoard ? (
                <div style={{}} >
                        <Tabs defaultActiveKey="auctionList" id="uncontrolled-tab-example" className="mb-3" className="d-flex justify-content-center">

                            <Tab eventKey="auctionList" title="Οι Δημοπρασίες μου">
                                Λίστα Δημοπρασιών
                            <Pagination url={"http://localhost:1337/getAuctions/?seller=" + currentUser.data[0].USERID} auctions={true} postsPerPage={5} />
                            </Tab>


                            <Tab eventKey="newAuction" title="Νέα Δημοπρασία">
                                
                                <Row style={{marginTop:'20px'}}>
                                    <Col>
                                        <Button style={{ margin: '5px' }} size="lg" variant="primary" onClick={() => { handleShowNewAuction();}} >Νέα Δημοπρασία</Button>
                                        <Modal
                                        show={showNewAuction}
                                        size="lg"
                                        aria-labelledby="example-custom-modal-styling-title"
                                        class="modal-lg modal-dialog"
                                        >
                                        <Modal.Header>
                                        </Modal.Header>

                                        <Modal.Body variant={'danger'}>
                                            <MasterForm />
                                        </Modal.Body>

                                        <Modal.Footer>
                                            <Button size="sm" variant="secondary" onClick={handleCloseNewAuction}>
                                                Άκυρο
                                            </Button>
                                        </Modal.Footer>
                                        </Modal>

                                        <div>
                                            <p>Όροι και Προϋποθέσεις</p>
                                        </div>
                                    </Col>
                                </Row>
                                
                            </Tab>
                        </Tabs>
                </div>

            ) : (
                <div>
                    <Notfound />
                </div>
            )}
        </div>
    );


}