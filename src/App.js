import './App.css';
import React, { useState, useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Header from './components/other/Header';
import Sidebar from './components/dashboard/Sidebar';
import Posts from './components/dashboard/Posts';
import UserEdit from './components/user/UserEdit';
import User from './components/user/User';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import PostPage from './components/other/PostPage';
import SuggestionsPage from './components/dashboard/SuggestionsPage';
import { auth, db } from './firebase/fbConfig';
import history from './history';
import UserContext from './user-context';
import ProtectedRoute from './protected-route';

function App() {
  
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);

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

    return function cleanup() {
      setUserData([])
    }

  }, [user])

  // update posts on start
  useEffect(() => { 

    const getPosts = async () => {

      if (user && following) {

              await db
                  .collection('posts')
                  .limit(10)
                  .get()
                  .then(querySnapshot => {
                    const newPosts = []
                      
                      querySnapshot.docs.forEach(doc => {

                        if (following.includes(doc.data().username)) {

                          newPosts.push({
                            id: doc.id,
                            ...doc.data()
                          })

                        }   
                        
                      })
                    
                    setPosts(newPosts)
                    
                  })
                }
              
            }

    try {
      getPosts()
    } catch (error) {
      console.log(error)
    }

  }, [user, following]);

  useEffect(() => {

    const getFollowingUsers = async () => {
      await db.collection('users').doc(user?.uid).collection('following').get().then(querySnapshot => {
        const users = querySnapshot.docs.map(user => {
          return user.data().username
        })
  
        setFollowing(users)
      })
      
    }

    if (user) {
      getFollowingUsers()
    }

  }, [user])


  return (

    <UserContext.Provider value={{user}}>

      <Router history={history}>

        { user ? <Header user={user} userData={userData} history={history} /> : '' }

        <Switch>

          <ProtectedRoute exact path="/">
            <div className="app__globalWrapper">
              <Sidebar user={user} following={following} />
              <div className="app__contentWrapper">
                <Posts user={user} posts={posts} />
              </div> 
            </div>
          </ProtectedRoute>

          <Route path="/suggestions">
            <SuggestionsPage user={user} following={following} />
          </Route>

          <Route path="/p/:postId">
            <PostPage user={user} />
          </Route>

          <Route path="/:username/edit">
            <UserEdit user={user} />
          </Route>

          <Route path="/signup">
            <SignUpPage />
          </Route>

          <Route exact path="/login">
            <LoginPage />
          </Route>

          <Route exact path="/:username">
            <User user={user} />
          </Route>
          
        </Switch>

      </Router>

    </UserContext.Provider>
    
  );
}

export default App;
