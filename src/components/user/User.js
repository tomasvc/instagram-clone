import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Modal } from "@material-ui/core";
import { db } from '../../firebase/fbConfig';
import firebase from 'firebase';
import './User.css';
import { makeStyles } from '@material-ui/core/styles';
import Skeleton from 'react-loading-skeleton';

function getModalStyle() {
    const top = 50;
    const left = 50;
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    };
  }
  
const useStyles = makeStyles((theme) => ({
paper: {
    position: 'absolute',
    maxWidth: '80%',
    minWidth: '300px',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '12px',
    outline: 0,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
    paddingBottom: 0
}
}));

export default function Profile({ user }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState(null);
    const { username } = useParams();

    const [openModal, setOpenModal] = useState(false);
    const [unfollowModal, setUnfollowModal] = useState(false);

    const [following, setFollowing] = useState([]);
    const [followers, setFollowers] = useState([]);

    const [isFollowingProfile, setIsFollowingProfile] = useState(null);

    useEffect(() => {

        async function getUser() {
            const snapshot = await db.collection('users').where('username', '==', username).get();
    
            const user = snapshot.docs.map(item => ({
                ...item.data(),
                docId: item.id
            }));
    
            setUserData(user[0])
    
        }

        async function getPosts() {

            const snapshot = await db.collection('posts').where('username', '==', username).get();
    
            const posts = snapshot.docs.map(item => ({ 
                ...item.data()
            }));
    
            setPosts(posts);
    
            if(document.querySelector('.user__posts').innerHTML === '') {
                for(let i = 0; i < posts.length; i++) {
                    document
                    .querySelector('.user__posts')
                    .innerHTML += `<div className="posts__post">
                                        <div id="post__shade"></div>
                                        <img className="post__image" src=${posts[i].imageUrl} />
                                    </div>`
                }
            }
        }

        async function getFollowInfo() {

            const followersSnap = await db.collection('users').doc(userData?.userId).collection('followers').get();
            const followingSnap = await db.collection('users').doc(userData?.userId).collection('following').get();

            setFollowers(followersSnap.doc?.data())
            setFollowing(followingSnap.doc?.data())

        }

        getUser()

        getPosts()

        getFollowInfo()

    }, [user])

    async function isUserFollowingProfile() {

        const snapshot = await db.collection('users').doc(user?.uid).collection('following').where('username', '==', userData?.username).get();

        const response = snapshot.docs.map(item => ({ 
            ...item.data()
        }))

        return response[0].id

    }

    
    async function updateFollows() {

    }
    

    const toggleFollow =  async () => {

        const isFollowing = isUserFollowingProfile()

        console.log(isFollowing)

        setIsFollowingProfile(!!isFollowing)

        console.log(isFollowingProfile)

        // if (isFollowing) {
        //     await db.collection('users').doc(user.uid).update({
        //         following: isFollowing
        //             ? firebase.firestore.FieldValue.arrayRemove(user.uid)
        //             : firebase.firestore.FieldValue.arrayUnion(user.uid)
        //     })
        //     await db.collection('users').doc(userData.userId).update({
        //         followers: isFollowing
        //             ? firebase.firestore.FieldValue.arrayRemove(user.uid)
        //             : firebase.firestore.FieldValue.arrayUnion(user.uid)
        //     })
        // }

        if (isFollowing) {

            await db.collection('users').doc(user.uid).collection('following').doc(userData.userId).set({ 
                id: userData.userId,
                username: userData.username,
                avatar: userData.avatarUrl
            })
    
            await db.collection('users').doc(userData.userId).collection('followers').doc(user.uid).set({
                id: user.uid,
                username: user.displayName,
                avatar: user.photoURL
            })

            document.querySelector('.buttons__follow-btn').style.display = 'none';
            document.querySelector('.right__buttons').innerHTML = `
                <button id="message-btn" className="buttons__message-btn" value="Message">Message</button>
                <button id="unfollow-btn" className="buttons__unfollow-btn"><span id="unfollow-icon"></span></button>
                <button id="arrow-btn" className="buttons__arrow-btn">
                    <svg aria-label="Down Chevron Icon" fill="#262626" height="12" viewBox="0 0 48 48" width="12">
                        <path d="M40 33.5c-.4 0-.8-.1-1.1-.4L24 18.1l-14.9 
                        15c-.6.6-1.5.6-2.1 0s-.6-1.5 0-2.1l16-16c.6-.6 
                        1.5-.6 2.1 0l16 16c.6.6.6 1.5 0 2.1-.3.3-.7.4-1.1.4z">
                        </path
                    </svg>
                </button>
                `
            document.getElementById('unfollow-btn').addEventListener("click", () => {
                setUnfollowModal(true)
            })

        } else {
            setUnfollowModal(false);

            db.collection('users').doc(user.uid).collection('following').doc(userData.userId).delete();

            db.collection('users').doc(userData.userId).collection('followers').doc(user.uid).delete();
        }
        
    }

    const onUnfollow = () => {
        setUnfollowModal(false);

        db.collection('users').doc(user.uid).collection('following').doc(userData.userId).delete();

        db.collection('users').doc(userData.userId).collection('followers').doc(user.uid).delete();

    }

    return (

        <div className="user__main">

            <Modal
                className="post__modal"
                open={openModal}
                onClose={() => setOpenModal(false)}
                >
                <div style={modalStyle} className={classes.paper}>
                    <center>
                        <div className="postModal__left"></div>
                        <div className="postModal__right"></div>
                    </center>
                </div>
            </Modal>

            <Modal
                className="post__modal"
                open={unfollowModal}
                onClose={() => setUnfollowModal(false)}
                >
                <div style={modalStyle} className={classes.paper}>
                    <center>
                        <div className="unfollowModal__header">
                            <Avatar src={ userData?.avatarUrl } className="unfollowModal__avatar"></Avatar>
                            <p>Unfollow @{username}?</p>
                        </div>
                        <h5 className="modal__btn unfollowModal__unfollow-btn" onClick={toggleFollow}>Unfollow</h5>
                        <h5 className="modal__btn unfollowModal__cancel-btn" onClick={() => setUnfollowModal(false)} >Cancel</h5>
                    </center>
                </div>
            </Modal>

            <div className="user__header">
                <div className="header__left">
                    { userData ? <Avatar src={ userData?.avatarUrl } className="left__avatar"></Avatar> :
                      <Skeleton className="skeleton-row" circle width={150} height={150}  />}
                    
                </div>
                <div className="header__right">
                    { userData ?
                    
                    <div className="right__name">
                    <span className="right__username">{ username }</span>
                    { userData?.userId === user?.uid ?
                        <div className="name__config">
                            <a href={user?.displayName + '/edit'} id="edit-btn" className="config__editBtn">Edit Profile</a>
                            <svg className="config__settingsBtn" height="24" viewBox="0 0 48 48" width="24">
                                <path d="M46.7 20.6l-2.1-1.1c-.4-.2-.7-.5-.8-1-.5-1.6-1.1-3.2-1.9-4.7-.2-.4-.3-.8-.1-1.2l.8-2.3c.2-.5 
                                0-1.1-.4-1.5l-2.9-2.9c-.4-.4-1-.5-1.5-.4l-2.3.8c-.4.1-.8.1-1.2-.1-1.4-.8-3-1.5-4.6-1.9-.4-.1-.8-.4-1-.8l-1.1-2.2c-.3-.5-.8-.8-1.3-.8h-4.1c-.6
                                0-1.1.3-1.3.8l-1.1 2.2c-.2.4-.5.7-1 .8-1.6.5-3.2 1.1-4.6 1.9-.4.2-.8.3-1.2.1l-2.3-.8c-.5-.2-1.1 0-1.5.4L5.9 8.8c-.4.4-.5 1-.4
                                1.5l.8 2.3c.1.4.1.8-.1 1.2-.8 1.5-1.5 3-1.9 4.7-.1.4-.4.8-.8 1l-2.1 1.1c-.5.3-.8.8-.8 1.3V26c0 .6.3 1.1.8 1.3l2.1 
                                1.1c.4.2.7.5.8 1 .5 1.6 1.1 3.2 1.9 4.7.2.4.3.8.1 1.2l-.8 2.3c-.2.5 0 1.1.4 1.5L8.8 42c.4.4 1 .5 1.5.4l2.3-.8c.4-.1.8-.1 
                                1.2.1 1.4.8 3 1.5 4.6 1.9.4.1.8.4 1 .8l1.1 2.2c.3.5.8.8 1.3.8h4.1c.6 0 1.1-.3 1.3-.8l1.1-2.2c.2-.4.5-.7 
                                1-.8 1.6-.5 3.2-1.1 4.6-1.9.4-.2.8-.3 1.2-.1l2.3.8c.5.2 1.1 0 1.5-.4l2.9-2.9c.4-.4.5-1 .4-1.5l-.8-2.3c-.1-.4-.1-.8.1-1.2.8-1.5 
                                1.5-3 1.9-4.7.1-.4.4-.8.8-1l2.1-1.1c.5-.3.8-.8.8-1.3v-4.1c.4-.5.1-1.1-.4-1.3zM24 41.5c-9.7 0-17.5-7.8-17.5-17.5S14.3 
                                6.5 24 6.5 41.5 14.3 41.5 24 33.7 41.5 24 41.5z"></path>
                            </svg>
                        </div>
                    :
                        <div className="right__buttons">
                            <button id="follow-btn" className="buttons__follow-btn" value="Follow" onClick={toggleFollow}>Follow</button>
                        </div>
                    }
                    
                </div>
                :
                <Skeleton className="skeleton-row" width={400} height={40} />
                }
                    { userData ? 
                    
                    <div className="header__top-info">
                    <p className="top-info__info-item"><span className="info-item__info-num">{ posts?.length }</span> posts</p>
                    <p className="top-info__info-item"><span className="info-item__info-num">{ followers?.length }</span> followers</p>
                    <p className="top-info__info-item"><span className="info-item__info-num">{ following?.length }</span> following</p>
                </div>

                : <Skeleton className="skeleton-row" width={400} height={20} />
                }
                    
                    { userData ? <p className="header__name">{ userData?.name }</p> : <Skeleton width={400} height={20} /> }
                    <p className="header__bio">{ userData?.bio }</p>
                    <a href={ userData?.website } className="header__website">{ userData?.website }</a>
                </div>
            </div>

            { userData &&
                <nav className="content__nav">
                    <a id="active" href=".">Posts</a>
                    <a href={'/' + userData?.username}>IGTV</a>
                    <a href={'/' + userData?.username}>Saved</a>
                    <a href={'/' + userData?.username}>Tagged</a>
                </nav>
            }
            

            <div className="user__posts">
            </div>
        </div>
    )
}