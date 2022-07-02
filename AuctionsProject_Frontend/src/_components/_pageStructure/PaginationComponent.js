import React, { useEffect, useState, useMemo } from 'react'
import 'bootstrap/dist/css/bootstrap.min.css';
import axios from 'axios';
import AuthService from '../../_services/AuthService';
import { GetAuctions } from '../../_services/GetDataService';
import UsersList from './PaginationUsersList';
import AuctionsPosts from './PaginationAuctionsList';
import PaginationNav from './PaginationFunctionality';

//https://www.youtube.com/watch?v=6EF_8LbNy0c


export default function Pagination(props) {

    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage, setPostsPerPage] = useState(props.postsPerPage);
    const [error, setError] = useState("");



    useEffect(() => {
        const fetchPosts = async () => {
            try {
                const response = await axios.get(props.url);
                setPosts(response.data.data);
                setLoading(false);
            } catch (error) {
                setError(error.message);
            } finally {
            }
        }
        fetchPosts();
    }, []);

    //console.log(posts);

    const indexOfLastPost = currentPage * postsPerPage;
    const indexOfFirstPost = indexOfLastPost - postsPerPage;
    const currentPost = posts.slice(indexOfFirstPost, indexOfLastPost);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    return (
        <div>
            {props.users && (
                <div>
                    <div className="container">
                        <UsersList posts={currentPost} allUsers={props.allUsers} loading={loading} />
                        <PaginationNav postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
                    </div>
                </div>
            )}
            {props.auctions && (
                <div>
                    <div className="container">
                        <AuctionsPosts posts={currentPost} auctionsCategoryFilter={props.auctionsCategoryFilter} searchAuctionsFilter={props.searchAuctionsFilter} loading={loading} />
                        <PaginationNav postsPerPage={postsPerPage} totalPosts={posts.length} paginate={paginate} />
                    </div>
                </div>
            )}
        </div>

    );


}
