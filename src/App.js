import './App.css';
import React, { useState, useEffect } from 'react';
import { Router, Switch, Route } from 'react-router-dom';
import Header from './components/other/Header';
import Sidebar from './components/dashboard/Sidebar';
import Posts from './components/dashboard/Posts';
import UserEdit from './components/user/UserEdit';
import User from './components/user/User';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignupPage';
import PostPage from './components/other/PostPage';
import StoryPage from './components/other/StoryPage';
import Stories from './components/dashboard/Stories';
import SuggestionsPage from './components/dashboard/SuggestionsPage';
import { db } from './firebase/config';
import history from './history';
import { ProtectedRoute } from './protected-route';
import { useAuthListener } from './useAuth';
import UserContext from './userContext';


function App() {

  const { user } = useAuthListener();

  const [userData, setUserData] = useState([]);
  const [stories, setStories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  const [postsAreLoading, setPostsAreLoading] = useState(true);
  const [storiesAreLoading, setStoriesAreLoading] = useState(true);

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

      // only run if user is logged in and is following at least one other user
      if (user && following) {

              setPostsAreLoading(true)

              await db
                  .collection('posts')
                  .limit(20)
                  .get()
                  .then(querySnapshot => {

                    const newPosts = []
                      
                      querySnapshot.docs.forEach(doc => {

                        // check if snapshot contains posts of the users that the current user is following
                        if (following.includes(doc.data().username)) {

                          newPosts.push({
                            id: doc.id,
                            ...doc.data()
                          })

                        }   
                        
                      })
                    
                    setPosts(newPosts)
                    setPostsAreLoading(false)
                    
                  })
                }
              
            }

    try {
      getPosts()
    } catch (error) {
      console.log(error)
    }

  }, [user, following])


  useEffect(() => {

    const getStories = async () => {

      // only run if user is logged in and is following at least one other user
      if (user && following) {

              setStoriesAreLoading(true)

              await db
                  .collection('stories')
                  .limit(20)
                  .get()
                  .then(querySnapshot => {
                    const newStories = []
                      
                      querySnapshot.docs.forEach(doc => {
                        // check if snapshot contains posts of the users that the current user is following
                        // if (following.includes(doc.data().username)) {

                        //   newStories.push({
                        //     id: doc.id,
                        //     ...doc.data()
                        //   })

                        // }   

                        newStories.push({
                          id: doc.id,
                          ...doc.data()
                        })
                        
                      })
                    
                    setStories(newStories)
                    setStoriesAreLoading(false)
                    
                  })
                }
              
            }

    try {
      getStories()
    } catch (error) {
      console.log(error)
    }

  }, [user, following])


  // get an array of all the users the current user is following
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
              <Header history={history} userData={userData} />
              <div className="app__globalWrapper">
                <Sidebar following={following} />
                <div className="app__contentWrapper">
                  <Stories stories={stories} loading={storiesAreLoading} />
                  <Posts posts={posts} loading={postsAreLoading} />
                </div> 
              </div>
            </div>
          </ProtectedRoute>

          <ProtectedRoute user={user} path="/suggestions">
            <div>
              <Header history={history} userData={userData} />
              <SuggestionsPage following={following} />
            </div>
          </ProtectedRoute>
          
          <ProtectedRoute user={user} path="/p/:postId">
            <div>
              <Header history={history} userData={userData} />
              <PostPage />
            </div>
          </ProtectedRoute>

          <ProtectedRoute user={user} path="/stories/:username/:storyId">
            <div>
              {/* <Header history={history} userData={userData} /> */}
              <StoryPage />
            </div>
          </ProtectedRoute>
          
          <ProtectedRoute user={user} path="/:username/edit">
            <div>
              <Header history={history} userData={userData} />
              <UserEdit />
            </div>
          </ProtectedRoute>
          

          <Route path="/signup" component={SignUpPage} />

          <Route path="/login" component={LoginPage} />

          <ProtectedRoute user={user} path="/:username">
            <div>
              <Header history={history} userData={userData} />
              <User />
            </div>
          </ProtectedRoute>
          
          
        </Switch>

      </Router>

    </UserContext.Provider>
    
  );
}

export default App;
