import React, { useState, useEffect, useContext } from 'react';
import { db } from '../../../firebase/config';
import firebase from 'firebase/app';
import { Avatar, Modal } from "@material-ui/core";
import { makeStyles } from '@material-ui/core/styles';
import UserContext from '../../../userContext';
import Skeleton from 'react-loading-skeleton';
import Hammer from 'hammerjs';
import './styles.css';

// modal styles for Material-UI modal
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
    minHeight: '200px',
    backgroundColor: theme.palette.background.paper,
    border: 'none',
    borderRadius: '12px',
    outline: 0,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 2, 3),
}
}));


// The Post component controls the display and functionality of an individual post. 

export default function Post({ postId }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const { user } = useContext(UserContext)

    const [post, setPost] = useState([]);

    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState('');
    const [likes, setLikes] = useState([]);
    const [openLikes, setOpenLikes] = useState(false);


    // gets a single post using its ID
    useEffect(() => {

        async function getPost() {

            const snapshot = await db.collection('posts').doc(postId).get();
    
            setPost(snapshot.data())
    
        }

        getPost()

    }, [postId, user])


    // add comments to post
    useEffect(() => {

        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map(doc => doc.data()));
                })
        }

        return () => {
            unsubscribe();
        };

    }, [postId, user]);


    // add likes to post
    useEffect(() => {
        
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("likes")
                .orderBy('timestamp', 'desc')
                .onSnapshot((snapshot) => {
                    setLikes(snapshot.docs.map(doc => doc.data()));
                })
        }

        return () => {
            unsubscribe();
        }

    }, [postId, user]);


    // This code updates the avatar and profile image of the user inside the modals if either are changed in the edit page.
    // Not an ideal way to do it but couldn't figure out how to access the data any other way.
    useEffect(() => {

        const getLikesAndComments = async () => {
            if (postId) {
                await db
                    .collection('posts')
                    .doc(postId)
                    .collection('likes')
                    .where('username', '==', user?.displayName)
                    .get()
                    .then(snapshot => {
    
                    let batch = db.batch()
        
                    snapshot.docs.forEach(doc => {
                        const docRef = db.collection('posts').doc(postId).collection('likes').doc(doc.id)
                        batch.update(docRef, { username: user?.displayName, avatar: user?.photoURL })
                    })
                    batch.commit()
        
                })
                .catch(error => {
                    console.error(error)
                })
        
                await db
                    .collection('posts')
                    .doc(postId)
                    .collection('comments')
                    .where('username', '==', user?.displayName)
                    .get()
                    .then(snapshot => {
        
                    let batch = db.batch()
        
                    snapshot.docs.forEach(doc => {
                        const docRef = db.collection('posts').doc(postId).collection('comments').doc(doc.id)
                        batch.update(docRef, { username: user?.displayName, avatar: user?.photoURL })
                    })
                    batch.commit()
        
                })
                .catch(error => {
                    console.error(error)
                })
            }
        }
        
        try {
            getLikesAndComments()
        } catch (error) {
            console.error(error)
        }
    
        return function cleanup() {
            setPost(null)
        }
        
    }, [user, postId])


    // Changes heart icon based on whether user has already liked the post
    useEffect(() => {

        if (localStorage.getItem(postId) !== undefined && localStorage.getItem(postId) === user?.displayName) {
            document.getElementById(postId).childNodes[2].firstChild.classList.add("like")
            document.getElementById(postId).childNodes[2].firstChild.firstChild.setAttribute("d", "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z")
        }

    }, [user, postId])


    // Post comment and store in database
    const postComment = (event) => {

        event.preventDefault();

        db.collection("posts").doc(postId).collection("comments").add({
            text: comment,
            username: user.displayName,
            avatar: user.photoURL,
            timestamp: firebase.firestore.FieldValue.serverTimestamp()
        });

        db.collection("posts").doc(postId).update({
            comments: firebase.firestore.FieldValue.increment(1)
        })

        setComment('');

    } 


    // Show an animated heart on top of image when user likes a post
    const showHeart = () => {

        document.getElementById(postId).childNodes[1].childNodes[1].classList.add('showHeart')  
        setTimeout(() => {
            document.getElementById(postId).childNodes[1].childNodes[1].classList.remove('showHeart')
        }, 1000)  

    }

    const likePost = async () => {    

             await db.collection("posts").doc(postId).collection("likes").get().then(snapshot => {

                var itemsProcessed = 0;
    
                // if 'likes' collection is not empty
                if(snapshot.docs.length !== 0) {
    
                    snapshot.docs.forEach(doc => {
    
                        // if user is in the 'likes' collection, or if user has liked the post
                        if (doc.data().username === user.displayName) {
    
                            document.getElementById(postId).childNodes[2].firstChild.classList.remove("like")
                            document.getElementById(postId).childNodes[2].firstChild.firstChild.setAttribute("d", "M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z")
    
                            // remove user from collection, or unlike post
                            doc.ref.delete()

                            // remove post id from local storage
                            localStorage.removeItem(postId)

                            setTimeout(async () => {
                                await db.collection("posts").doc(postId).update({
                                    likes: firebase.firestore.FieldValue.increment(-1)
                                })
                            }, 0)

                            
                        } else {
    
                            // eslint-disable-next-line no-unused-vars
                            itemsProcessed++;
    
                            // if 'likes' collection does not contain user, add user, or like post
                            if(itemsProcessed === snapshot.docs.length) {
    
                                document.getElementById(postId).childNodes[2].firstChild.classList.add("like")
                                document.getElementById(postId).childNodes[2].firstChild.firstChild.setAttribute("d", "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z")
    
                                // add user, post is liked
                                db.collection("posts").doc(postId).collection("likes").add({
                                    username: user?.displayName,
                                    avatar: user?.photoURL,
                                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                                }); 

                                // add post id to local storage
                                localStorage.setItem(postId, user?.displayName)

                                setTimeout(async () => {
                                    await db.collection("posts").doc(postId).update({
                                        likes: firebase.firestore.FieldValue.increment(1)
                                    })
                                }, 0)
    
                            }
                            return
                        }
                    })
    
                // if like collections is empty
                } else {

                    document.getElementById(postId).childNodes[2].firstChild.classList.add("like")
                    document.getElementById(postId).childNodes[2].firstChild.firstChild.setAttribute("d", "M34.6 3.1c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 7.6 6.5.5.3 1.1.5 1.6.5s1.1-.2 1.6-.5c1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z")
    
                    // add user, like post
                    db.collection("posts").doc(postId).collection("likes").add({
                        username: user.displayName,
                        avatar: user.photoURL,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    }); 

                    db.collection("posts").doc(postId).update({
                        likes: firebase.firestore.FieldValue.increment(1)
                    })
    
                }

                setLikes(snapshot.docs.map(doc => ({
                    username: doc.username,
                    avatar: doc.avatar,
                    timestamp: doc.timestamp
                })))
            })
        
    }

    // Below is a custom library called Hammer that would enable the user to double tap to like an image.
    // The JS double tap event handler works fine on web browsers but it's not supported on touchscreen devices, 
    // so I've had to use a custom library. Can't get it to work though :(
    
    // if (document.querySelector('.post__imageContainer')) {
    //     let image = document.querySelector('.post__imageContainer');
    //     let manager = new Hammer.Manager(image)
    //     let DoubleTap = new Hammer.Tap({
    //         event: 'doubletap',
    //         taps: 2
    //     });

    //     manager.add(DoubleTap);

    //     if (post) {
    //         manager.on('doubletap', (e) => {
    //             e.target.className.showHeart();
    //             e.target.className.likePost();
    //         });
    //     }
    // }
    

    
    return (
        
        <div className="post" id={postId}>

            {/* Create a modal to show likes */}
            <Modal 
                className="post__modal"
                open={openLikes}
                onClose={() => setOpenLikes(false)}
                >
                <div style={modalStyle} className={classes.paper}>
                    <center>
                    <h4 className="modal__label">Likes</h4>

                        {likes.map(like => {
                            return <div className="modal__user" key={like?.username}>
                                        <div className="user__left">
                                            <a href={'/' + like?.username}>
                                                <Avatar
                                                    className="modal__avatar"
                                                    src={like?.avatar}
                                                    alt=""
                                                />
                                            </a>
                                            <div>
                                                <a href={'/' + like?.username}>
                                                    <p className="modal__username">{like?.username}</p>
                                                </a>
                                                <p className="modal__name">{like?.name}</p>
                                            </div>
                                        </div>
                                        <button className="modal__followBtn">Follow</button>
                                    </div>
                        })}

                    </center>
                </div>
            </Modal>

            {/* Post header */}
            <div className="post__header">
                
                    <a href={'/' + post?.username}>
                        <Avatar
                            className="post__avatar"
                            src={post?.avatar}
                            alt=""
                        />
                    </a>

                <a href={'/' + post?.username}>
                    { post?.username ? <h4 className="post__username">{post?.username}</h4> : <Skeleton className="post__username" width={200} height={12} /> }
                </a>

            </div>

            {/* The image */}
            <div className="post__imageContainer" onDoubleClick={() => {showHeart(); likePost()}}>
            { post?.imageUrl ? <img className="post__image" src={post?.imageUrl} alt="" /> : <Skeleton maxWidth={550} height={750} /> }
                <div className="post__imageHeart" ></div>
            </div>

            {/* Buttons */}
            <div className="post__buttons">
                <svg className="post__like" fill="#262626" aria-label="like" height="24" viewBox="0 0 48 48" width="24" onClick={() => {showHeart(); likePost()}}>
                    <path id="button__likePath" d="M34.6 6.1c5.7 0 10.4 5.2 10.4 11.5 0 6.8-5.9 11-11.5 16S25 
                    41.3 24 41.9c-1.1-.7-4.7-4-9.5-8.3-5.7-5-11.5-9.2-11.5-16C3 11.3 7.7 
                    6.1 13.4 6.1c4.2 0 6.5 2 8.1 4.3 1.9 2.6 2.2 3.9 2.5 3.9.3 0 .6-1.3 2.5-3.9 
                    1.6-2.3 3.9-4.3 8.1-4.3m0-3c-4.5 0-7.9 1.8-10.6 5.6-2.7-3.7-6.1-5.5-10.6-5.5C6 
                    3.1 0 9.6 0 17.6c0 7.3 5.4 12 10.6 16.5.6.5 1.3 1.1 1.9 1.7l2.3 2c4.4 3.9 6.6 5.9 
                    7.6 6.5.5.3 1.1.5 1.6.5.6 0 1.1-.2 1.6-.5 1-.6 2.8-2.2 7.8-6.8l2-1.8c.7-.6 1.3-1.2 
                    2-1.7C42.7 29.6 48 25 48 17.6c0-8-6-14.5-13.4-14.5z">
                    </path>
                </svg>
                <a href={'/p/' + postId}><svg aria-label="comment" fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                    <path d="M47.5 46.1l-2.8-11c1.8-3.3 2.8-7.1 2.8-11.1C47.5 11 37 .5 24 .5S.5 11 .5 
                    24 11 47.5 24 47.5c4 0 7.8-1 11.1-2.8l11 2.8c.8.2 1.6-.6 1.4-1.4zm-3-22.1c0 4-1 7-2.6 
                    10-.2.4-.3.9-.2 1.4l2.1 8.4-8.3-2.1c-.5-.1-1-.1-1.4.2-1.8 1-5.2 2.6-10 2.6-11.4 
                    0-20.6-9.2-20.6-20.5S12.7 3.5 24 3.5 44.5 12.7 44.5 24z">
                    </path>
                </svg></a>
                <svg aria-label="share-post" fill="#262626" height="24" viewBox="0 0 48 48" width="24" onClick={() => alert("Share doesn't do anything but just pretend it does")}>
                    <path d="M47.8 3.8c-.3-.5-.8-.8-1.3-.8h-45C.9 3.1.3 3.5.1 4S0 5.2.4 5.7l15.9 15.6 
                    5.5 22.6c.1.6.6 1 1.2 1.1h.2c.5 0 1-.3 1.3-.7l23.2-39c.4-.4.4-1 .1-1.5zM5.2 
                    6.1h35.5L18 18.7 5.2 6.1zm18.7 33.6l-4.4-18.4L42.4 8.6 23.9 39.7z">
                    </path>
                </svg>
                <svg className="post__save" aria-label="save" fill="#262626" height="24" viewBox="0 0 48 48" width="24">
                    <path d="M43.5 48c-.4 0-.8-.2-1.1-.4L24 29 5.6 47.6c-.4.4-1.1.6-1.6.3-.6-.2-1-.8-1-1.4v-45C3
                     .7 3.7 0 4.5 0h39c.8 0 1.5.7 1.5 1.5v45c0 .6-.4 1.2-.9 1.4-.2.1-.4.1-.6.1zM24 26c.8 0 
                     1.6.3 2.2.9l15.8 16V3H6v39.9l15.8-16c.6-.6 1.4-.9 2.2-.9z">
                    </path>
                </svg>
            </div>

            {/* Likes */}
            <div className="post__likesCount" onClick={() => setOpenLikes(true)}>{
                likes.length === 1 ? `Liked by ${likes[0].username}` :
                likes.length === 2 ? `Liked by ${likes[0].username} and ${likes[1].username}` :
                likes.length > 2 ? `${likes.length} likes` : ''
            }</div>
            
            {/* Username and caption */}
            <h4 className="post__text"><a href={'/' + post.username}><span className="post__username">{post.username}</span></a> {post.caption}</h4>

            {/* Comments */}
            <div className="post__comments">
                { comments.length > 2 ? <a href={'/p/' + postId} className="post__allCommentsLink">View all {comments.length} comments</a> :
                
                comments.map((comment) => {
                    return (
                    <p className="post__comment" key={comment.username}>
                        <a href={'/' + comment.username}><strong>{comment.username}</strong></a> <span>{comment.text}</span>
                    </p>
                    )
                })}
            </div>

            {/* Date */}
            <p className="post__date">Today</p>

            {/* Renders comment box if screen width is at least 600px */}
            {user && window.innerWidth > 600 ? (
                <form className="post__commentBox" >
                <svg fill="#262626" height="24" width="24" viewBox="0 0 48 48">
                            <path d="M24 48C10.8 48 0 37.2 0 24S10.8 0 24 0s24 10.8 24 24-10.8 24-24 24zm0-45C12.4 3 3 12.4 3 24s9.4 21 21 21 21-9.4 21-21S35.6 3 24 3z"></path>
                            <path d="M34.9 24c0-1.4-1.1-2.5-2.5-2.5s-2.5 1.1-2.5 2.5 1.1 2.5 2.5 2.5 2.5-1.1 2.5-2.5zm-21.8 0c0-1.4 1.1-2.5 2.5-2.5s2.5 1.1 2.5 2.5-1.1 2.5-2.5 
                            2.5-2.5-1.1-2.5-2.5zM24 37.3c-5.2 0-8-3.5-8.2-3.7-.5-.6-.4-1.6.2-2.1.6-.5 1.6-.4 2.1.2.1.1 2.1 2.5 5.8 2.5 3.7 0 5.8-2.5 5.8-2.5.5-.6 1.5-.7 
                            2.1-.2.6.5.7 1.5.2 2.1 0 .2-2.8 3.7-8 3.7z"></path>
                        </svg>
                <input
                    className="post__input"
                    type="text"
                    placeholder="Add a comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />
                <button
                    disabled={!comment}
                    className="post__button"
                    type="submit"
                    onClick={postComment}
                    >
                        Post
                    </button>
            </form>
            ) : ''}

            
        </div>
    )
}