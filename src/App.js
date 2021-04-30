import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import Posts from './components/Posts';
import UserProfile from './components/UserProfile';
import UserEdit from './components/UserEdit';
import Profile from './components/Profile';
import LoginPage from './components/LoginPage';
import { auth, db } from './fbConfig';

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

        <Header user={user} userData={userData} />

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

          <Route exact path="/user">
            <UserProfile user={user} />
          </Route>

          <Route exact path="/:username/edit">
            <UserEdit user={user} />
          </Route>

          <Route path="/:username">
            <Profile user={user} />
          </Route>
          
        </Switch>

      </Router>

    </div>
    
  );
}

export default App;
