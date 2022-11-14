import React, { useEffect, useState } from 'react';
import './App.css';
import AppNavbar from './AppNavbar';
import { Link } from 'react-router-dom';
import { Button, Container } from 'reactstrap';
import { useCookies } from 'react-cookie';
import { User, defaultValueUser } from './model/user'

const Home = () => {

  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<User>(defaultValueUser);
  const [cookies] = useCookies(['XSRF-TOKEN']);

  useEffect(() => {
    setLoading(true);
    fetch('api/user', { credentials: 'include' })
      .then(response => response.text())
      .then(body => {
        if (body === '') {
          setAuthenticated(false);
        } else {
          setUser(JSON.parse(body));
          setAuthenticated(true);
        }
        setLoading(false);
      });
  }, [setAuthenticated, setLoading, setUser])

  const login = () => {
    let port = (window.location.port ? ':' + window.location.port : '');
    if (port === ':3000') {
      port = ':8080';
    }
    window.location.href = `//${window.location.hostname}${port}/private`;
  }

  const logout = () => {

    fetch('/api/logout', {
      method: 'POST', credentials: 'include',
      headers: {
        'X-XSRF-TOKEN': cookies['XSRF-TOKEN']
      }
    });
    // let port = (window.location.port ? ':' + window.location.port : '');
    // console.log('WINDOWS: ', window.location)
    // window.location.href = window.location.origin;
    // navigate('/private');
      // .then(res => res.json())
      // .then(response => {
      //   console.log(response);
      //   window.location.href = `${response.logoutUrl}?id_token_hint=${response.idToken}`
      //     + `&post_logout_redirect_uri=${window.location.origin}`;
      // });
  }


  const message = user ?
    <h2>Welcome, {user.userName}!</h2> :
    <p>Please log in to manage your Posts.</p>;

  const button = authenticated ?
    <div>
      <Button color="link"><Link to="/my-posts">Manage My Posts</Link></Button>
      <br />
      <Button color="link"><Link to="/posts">Public posts</Link></Button>
      <br />
      <Button color="link" onClick={logout}>Logout</Button>
    </div> :
    <Button color="primary" onClick={login}>Login</Button>;

  if (loading) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <AppNavbar />
      <Container fluid>
        {message}
        {button}
      </Container>
    </div>
  );
}

export default Home;