import { BrowserRouter, Router, Routes, Route, Link, NavLink, Switch } from 'react-router-dom';
import { Navigate } from 'react-router-dom';
import React, { Component } from 'react'

import userService from '../_services/UserService';
import AuthService from '../_services/AuthService';


class BoardUser extends Component {
    constructor(props) {
        super(props);
        this.state = {
            content: "User",
            currentUser: undefined
        };
    }

    componentDidMount() {
        const user = AuthService.getCurrentUser();
        if (user) {
            this.setState({
                currentUser: AuthService.getCurrentUser()
            });
        }
        userService.getUserBoard().then(
            response => {
                this.setState({
                    content: response.data
                });
            },
            error => {
                const resMessage =
                    (error.response &&
                        error.response.data &&
                        error.response.data.message) ||
                    error.message ||
                    error.toString();

                this.setState({
                    message: resMessage,
                    successful: false
                });
            }
        );
    }


    render() {
        const { currentUser } = this.state;
        return (
            <div>
                {currentUser ? (
                    <div className="container">
                        <header className="jumbotron">
                            <h3>
                                {this.state.content}
                            </h3>
                        </header>
                    </div>
                ) : <p>Login First!</p>
                }
            </div>

        );
    }
}

export default BoardUser;