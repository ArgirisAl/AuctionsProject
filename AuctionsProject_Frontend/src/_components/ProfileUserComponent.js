import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card, Button, ListGroup, Modal, Offcanvas } from "react-bootstrap";
import {Section} from 'mdb-react-ui-kit';

import AuthService from '../_services/AuthService';



export default function UserProfile(props) {
    const navigate = useNavigate();
    const [showAdminBoard, setShowAdminBoard] = useState(false);
    const [currentUser, setCurrentUser] = useState(undefined);
    const [locateLine, setLocateLine] = useState();
    const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);



    const [showEditProfile, setShowEditProfile] = useState(false);
    const handleCloseEditProfile = () => setShowEditProfile(false);
    const handleShowEditProfile = () => setShowEditProfile(true);



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


    //url :id
    let { id } = useParams();


    useEffect(() => {

        const fetchUser = async () => {
            try {
                const response = await axios.get("http://localhost:1337/getUsers/?userid=" + id);
                setData(response.data);
                setLoading(true);
            } catch (error) {
                setError(error.message);
            } finally {
                
            }
        }
        fetchUser();


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

    const unauthUser = () => navigate("/home", { replace: true });

    //console.log(currentUser);

    return (
        <div>
            {loading ? (
                <div >
                    <Card bg="" style={{ width: 'auto', margin: '30px', alignItems: 'center' }} >

                        <Card.Img style={{ maxWidth: '30%',marginTop:'0px' }} variant="top" src="https://cdn.pixabay.com/photo/2019/12/28/08/54/link-4724148_960_720.jpg" />
                        <Card.Title>{data.data[0].FNAME} {data.data[0].LNAME}</Card.Title>
                        <div style={{ display: 'flex' }}>


                            {currentUser == data.data[0].USERID && (
                                <div>
                                    <Button style={{ margin: '5px' }} size="sm" variant="danger" onClick={() => { handleShowEditProfile(); setLocateLine(data.data[0]); }} >Επεξεργασία Προφίλ</Button>

                                    <Offcanvas show={showEditProfile} onHide={handleCloseEditProfile}>
                                        <Offcanvas.Header closeButton>
                                            <Offcanvas.Title>Offcanvas</Offcanvas.Title>
                                        </Offcanvas.Header>
                                        <Offcanvas.Body>
                                            Some text as placeholder. In real life you can have the elements you
                                            have chosen. Like, text, images, lists, etc.
                                        </Offcanvas.Body>
                                    </Offcanvas>
                                </div>
                            )}


                            {!data.data[0].ISACTIVE && (
                                <div>
                                    <Button style={{ margin: '5px' }} size="sm" variant="warning" onClick={() => { handleShowActivate(); setLocateLine(data.data[0]); }} >Ενεργοποίηση Χρήστη</Button>
                                    {locateLine && (
                                        <Modal
                                            size="sm"
                                            show={showActivate}
                                            onHide={handleCloseActivate}
                                        >
                                            <Modal.Header closeButton>
                                            </Modal.Header>
                                            <Modal.Body variant={'danger'}>Ενεργοποίηση Χρήστη! Συνέχεια?</Modal.Body>
                                            <Modal.Footer>
                                                <Button size="sm" variant="secondary" onClick={handleCloseActivate}>
                                                    Άκυρο
                                                </Button>
                                                <Button size="sm" variant="primary" onClick={() => { handleCloseActivate(); activateUser(locateLine); }}>
                                                    Αποθήκευση Αλλαγών
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>



                                    )}
                                </div>
                            )}
                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#F0F8FF', width: '100%' }} className="d-flex justify-content-end">
                            <div style={{ display: 'block', textAlign: 'center', margin:'10px' }}>
                                <h3>129</h3>
                                <h6 style={{color: '#808080' }} >Δημοπρασίες</h6>
                            </div>
                            <div style={{ display: 'block', textAlign: 'center', margin: '10px' }}>
                                <h3>129</h3>
                                <h6 style={{ color: '#808080' }} >Μεγαλύτερη Προσφορά</h6>
                            </div>
                        </div>


                        <h6 style={{ color: '#808080', marginTop: '15px' }} >Πληροφορίες</h6>
                        <div style={{ display: 'flex', backgroundColor: '#F0F8FF', width: '80%'}} className="d-flex justify-content-center">
                            <div style={{ display: 'block', textAlign: 'center', margin: '10px' }}>
                                <ListGroup variant="flush">
                                    <Card.Header>Γενικά</Card.Header>
                                    <ListGroup.Item>{data.data[0].ADDRESS}</ListGroup.Item>
                                    <ListGroup.Item>{data.data[0].CITY}</ListGroup.Item>
                                    <ListGroup.Item>{data.data[0].COUNTRY}</ListGroup.Item>
                                    <ListGroup.Item>{data.data[0].DISTRICT}</ListGroup.Item>
                                </ListGroup>
                            </div>
                            <div style={{ display: 'block', textAlign: 'center', margin: '10px' }}>
                                <ListGroup variant="flush">
                                    <Card.Header>Επικοινωνία</Card.Header>
                                    <ListGroup.Item>{data.data[0].ADDRESS}</ListGroup.Item>
                                    <ListGroup.Item>{data.data[0].CITY}</ListGroup.Item>
                                    <ListGroup.Item>{data.data[0].COUNTRY}</ListGroup.Item>
                                    <ListGroup.Item>{data.data[0].DISTRICT}</ListGroup.Item>
                                </ListGroup>
                            </div>
                        </div>


                        <Card.Body style={{  margin: '10px' }}>
                            <Button style={{ margin: '10px' }} variant="primary">Go somewhere</Button>
                            <Button style={{ margin: '10px' }} variant="primary">Go somewhere</Button>
                        </Card.Body>

                    </Card>



                </div>

            ) : (
                    <div>
                        loading
                </div>
            )}
        </div>
    );


}