import React, { useEffect, useState, useMemo } from 'react';
import { useNavigate, NavLink, Link } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import { Container, Form, InputGroup, Button, Row, Col } from "react-bootstrap";
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






export default function SearchAuctions() {
    const navigate = useNavigate();
    const [currentUser, setCurrentUser] = useState(undefined);
    const [error, setError] = useState("");
    const [categories, setCategories] = useState([]);


    //filters
    const [auctionsCategoryFilter, setAuctionsCategoryFilter] = useState(false);
    const [searchAuctionsFilter, setSearchAuctionsFilter] = useState("");


    const handleChange = e => {

        setAuctionsCategoryFilter(e.target.value);
        //console.log(e.target.value);
    };

    const handleSearch = e => {

        setSearchAuctionsFilter(e.target.value);
        //console.log(e.target.value);
    };

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

        const fetchCategories = async () => {
            try {
                const response = await axios.get("http://localhost:1337/getCategories");


                //setCategories(response.data.data);
                //setCategories(oldArray => [...oldArray, { "CATEGORIES": 0, "NAME": 'Επιλογή κατηγορίας' }]);

                setCategories(response.data.data);
                setCategories(oldArray => [...oldArray, { "CATEGORIES": 0, "NAME": 'Καμία Κατηγορία' }]);
            } catch (error) {
                setError(error.message);
            } finally {
                
            }
        }
        fetchCategories();

    }, []);

    //console.log(auctionsCategoryFilter);

    return (
        <div>
            {currentUser ? (
                <div  style={{

                }}>




                    <Form style={{ display: 'flex' }}>

                        <Form.Control
                            as="select"
                            type="text"
                            placeholder="Επιλογή κατηγορίας"
                            onChange={handleChange}
                        >

                            <option className="d-none" value="">
                                Επιλογή κατηγορίας
                            </option>
                            {categories && categories.map((e, CATEGORIES) => {
                                
                                return <option key={CATEGORIES} value={e.CATEGORIES}>{e.NAME}</option>;
                            })}


                        </Form.Control>


                        <InputGroup onChange={handleSearch}>
                                <Form.Control
                                    placeholder="Search"
                                    aria-label="Search"
                                    aria-describedby="basic-addon2"
                                />
                                <Button variant="outline-secondary" id="button-addon2">
                                    Search
                                </Button>
                        </InputGroup>

                    </Form>







                    {auctionsCategoryFilter > 0 ? (
                        <div>

                            <Pagination url={"http://localhost:1337/getAuctions"} auctionsCategoryFilter={auctionsCategoryFilter} searchAuctionsFilter={searchAuctionsFilter} auctions={true} postsPerPage={5} />
                        </div>
                    ) : (
                        <div>
                                <Pagination url={"http://localhost:1337/getAuctions"} auctionsCategoryFilter={auctionsCategoryFilter} searchAuctionsFilter={searchAuctionsFilter} auctions={true} postsPerPage={5} />
                        </div>
                    )}


                </div>

            ) : (
                <div>
                        <Pagination url={"http://localhost:1337/getAuctions"} auctions={true} postsPerPage={5} />
                </div>
            )}
        </div>
    );


}