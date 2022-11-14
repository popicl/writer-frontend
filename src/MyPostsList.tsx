import React, { useEffect, useState } from 'react';
import { Button, ButtonGroup, Container, Table, Pagination, PaginationLink, PaginationItem } from 'reactstrap';
// import Pagination from 'react-bootstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useCookies } from 'react-cookie';
import { Post } from './model/post.js';

export const MyPostsList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);

    const pageSizes = [1, 2, 3, 5, 10];
    const [cookies] = useCookies(['XSRF-TOKEN']);

    useEffect(() => {
        setLoading(true);
        fetch(`api/my-posts/${page}/${pageSize}`)
            .then(response => response.json())
            .then(data => {
                setPosts(data.posts);
                setCurrentPage(data.currentPage);
                setPagesCount(data.totalPages);
                setLoading(false);
            })
    }, [page, pageSize]);

    const remove = async (id: number) => {
        await fetch(`api/post/${id}`, {
            method: 'DELETE',
            headers: {
                'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            credentials: 'include'
        })
            .then(() => {
                let updatePosts = [...posts].filter(post => post.id !== id);
                setPosts(updatePosts);
            });
    }


    const handlePageChange = (event: React.MouseEvent<HTMLAnchorElement, MouseEvent>, value: number) => {
        setPage(value + 1);
    };

    const handlePageSizeChange = (event: any) => {
        setPageSize(event.target.value);
        setPage(1);
    };

    // if (loading) {
    //     return 'Loading...'
    // }

    const postsList = posts.map(post => {
        return <tr key={post.id}>
            <td style={{ whiteSpace: 'nowrap' }}>{post.postName}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{post.private === true ? 'Yes' : 'No'}</td>
            <td><MarkdownEditor.Markdown source={post.content} /></td>
            <td>{post.createdDate}</td>
            <td>
                <ButtonGroup>
                    <Button size="sm" color="primary" tag={Link} to={"/my-posts/" + post.id}>Edit</Button>
                    <Button size="sm" color="danger" onClick={() => remove(post.id || 0)}>Delete</Button>
                </ButtonGroup>
            </td>

        </tr>
    });

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <div className="float-end">
                    <Button color="success" tag={Link} to="/my-posts/new">Add Post</Button>
                </div>
                <h3>My Posts</h3>
                <div className="mt-3">
                    {"Items per Page: "}
                    <select onChange={handlePageSizeChange} value={pageSize}>
                        {pageSizes.map((size) => (
                            <option key={size} value={size}>
                                {size}
                            </option>
                        ))}
                    </select>


                </div>
                <br />
                <div>
                    <Pagination size="sm">
                        {[...Array(pagesCount)].map((page, i) => (
                            <PaginationItem active={i === currentPage} key={i}>
                                <PaginationLink onClick={(e) => handlePageChange(e, i)} href="#">
                                    {i + 1}
                                </PaginationLink>
                            </PaginationItem>
                        ))}
                    </Pagination>
                </div>

                <Table className="mt-4">
                    <thead>
                        <tr>
                            <th style={{ width: "20%" }}>Name</th>
                            <th style={{ width: "20%" }}>Is Private</th>
                            <th style={{ width: "20%" }}>Markdown</th>
                            <th style={{ width: "20%" }}>Created Date</th>
                            <th style={{ width: "20%" }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {postsList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );


};

export default MyPostsList;


