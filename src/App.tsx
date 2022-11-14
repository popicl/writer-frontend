import React from 'react';
import './App.css';
import Home from './Home';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import MyPostsList from './MyPostsList';
import PostEdit from './PostEdit';
import PostList from './PostsList';

const App = () => {

  return (

    <Router>
     <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/my-posts' element={<MyPostsList />} />
        <Route path='/my-posts/:id' element={<PostEdit/>}/>
        <Route path='posts' element={<PostList/>} />
        </Routes>
  
    </Router>

  );
}

export default App;
