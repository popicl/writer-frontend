import React, { useEffect, useState } from 'react';
import { Button, Container, Table, Pagination, PaginationLink, PaginationItem } from 'reactstrap';
// import Pagination from 'react-bootstrap';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { Post } from './model/post.js';

const PostList = () => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [pageSize, setPageSize] = useState(3);
    const [currentPage, setCurrentPage] = useState(1);
    const [pagesCount, setPagesCount] = useState(1);

    const pageSizes = [1, 2, 3, 5, 10];

    useEffect(() => {
        setLoading(true);
        fetch(`api/posts/${page}/${pageSize}`)
            .then(response => response.json())
            .then(data => {
                console.log('DATA: ', data)
                setPosts(data.posts);
                setCurrentPage(data.currentPage);
                setPagesCount(data.totalPages);
                setLoading(false);
            })
    }, [page, pageSize]);

    const handlePageChange = (event: any, value: number) => {
        console.log(value)
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
            <td style={{ whiteSpace: 'nowrap' }}>{post?.user?.userName || post?.user?.email || ''}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{post?.postName || ''}</td>
            <td style={{ whiteSpace: 'nowrap' }}>{post?.private === true ? 'Yes' : 'No'}</td>
            <td><MarkdownEditor.Markdown source={post.content} /></td>
            <td>{post.createdDate}</td>
                    </tr>
    });

    return (
        <div>
            <AppNavbar />
            <Container fluid>
                <h3>Public Posts</h3>
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
                            <th style={{width:"20%"}}>User Name</th>
                            <th style={{width:"20%"}}>Post Name</th>
                            <th style={{width:"20%"}}>Is Private</th>
                            <th style={{width:"20%"}}>Markdown</th>
                            <th style={{width:"20%"}}>Created Date</th>

                        </tr>
                    </thead>
                    <tbody>
                        {postsList}
                    </tbody>
                </Table>
            </Container>
        </div>
    );

}

export default PostList;