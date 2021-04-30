import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Modal } from "@material-ui/core";
import { db } from '../fbConfig';
import './Profile.css';
import '../App.css';
import { makeStyles } from '@material-ui/core/styles';

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
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '12px',
    outline: 0,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
}
}));

export default function Profile({ user }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);
    
    const [userData, setUserData] = useState(null);
    const [posts, setPosts] = useState(null);
    const { username } = useParams();

    const [openModal, setOpenModal] = useState(false);

    useEffect(() => {
        if (!userData) {
            getUser()
        }

        if (!posts) {
            getPosts()
        }
    }, [userData, posts])

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

        console.log(posts)

        if(document.querySelector('.user__posts').innerHTML === '') {
            for(let i = 0; i < posts.length; i++) {
                document
                .querySelector('.user__posts')
                .innerHTML += `<div className="posts__post">
                                    <div id="post__shade"></div>
                                    <img src=${posts[i].imageUrl} />
                                </div>`
            }
        }
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

            <div className="user__top">
                <Avatar src={ userData?.avatarUrl } className="user__avatar"></Avatar>
                <div className="user__topRight">
                    <div className="user__topName">
                        <span className="user__username">{ userData?.username }</span>
                        { userData?.username === user?.displayName ?
                            <div className="user__config">
                                <a href={userData?.username + '/edit'} className="user__editBtn">Edit Profile</a>
                                <svg className="user__settingsBtn" height="24" viewBox="0 0 48 48" width="24">
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
                        ''
                        }
                        
                    </div>
                    <div className="user__topInfo">
                        <p className="user__info"><span className="user__infoNum">{ posts?.length }</span> posts</p>
                        <p className="user__info"><span className="user__infoNum">{ userData?.followers }</span> followers</p>
                        <p className="user__info"><span className="user__infoNum">{ userData?.following }</span> following</p>
                    </div>
                    <p className="user__name">{ userData?.name }</p>
                    <p className="user__bio">{ userData?.bio }</p>
                    <a href={ userData?.website } className="user__website">{ userData?.website }</a>
                </div>
            </div>

            <div className="user__bottom">
                <nav className="user__nav">
                    <a className="active" href=".">Posts</a>
                    <a href={'/' + userData?.username}>IGTV</a>
                    <a href={'/' + userData?.username}>Saved</a>
                    <a href={'/' + userData?.username}>Tagged</a>
                </nav>
            </div>

            <div className="user__posts">
            </div>
        </div>
    )
}
