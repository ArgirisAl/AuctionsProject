import React, { useEffect, useState, createContext, useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Card, Container, Modal, Button, FormControl, Form, Figure } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';
import { useNavigate } from "react-router-dom";
import axios from 'axios';
import validator from "validator";
import AuthService from '../../_services/AuthService';
import AuctionBidModal from './_modal/ModalAuctionBid'
import auction_image from '../_images/blank_auction_image.jpg';


export default function AuctionsPosts(props) {



    const navigate = useNavigate();
    const [locateLine, setLocateLine] = useState();
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [data, setData] = useState(null);
    const [currentUser, setCurrentUser] = useState(undefined);

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




    //console.log(props);

    //The UI for the UsersList to be shown
    const AuctionsPosts = (props) => {
        //destrcture the props
        const {
            BUY_PRICE,
            COUNTRY,
            CURRENTLY,
            ENDS,
            FIRST_BID,
            LATITUDE,
            LONGITUDE,
            NAME,
            DESCRIPTION,
            FIRSTNAME,
            LASTNAME,
            NUMBER_OF_BIDS,
            RATING,
            SELLER,
            STARTED,
            ISEDIT,
            ISDELETE,
            ISSTARTED
        } = props.data
        //console.log(props);
        return (
            <div>
                {currentUser ? (
                    <Container>
                        
                        <Card style={{ margin: '15px' }}>

                            <Card.Header style={{ margin: '5px', display: 'flex' }}>
                                {SELLER == currentUser.data[0].USERID && (<div >Δημοπρασία μου!</div>)}
                                {ISSTARTED && SELLER != currentUser.data[0].USERID && (
                                    <div style={{ display: 'flex' }}>
                                        <Icon.Hammer color="green" size={25} style={{ marginRight: '20px' }} />
                                        <p>Άμεση αγορά {BUY_PRICE}€</p>
                                        <div style={{ marginLeft: '50px', display: 'flex' }}>
                                            <Icon.LightningCharge color="MidnightBlue" size={25} style={{ marginRight: '20px' }} />
                                            <p>Τρέχουσα καλύτερη προσφορά {CURRENTLY}€</p>
                                        </div>
                                    </div>)
                                }
                            </Card.Header>



                            <div style={{ display: 'flex' }}>
                                <Card.Body>

                                    <div style={{ position: 'absolute', right: 0 }}>

                                        <Figure >
                                            <Figure.Image
                                                width={240}
                                                height={250}
                                                alt="171x180"
                                                src={auction_image}
                                            />
                                        </Figure>
                                    </div>

                                    <Card.Title>{NAME}</Card.Title>
                                    <Card.Text>
                                        {DESCRIPTION}
                                    </Card.Text>

                                    <div style={{ display: 'flex' }}>
                                        {/*<Icon.EmojiSunglasses color="MidnightBlue" size={25} style={{ marginRight: '20px' }} />*/}
                                        <p>{FIRSTNAME} {LASTNAME}</p>


                                    </div>


                                <div style={{ display: 'flex' }}>


                                        {ISSTARTED && SELLER != currentUser.data[0].USERID && (
                                            <div>
                                                <Button style={{ margin: '5px' }} size="sm" variant="primary" onClick={() => { handleShowSetBid(); setLocateLine(props.data); }} >Προσφορά</Button>
                                                
                                                {locateLine && (
                                                    <Modal
                                                        size="lg"
                                                        show={showSetBid}
                                                        onHide={handleCloseSetBid}

                                                    >
                                                        <Modal.Header closeButton>
                                                            <Modal.Title>{locateLine.NAME}</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>

                                                            <AuctionBidModal data={locateLine} />

                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={handleCloseSetBid}>
                                                                Άκυρο
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                )}
                                            </div>
                                        )}

                                        <Button style={{ margin: '5px' }} size="sm" variant="outline-info" onClick={() => { redirUserProfile(props.data); }} >Προβολή</Button>



                                        {!ISSTARTED && SELLER == currentUser.data[0].USERID && (
                                        <div>
                                                <Button style={{ margin: '5px' }} size="sm" variant="outline-warning" onClick={() => { handleShowEdit(); setLocateLine(props.data); }} >Επεξεργασία</Button>
                                                <Button style={{ margin: '5px' }} size="sm" variant="outline-danger" onClick={() => { handleShowDelete(); setLocateLine(props.data); }} >Διαγραφή</Button>
                                                <Button style={{ margin: '5px' }} size="sm" variant="outline-success" onClick={() => { handleShowStarted(); setLocateLine(props.data); }} >Έναρξη</Button>

                                                {locateLine && (
                                                <Modal
                                                    size="lg"
                                                    show={showEdit}
                                                    onHide={handleCloseEdit}
                                                >
                                                    <Modal.Header closeButton>
                                                        <Modal.Title>{locateLine.NAME}</Modal.Title>
                                                    </Modal.Header>
                                                    <Modal.Body>
                                                        Woohoo, you're reading this text in a modal!

                                                    </Modal.Body>


                                                    <Modal.Footer>
                                                        <Button variant="secondary" onClick={handleCloseEdit}>
                                                            Close
                                                        </Button>
                                                        <Button variant="primary" onClick={() => { handleCloseEdit(); editUser(locateLine); }}>
                                                            Save Changes
                                                        </Button>
                                                    </Modal.Footer>
                                                </Modal>
                                                )}

                                                {locateLine && (
                                                    <Modal
                                                        size="lg"
                                                        show={showDelete}
                                                        onHide={handleCloseDelete}
                                                    >

                                                        <Modal.Header closeButton>
                                                            <Modal.Title>a</Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>{locateLine.NAME}</Modal.Body>
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
                                                        show={showStarted}
                                                        onHide={handleCloseStarted}
                                                    >

                                                        <Modal.Header closeButton>
                                                            <Modal.Title></Modal.Title>
                                                        </Modal.Header>
                                                        <Modal.Body>
                                                            <p>Πρόκειται να γίνει εκκίνηση της δημοπρασίας "{locateLine.NAME}" .</p>
                                                            <p>Μέτα την έναρξη της δημοπρασίας δεν θα μπορούν να μεταβληθούν τα στοιχεία της.</p>

                                                        </Modal.Body>
                                                        <Modal.Footer>
                                                            <Button variant="secondary" onClick={handleCloseStarted}>
                                                                Άκυρο
                                                            </Button>
                                                            <Button variant="primary" onClick={() => { handleCloseStarted(); startedAuction(locateLine); }}>
                                                                Αποθήκευση
                                                            </Button>
                                                        </Modal.Footer>
                                                    </Modal>
                                                )}
                                        </div>

                                    )}

                                    </div>
                                </Card.Body>
                            </div>

                            {/* Footer */}
                            {!ISSTARTED && SELLER != currentUser.data[0].USERID && (
                                <Card.Footer className="text-muted" style={{ display: 'flex' }}>
                                    <Icon.CalendarX color="red" size={30} style={{ marginRight: '20px' }} /> 
                                    <p>Η δημοπρασία ξεκινάει : {STARTED}</p> 
                                    
                                </Card.Footer>
                            )}

                            {ISSTARTED && SELLER != currentUser.data[0].USERID && (
                                <Card.Footer className="text-muted" style={{ display: 'flex' }}>
                                    <Icon.CalendarCheck color="royalblue" size={30} style={{ marginRight: '20px' }} />
                                    <p>Η δημοπρασία λήγει : {STARTED}</p>

                                </Card.Footer>
                            )}

                        </Card>
                        
                    </Container>
                ) : (
                        <div>
                            <Card style={{ margin: '5px' }}>
                                <Card.Header style={{ margin: '5px' }}>{NAME}</Card.Header>
                                <Card.Body>
                                    <Card.Title>{NAME}</Card.Title>
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
    //console.log(props.posts.filter(auctions => auctions.NAME.toLowerCase().includes(props.searchAuctionsFilter)).length);
    //console.log(props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_ID == props.auctionsCategoryFilter).length).length)

    //console.log(props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_NAME.toLowerCase().includes(props.searchAuctionsFilter.toLowerCase())).length));
    //console.log(props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_ID == props.auctionsCategoryFilter).length));

    //console.log(props.posts.filter(auctions => auctions.CATEGORIES.CATEGORIES_NAME.toLowerCase().includes(props.searchAuctionsFilter)).length);
    //<AuctionsPosts key={filteredAuctions.NAME} data={filteredAuctions} />

    //console.log(props.posts);
    //console.log(props.posts.filter(auction => auction.ISACTIVE == 1).length);


    return (

        <div className="list-group mb-3">

            {props.posts.length > 0 ? (
                <div>
                    {/*props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_ID == props.auctionsCategoryFilter).length) ? props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_ID == props.auctionsCategoryFilter).length).map(filteredAuctions =>
                        <AuctionsPosts key={filteredAuctions.CATEGORIES} data={filteredAuctions} />

                    ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]*/}


                    {props.searchAuctionsFilter ? (
                        <div>

                            {props.posts.filter(auctions => auctions.NAME.toLowerCase().includes(props.searchAuctionsFilter)).length > 0 ? props.posts.filter(auctions => auctions.NAME.toLowerCase().includes(props.searchAuctionsFilter)).map(filteredAuctions =>
                                <AuctionsPosts key={filteredAuctions.AUCTIONS} data={filteredAuctions} />

                            ) : (
                                <div>
                                        {props.posts.filter(auctions => auctions.BUY_PRICE == props.searchAuctionsFilter) ? props.posts.filter(auctions => auctions.BUY_PRICE == props.searchAuctionsFilter).map(filteredAuctions =>
                                            <AuctionsPosts key={filteredAuctions.AUCTIONS} data={filteredAuctions} />

                                        ) : (
                                                <div>
                                                    {props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_NAME.toLowerCase().includes(props.searchAuctionsFilter.toLowerCase())).length).length > 0 ? props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_NAME.toLowerCase().includes(props.searchAuctionsFilter.toLowerCase())).length).map(filteredAuctions =>
                                                        <AuctionsPosts key={filteredAuctions.AUCTIONS} data={filteredAuctions} />

                                                    ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]}
                                                </div>
                                        )}
                                    </div>
                            )}

                            {/*
                             {props.posts.filter(auctions => auctions.NAME.toLowerCase().includes(props.searchAuctionsFilter)).length > 0 ? props.posts.filter(auctions => auctions.NAME.toLowerCase().includes(props.searchAuctionsFilter)).map(filteredAuctions =>
                                 <AuctionsPosts key={filteredAuctions.AUCTIONS} data={filteredAuctions} />

                             ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]}



                             {props.posts.filter(auctions => auctions.BUY_PRICE == props.searchAuctionsFilter) ? props.posts.filter(auctions => auctions.BUY_PRICE == props.searchAuctionsFilter).map(filteredAuctions =>
                                 <AuctionsPosts key={filteredAuctions.AUCTIONS} data={filteredAuctions} />

                             ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]}

                            {props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_NAME.toLowerCase().includes(props.searchAuctionsFilter.toLowerCase())).length) ? props.posts.filter(auctions => auctions.CATEGORIES.filter(CATEGORIES => CATEGORIES.CATEGORIES_NAME.toLowerCase().includes(props.searchAuctionsFilter.toLowerCase())).length).map(filteredAuctions =>
                                <AuctionsPosts key={filteredAuctions.AUCTIONS} data={filteredAuctions} />

                            ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]}
                            */}



                        </div>
                    ) : (

                            <div>
                                {props.posts.filter(auction => auction.ISACTIVE == 1).length > 0 ? props.posts.filter(auction => auction.ISACTIVE == 1).map(filteredAuction =>
                                    <AuctionsPosts key={filteredAuction.AUCTIONS} data={filteredAuction} />

                                ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]}


                                {/*props.posts.length > 0 ? props.posts.map(post =>
                                    <div>
                                        <AuctionsPosts key={post.AUCTIONS} data={post} />
                                    </div>
                                ) : [<p>Δεν υπάρχουν αποτελέσματα για εμφάνιση.</p>]*/}
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
