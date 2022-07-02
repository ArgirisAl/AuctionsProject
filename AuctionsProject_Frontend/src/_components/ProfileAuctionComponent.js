import React, { useEffect, useState, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useParams } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Card, Button, ListGroup, Modal, Container,Row,Col } from "react-bootstrap";
import { Section } from 'mdb-react-ui-kit';

import AuctionBidModal from './_pageStructure/_modal/ModalAuctionBid'

import JsonDataDisplay from './_pageStructure/JsonBidsTable'
import auction_image from './_images/blank_auction_image.jpg';
import AuthService from '../_services/AuthService';


import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

export default function AuctionProfile(props) {
    const [currentUser, setCurrentUser] = useState(undefined);
    const [error, setError] = useState("");
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [bids, setBids] = useState([]);
    const [center, setCenter] = useState({
        center : {
            lat: 0,
            lng: 0,
        }
    });


    const [showEditProfile, setShowEditProfile] = useState(false);
    const handleCloseEditProfile = () => setShowEditProfile(false);
    const handleShowEditProfile = () => setShowEditProfile(true);



    const [showActivate, setShowActivate] = useState(false);
    const handleCloseActivate = () => setShowActivate(false);
    const handleShowActivate = () => setShowActivate(true);
    const activateUser = (user) => {

        //try {
        //    const userid = user.USERID;
        //    const response = axios.post("http://localhost:1337/activateUser/?userid=", {
        //        userid
        //    })
        //        .then(response => {
        //            setData(response.data);
        //            setLoading(true);
        //            window.location.reload();
        //        });
        //
        //} catch (error) {
        //    setError(error.message);
        //} finally {
        //
        //}
    };


    //url :id
    let { id } = useParams();


    useEffect(() => {

        const fetchAuction = async () => {
            try {

                await axios.get("http://localhost:1337/getAuctionBIDS/?auctionid=" + id)
                    .then(response => {
                        setData(response.data);
                        setBids(response.data.data[0].BIDS);
                        setCenter(prevState => ({
                            ...prevState,
                            lat: response.data.data[0].LATITUDE,
                            lng: response.data.data[0].LONGITUDE
                        }));
                        setLoading(true);
                    });

                
            } catch (error) {
                setError(error.message);
            } finally {

            }
        }
        fetchAuction();

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

    // MAP

    const [mPosition, setMPosition] = useState(center);

    function DraggableMarker() {
        const [draggable, setDraggable] = useState(false)
        const [position, setPosition] = useState(center)
        const markerRef = useRef(null)

        const eventHandlers = useMemo(
            () => ({
                dragend() {
                    const marker = markerRef.current
                    if (marker != null) {
                        setPosition(marker.getLatLng())
                        setMPosition({ position })
                    }
                },
            }),
            [],
        )
        const toggleDraggable = useCallback(() => {
            setDraggable((d) => !d)
        }, [])
        //console.log({ position });

        //console.log({ mPosition });
        return (
            <Marker
                draggable={draggable}
                eventHandlers={eventHandlers}
                position={position}
                ref={markerRef}>
                <Popup minWidth={90}>
                    <span onClick={toggleDraggable}>
                        {draggable
                            ? 'Αλλαγή τοποθεσίας!'
                            : 'Πατήστε για αλλαγή τοποθεσίας!'}
                    </span>
                </Popup>
            </Marker>
        )
    }
    // MAP

    // Button Bid
    const [showSetBid, setShowSetBid] = useState(false);
    const handleCloseSetBid = () => setShowSetBid(false);
    const handleShowSetBid = () => setShowSetBid(true);
    // Button Edit
    const [showEdit, setShowEdit] = useState(false);
    const handleCloseEdit = () => setShowEdit(false);
    const handleShowEdit = () => setShowEdit(true);
    const editUser = (user) => {


        //try {
        //    const userid = user.USERID;
        //    const response = axios.post("http://localhost:1337/getAuctions", {
        //        userid
        //    })
        //        .then(response => {
        //            setData(response.data);
        //            setLoading(true);
        //            window.location.reload();
        //        });
        //
        //} catch (error) {
        //    setError(error.message);
        //} finally {
        //
        //}
    };



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


    // Button Started
    const [showStarted, setShowStarted] = useState(false);
    const handleCloseStarted = () => setShowStarted(false);
    const handleShowStarted = () => setShowStarted(true);
    const startedAuction = (auction) => {

        try {
            const auctionid = auction.AUCTIONS;
            const isstarted = 1;
            axios.post("http://localhost:1337/updateAuction?auctionid", {
                auctionid,
                isstarted

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

    console.log(data);

    return (
        <div>
            {loading ? (
                <Container >
                    <Card bg="" style={{ width: 'auto', margin: '30px', alignItems: 'center' }} >

                        <Card.Img style={{ maxWidth: '30%', marginTop: '0px' }} variant="top" src={auction_image} />



                        { /****** Buttons ******/}
                        <div style={{ display: 'flex' }} >

                            { /* Edit button */}
                            {!data.data[0].ISSTARTED && data.data[0].SELLER == currentUser.data[0].USERID && (
                                <div>
                                    <Button style={{ margin: '5px' }} size="sm" variant="outline-warning" onClick={() => { handleShowEdit(); }} >Επεξεργασία</Button>
                                    <Button style={{ margin: '5px' }} size="sm" variant="outline-danger" onClick={() => { handleShowDelete(); }} >Διαγραφή</Button>
                                    <Button style={{ margin: '5px' }} size="sm" variant="outline-success" onClick={() => { handleShowStarted(); }} >Έναρξη</Button>

                                        <Modal
                                            size="lg"
                                            show={showEdit}
                                            onHide={handleCloseEdit}
                                        >
                                            <Modal.Header closeButton>
                                            <Modal.Title>{data.data[0].NAME}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                Woohoo, you're reading this text in a modal!

                                            </Modal.Body>


                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseEdit}>
                                                    Close
                                                </Button>
                                            <Button variant="primary" onClick={() => { handleCloseEdit(); editUser(data.data[0]); }}>
                                                    Save Changes
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>

                                        <Modal
                                            size="lg"
                                            show={showDelete}
                                            onHide={handleCloseDelete}
                                        >

                                            <Modal.Header closeButton>
                                                <Modal.Title>a</Modal.Title>
                                            </Modal.Header>
                                        <Modal.Body>{data.data[0].NAME}</Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseDelete}>
                                                    Close
                                                </Button>
                                            <Button variant="primary" onClick={() => { handleCloseDelete(); deleteUser(data.data[0]); }}>
                                                    Save Changes
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>


                                        <Modal
                                            size="lg"
                                            show={showStarted}
                                            onHide={handleCloseStarted}
                                        >

                                            <Modal.Header closeButton>
                                                <Modal.Title></Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>
                                                <p>Πρόκειται να γίνει εκκίνηση της δημοπρασίας "{data.data[0].NAME}" .</p>
                                                <p>Μέτα την έναρξη της δημοπρασίας δεν θα μπορούν να μεταβληθούν τα στοιχεία της.</p>

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseStarted}>
                                                    Άκυρο
                                                </Button>
                                                <Button variant="primary" onClick={() => { handleCloseStarted(); startedAuction(data.data[0]); }}>
                                                    Αποθήκευση
                                                </Button>
                                            </Modal.Footer>
                                    </Modal>

                                </div>

                            )}


                            { /* Bid button */}
                            {data.data[0].ISSTARTED && data.data[0].SELLER != currentUser.data[0].USERID && (
                                <div>
                                    <Button style={{ margin: '5px' }} size="sm" variant="primary" onClick={() => { handleShowSetBid(); }} >Προσφορά</Button>

                                        <Modal
                                            size="lg"
                                            show={showSetBid}
                                            onHide={handleCloseSetBid}

                                        >
                                            <Modal.Header closeButton>
                                                <Modal.Title>{data.data[0].NAME}</Modal.Title>
                                            </Modal.Header>
                                            <Modal.Body>

                                                <AuctionBidModal data={data.data[0]} />

                                            </Modal.Body>
                                            <Modal.Footer>
                                                <Button variant="secondary" onClick={handleCloseSetBid}>
                                                    Άκυρο
                                                </Button>
                                            </Modal.Footer>
                                        </Modal>
                                </div>
                            )}
                        </div>




                        { /* End Buttons */}



                        <Card.Title className="text-center">
                            <h3>Όνομα</h3>
                            <hr
                                style={{
                                    color: "red",
                                    backgroundColor: "red",
                                    height: 5
                                }}
                            />
                            {data.data[0].NAME}
                            <br />
                            <br />
                            <br />
                            <h3>Περιγραφή</h3>
                            <hr
                                style={{
                                    color: "red",
                                    backgroundColor: "red",
                                    height: 5
                                }}
                            />
                            {data.data[0].DESCRIPTION}
                        </Card.Title>

                        <div style={{ display: 'flex' }}>



                        </div>

                        <div style={{ display: 'flex', backgroundColor: '#F0F8FF', width: '100%' }} className="d-flex justify-content-end">
                            <div style={{ display: 'block', textAlign: 'center', margin:'10px' }}>
                                <h3>{data.data[0].NUMBER_OF_BIDS}</h3>
                                <h6 style={{color: '#808080' }} >Αριθμός Προσφορών</h6>
                            </div>
                            <div style={{ display: 'block', textAlign: 'center', margin: '10px' }}>
                                <h3>{data.data[0].CURRENTLY}</h3>
                                <h6 style={{ color: '#808080' }} >Μεγαλύτερη Προσφορά</h6>
                            </div>
                        </div>


                        <div style={{ display: 'flex', width: '100%', margin: '30px' }} className="d-flex justify-content-center">

                            
                            
                            <div style={{ display: 'block', textAlign: 'center', margin: '10px' }}>
                                <h2>Τοποθεσία</h2>
                                <strong>Χώρα:</strong>{data.data[0].COUNTRY_NAME}
                                <br/>
                                <strong>Γ. Πλάτος:</strong>{data.data[0].LATITUDE}
                                <br />
                                <strong>Γ.Μήκος:</strong>{data.data[0].LONGITUDE}
                                <br />
                            </div>

                            <div style={{ display: 'block', textAlign: 'center', margin: '10px' }}>
                                <h2>Πληροφορίες</h2>
                                <strong>Έναρξη:</strong> {data.data[0].STARTED}
                                <br />
                                <strong>Λήξη:</strong> {data.data[0].ENDS}
                                <br />
                                <strong>Τιμή άμεσης αγοράς:</strong> {data.data[0].BUY_PRICE}
                                <br />
                                <strong>Ελάχιστη Προσφορά:</strong> {data.data[0].FIRST_BID}
                                <br />
                            </div>

                            <div style={{ display: 'block', textAlign: 'center', margin: '10px' }}>
                                <h2>Πληροφορίες Πωλητή</h2>
                                <strong>Βαθμολογία:</strong> {data.data[0].SELLER_RATING}
                                <br />
                                <strong>Όνομα:</strong> {data.data[0].SELLER_FIRSTNAME}
                                <br />
                                <strong>Επώνυμο:</strong> {data.data[0].SELLER_LASTNAME}
                                <br />
                                <strong>Όνομα Χρήστη:</strong> {data.data[0].SELLER_USERNAME}
                                <br />
                            </div>

                        </div>

                        <MapContainer
                            className="markercluster-map"
                            center={center}
                            zoom={12}
                            maxZoom={18}
                            style={{ width: "80%", height: "30vh" }}

                        >
                            <TileLayer
                                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                            />
                            <DraggableMarker />
                        </MapContainer>

                        <Card.Body style={{  margin: '10px' }}>
                            <Button style={{ margin: '10px' }} variant="primary">Go somewhere</Button>
                            <Button style={{ margin: '10px' }} variant="primary">Go somewhere</Button>
                        </Card.Body>

                    </Card>

                    {bids ? (
                    <JsonDataDisplay JsonData={bids} />
                    ) : (
                            <div>
                               Δεν υπάρχουν δεδομένα για προβολή!
                        </div>
                    )}

                </Container>

            ) : (
                    <div>
                        loading
                </div>
            )}
        </div>
    );


}