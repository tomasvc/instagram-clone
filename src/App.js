import './App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/Header';
import Aside from './components/Aside';
import Posts from './components/Posts';
import UserPage from './components/UserPage';
import { auth, db } from './firebase';

function App() {
  
  const [user, setUser] = useState(null);
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



  return (
    <div className="app">

      <Router>
        <Header user={user} />

        <Switch>

          <Route exact path="/">
            <div className="app__globalWrapper">
              <Aside user={user} />
              <div className="app__contentWrapper">
                <div className="app__stories"></div>
                <Posts user={user} posts={posts} />
              </div> 
            </div>
          </Route>

          <Route exact path="/user">
            <UserPage />
          </Route>
          
        </Switch>

      </Router>

    </div>
  );
}

export default App;
