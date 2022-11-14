import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { Button, Container, Form, FormGroup, Input, Label } from 'reactstrap';
import AppNavbar from './AppNavbar';
import MarkdownEditor from '@uiw/react-markdown-editor';
import { useCookies } from 'react-cookie';
// import { User } from './model/user';
// import { Post } from './model/post';

const PostEdit = () => {
  const initialFormState = {
    id: 0,
    postName: '',
    content: '',
    private: true
  };
  const [post, setPost] = useState(initialFormState);
  const [content, setContent] = useState("");
  const navigate = useNavigate();
  const { id } = useParams();

  const [cookies] = useCookies(['XSRF-TOKEN']);

  useEffect(() => {
    if (id !== 'new') {
      fetch(`/api/post/${id}`)
        .then(response => response.json())
        .then(data => {
          setPost(data);
          // console.log(data);
          // setPrivate(data.private);
        });
    }
  }, [id, setPost]);

  const handleChange = (event: any) => {
    const { name, value } = event.target
    setPost({ ...post, [name]: value });
  }

  const handleContentChange = (event: any) => {
    setContent(event);
  };

  const handlePrivateChange = (event: any) => {
    setPost({
      ...post,
      private: !post.private
    });
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();

    post.content = content;

    await fetch('/api/post' + (post.id ? '/' + post.id : ''), {
      method: (post.id) ? 'PUT' : 'POST',
      headers: {
        'X-XSRF-TOKEN': cookies['XSRF-TOKEN'],
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(post),
      credentials: 'include'
    });
    setPost(initialFormState);
    navigate('/my-posts');
  }

  const title = <h2>{post.id ? 'Edit Post' : 'Add Post'}</h2>;

  return (<div>
    <AppNavbar />
    <Container>
      {title}
      <Form onSubmit={handleSubmit}>
        <FormGroup>
          <Label for="postName">Post Name</Label>
          <Input type="text" name="postName" id="napostNameme" value={post.postName || ''}
            onChange={handleChange} autoComplete="postName" />
        </FormGroup>
        <FormGroup>
          <Label for="content">Markdown</Label>
          <MarkdownEditor
            value={post.content}
            onChange={handleContentChange}
          />
          {/* <Input type="text" name="content" id="content" value={post.content || ''}
                   onChange={handleChange} autoComplete="content-level1"/> */}
        </FormGroup>
        <FormGroup>
          <Label for="private"> Is Private </Label>
          <Input type="checkbox" name="private" id="private"
            defaultChecked={post.private || true}
            // checked={post.private || true}
            // value={post.private || true}
            onChange={handlePrivateChange} />
        </FormGroup>
        <FormGroup>
          <Button color="primary" type="submit">Save</Button>{' '}
          <Button color="secondary" tag={Link} to="/my-posts">Cancel</Button>
        </FormGroup>
      </Form>
    </Container>
  </div>
  )
};

export default PostEdit;