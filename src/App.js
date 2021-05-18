import './styles/App.css';
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Header from './components/other/Header';
import Sidebar from './components/dashboard/Sidebar';
import Posts from './components/dashboard/Posts';
import UserEdit from './components/user/UserEdit';
import User from './components/user/User';
import LoginPage from './components/auth/LoginPage';
import SignUpPage from './components/auth/SignUpPage';
import PostPage from './components/other/PostPage';
import { auth, db } from './firebase/fbConfig';
import history from './history';
import UserContext from './user-context';
import ProtectedRoute from './protected-route';

function App() {
  
  const [user, setUser] = useState(null);
  const [userData, setUserData] = useState([]);
  const [posts, setPosts] = useState([]);
  const [following, setFollowing] = useState([]);

  // update posts on start
  useEffect(() => { 

    const getPosts = async () => {

      if (following.length > 0) {

        for (let i = 0; i < following.length; i++) {

          const snapshot = await db.collection('posts').where('username', '==', following[i]?.username).get();
  
          const newPosts = snapshot.docs.map(post => ({
            id: post.id,
            ...post.data()
          }))
  
          setPosts(...posts, newPosts)
  
        }

      }

    }

    if (user) {
      getPosts()
    
      // db.collection('posts').onSnapshot(snapshot => {
      //   setPosts(snapshot.docs.map(doc => ({
      //     id: doc.id,
      //     post: doc.data()
      //   })))
      // })

    }

    return () => setPosts([])

  }, [user, following]);

  useEffect(() => {

    const getFollowingUsers = async () => {
      const followingSnap = await db.collection('users').doc(user?.uid).collection('following').get();

      const users = followingSnap.docs.map(user => ({
        ...user.data()
      }))

      setFollowing(users)
    }

    if (user) {
      getFollowingUsers()
    }

    return () => setFollowing([])

  }, [user])

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

    return () => (setUserData([]), setPosts([]))

  }, [user])



  return (

    <UserContext.Provider value={{user}}>

      <Router history={history}>

        { user ? <Header user={user} userData={userData} history={history} /> : '' }

        <Switch>

          <ProtectedRoute exact path="/">
            <div className="app__globalWrapper">
              <Sidebar user={user} userData={userData} />
              <div className="app__contentWrapper">
                <Posts user={user} posts={posts} />
              </div> 
            </div>
          </ProtectedRoute>

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
