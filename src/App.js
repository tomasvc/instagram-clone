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
import { db } from './firebase/config';
import history from './history';
import { ProtectedRoute } from './protected-route';
import { useAuthListener } from './useAuth';
import UserContext from './userContext';

function App() {

  const { user } = useAuthListener();

  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);


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
                  .limit(20)
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
      await db
              .collection('users')
              .doc(user?.uid)
              .collection('following')
              .get()
              .then(querySnapshot => {
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

        

        <Switch>

          <ProtectedRoute user={user} path="/" exact>
            <div>
              <Header user={user} userData={userData} history={history} />
              <div className="app__globalWrapper">
                <Sidebar user={user} following={following} />
                <div className="app__contentWrapper">
                  <Posts user={user} posts={posts} />
                </div> 
              </div>
            </div>
          </ProtectedRoute>

          <ProtectedRoute user={user} path="/suggestions">
            <div>
              <Header user={user} userData={userData} history={history} />
              <SuggestionsPage user={user} following={following} />
            </div>
          </ProtectedRoute>
          
          <ProtectedRoute user={user} path="/p/:postId">
            <div>
              <Header user={user} userData={userData} history={history} />
              <PostPage user={user} />
            </div>
          </ProtectedRoute>
          
          <ProtectedRoute user={user} path="/:username/edit">
            <div>
              <Header user={user} userData={userData} history={history} />
              <UserEdit user={user} />
            </div>
          </ProtectedRoute>
          

          <Route path="/signup" component={SignUpPage} />

          <Route path="/login" component={LoginPage} />

          <ProtectedRoute user={user} path="/:username">
            <div>
              <Header user={user} userData={userData} history={history} />
              <User user={user} />
            </div>
          </ProtectedRoute>
          
          
        </Switch>

      </Router>

    </UserContext.Provider>
    
  );
}

export default App;
