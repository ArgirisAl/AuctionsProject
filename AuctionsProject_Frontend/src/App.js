import React, { Component, useState, createContext } from 'react'
import { BrowserRouter, Router, Routes, Route, Link, NavLink, Switch, Navigate } from 'react-router-dom';
import { render } from "react-dom";
import axios from 'axios';




import 'bootstrap/dist/css/bootstrap.min.css';
import "./App.css"

import AuthService from './_services/AuthService';
import Home from "./_components/HomeComponent";
import UserProfile from "./_components/ProfileUserComponent";
import BoardUser from "./_components/BoardUserComponent";
import BoardModerator from "./_components/BoardModeratorComponent";
import BoardAdmin from "./_components/BoardAdminComponent";
import AuthForm from "./_components/FormAuthComponent";
import Login from "./_components/LoginComponent";
import Register from "./_components/RegisterComponent";
import Notfound from "./_components/_pages/NotFound";
import NavBar from "./_components/_pageStructure/NavbarComponent";
import Footer from "./_components/_pageStructure/FooterComponent";

//Tutorial link
//https://www.youtube.com/watch?v=tNcWX9qPcCM&t=2s

class App extends Component {

    

    render() {
        return (
            <div
                style={{
                }}
            >
                <div>
                    <NavBar />
                </div>


                
                <div
                    style={{
                    }}
                >
                    {/*<Footer />*/ } 
                </div>
                


            </div>
        );
    }
}

export default App;
