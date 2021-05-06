import './styles/App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/other/Header';
import Sidebar from './components/dashboard/Sidebar';
import Posts from './components/dashboard/Posts';
import UserEdit from './components/user/UserEdit';
import User from './components/user/User';
import LoginPage from './components/auth/LoginPage';
import PostPage from './components/other/PostPage';
import { auth, db } from './firebase/fbConfig';

function App() {
  
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);

  // update posts on start
  useEffect(() => {
    db.collection('posts').onSnapshot(snapshot => {
      setPosts(snapshot.docs.map(doc => ({
        id: doc.id,
        post: doc.data()
      })))
    })
  }, []);


  // get auth state of user
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((authUser) => {
      if (authUser) {
        // user has logged in
        setUser(authUser);
      } else {
        // user has logged out
        setUser(null);
      }
    })

    return () => {
      // perform some cleanup actions before you refire the useEffect
      unsubscribe();
    }
  }, [user])


  // get current user data
  useEffect(() => {
    if (user) {
            db
            .collection('users')
            .doc(user.uid)
            .get()
            .then(doc => {
                setUserData(doc.data())
            }) 
    }
  }, [user])



  return (

    <div className="app">

      <Router>

      { user ? <Header user={user} userData={userData} /> : '' }

        <Switch>

          <Route exact path="/">

            { user ? 
            
            <div className="app__globalWrapper">
              <Sidebar user={user} userData={userData} />
              <div className="app__contentWrapper">
                <Posts user={user} posts={posts} />
              </div> 
            </div>
            
            : <LoginPage /> }

            
          </Route>

          <Route path="/p/:postId">
            <PostPage user={user} />
          </Route>

          <Route path="/:username/edit">
            <UserEdit user={user} />
          </Route>

          <Route exact path="/:username">
            <User user={user} />
          </Route>
          
        </Switch>

      </Router>

    </div>
    
  );
}

export default App;
