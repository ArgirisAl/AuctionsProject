import React, { useEffect, useState, createContext } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
//import AuthService from '../_services/auth.service';

export default function PaginationNav(props) {
    const pageNumbers = [];
    
    for (let i = 1; i <= Math.ceil(props.totalPosts / props.postsPerPage); i++) {
        pageNumbers.push(i);
    }

    return (

        <div>
            <nav>
                <ul className="pagination">
                    {pageNumbers.map(number => (
                        <li className="page-item" key={number}>
                            <a onClick={() => props.paginate(number)}  className="page-link">{number}</a>
                        </li>
                    ))}
                </ul>
            </nav>
        </div>
    )

}