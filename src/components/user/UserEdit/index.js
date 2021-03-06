import React, { useState, useEffect, useContext } from 'react'
import { makeStyles } from '@material-ui/core/styles'
import { Avatar, Modal } from "@material-ui/core"
import { storage, db, auth } from '../../../firebase/config'
import './styles.css'
import Skeleton from 'react-loading-skeleton'
import imageCompression from 'browser-image-compression'
import UserContext from '../../../userContext'

function getModalStyle() {
    const top = 50
    const left = 50
  
    return {
      top: `${top}%`,
      left: `${left}%`,
      transform: `translate(-${top}%, -${left}%)`,
    }
  }
  
  const useStyles = makeStyles((theme) => ({
    paper: {
      position: 'absolute',
      minWidth: '300px',
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderRadius: '12px',
      outline: 0,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      paddingBottom: 0
    }
  }))

// The UserEdit component controls the form in the edit page

export default function UserEdit() {

    const classes = useStyles()
    const [modalStyle] = useState(getModalStyle)

    const { user } = useContext(UserContext)

    const [userData, setUserData] = useState([])

    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [website, setWebsite] = useState('')
    const [bio, setBio] = useState('')
    const [error, setError] = useState(null)

    const [avatarModal, setAvatarModal] = useState(false)
    const [avatarFile, setAvatarFile] = useState('')


    const handleSubmit = async (e) => {

        e.preventDefault()

        await db.collection('users').where('username', '==', username).get().then(user => {

            if (user.docs.length !== 0) {

                if (username === document.querySelector('.right__username').textContent) {
                    updateUserData()
                } else {
                    setError('An account with this username already exists')
                }

                
            } else if (username === '') {

                setError("Please enter a valid username")

            } else {

                updateUserData()

            }

        })

    }

    const updateUserData = async () => {

        await db.collection('users').doc(user?.uid).update({
            username,
            name,
            website,
            bio
        })

        .catch(error => console.log(error))

        .then(await updatePosts(username))

        .then(

            await auth.currentUser.updateProfile({
                displayName: username
            })
            
            .catch((err) => {
                setError('There was a problem updating your profile. ' + err)
            })

        )

        .then(

            setError(null),
            document.location.reload()

        )

    }

    const updatePosts = async (username) => {

        await db
            .collection('posts')
            .where('username', '==', user.displayName)
            .get()
            .then(res => {

                let batch = db.batch()

                res.docs.forEach(doc => {
                    const docRef = db.collection('posts').doc(doc.id)
                    batch.update(docRef, { username })
                })

                batch.commit()

            }
            
        ).then(

            await db
                .collection('posts')
                .doc()
                .collection('likes')
                .where('username', '==', user.displayName)
                .get()
                .then(res => {

                            let batch = db.batch()

                            res.docs.forEach(doc => {
                                const docRef = db.collection('posts').doc(doc.id).collection('likes').doc()
                                batch.update(docRef, { username, avatar: user.photoURL })
                            })

                            batch.commit()

                        
                })

        ).catch((error) => {
            console.log(error.message)
        })

    }

    // get user data
    useEffect(() => {

        async function getUser() {

            db
                .collection('users')
                .doc(user?.uid)
                .get()
                .then(doc => {
                    setUserData(doc.data())
                })
        }

        getUser()

    }, [user])


    // this code updates the avatar image
    useEffect(() => {  

        async function setAvatarToNull() {
            if (user) {
                await db
                        .collection('posts')
                        .where('username', '==', user.displayName)
                        .get()
                        .then(res => {

                            let batch = db.batch()
            
                            res.docs.forEach(doc => {
                                const docRef = db.collection('posts').doc(doc.id)
                                batch.update(docRef, { avatar: user.photoURL })
                            })
                            
                            batch.commit()

                })

            }
                
        }
        
        if (avatarFile) {

            async function uploadCompressedAvatarImage() {

                let uploadAvatar = null

                const options = {
                    maxSizeMB: 0.5,
                    maxWidthOrHeight: 1000
                }

                await imageCompression(avatarFile, options).then(compressedFile => {
                    uploadAvatar = storage.ref(`images/${avatarFile.name}`).put(compressedFile)
                })
    
                uploadAvatar.on("state_changed", () => {

                    storage
                    .ref("images")
                    .child(avatarFile.name)
                    .getDownloadURL()
                    .then(url => {

                        db.collection('users').doc(user?.uid).update({
                            avatarUrl: url
                        })

                        user.updateProfile({
                            photoURL: url
                        })

                    })
                    
                    db.collection('posts').where('username', '==', user?.displayName).get().then(res => {

                        let batch = db.batch()
            
                        res.docs.forEach(doc => {
                            const docRef = db.collection('posts').doc(doc.id)
                            batch.update(docRef, { avatar: user?.photoURL })
                        })
                        
                        batch.commit()

                    }
                        
                    )
                    
                })

            }
            
            uploadCompressedAvatarImage()
                
        } else {

            setAvatarToNull()

        }

    }, [user, avatarFile])


    const uploadAvatar = (e) => {
        e.preventDefault()

        if (e.target.files[0]) {
            setAvatarFile(e.target.files[0])
        }

        setAvatarModal(false)
    }


    const deleteAvatar = () => {
        db.collection('users').doc(user.uid).update({
            avatarUrl: ''
        })

        user.updateProfile({
            photoURL: ''
        })

        setAvatarModal(false)
    }


    return (
        <div className="userEdit">

            <Modal 
                id="editModal"
                className="app__modal" 
                src={user?.photoURL}
                open={avatarModal}
                onClose={() => setAvatarModal(false)}
                >
                <div style={modalStyle} className={classes.paper} >
                    <center>
                        <h4 className="app__modalLabel">Change Profile Photo</h4>
                        <label htmlFor="uploadAvatar">
                            <h5 className="editModal__uploadBtn">Upload Photo</h5>
                            <input type="file" id="uploadAvatar" style={{display: 'none'}} onChange={uploadAvatar} />
                        </label>
                        
                        <h5 className="editModal__removeBtn" onClick={deleteAvatar}>Remove Current Photo</h5>
                        <h5 className="editModal__cancelBtn" onClick={() => setAvatarModal(false)}>Cancel</h5>
                    </center>
                </div>
            </Modal>

            <div className="userEdit__wrapper">
                <div className="userEdit__left">
                    <ul className="left__nav">
                        <li className="left__navItem navItem__selected">Edit Profile</li>
                        <li className="left__navItem">Change Password</li>
                        <li className="left__navItem">Apps and Websites</li>
                        <li className="left__navItem">Email and SMS</li>
                        <li className="left__navItem">Push Notifications</li>
                        <li className="left__navItem">Manage Contacts</li>
                        <li className="left__navItem">Privacy and Security</li>
                        <li className="left__navItem">Login Activity</li>
                        <li className="left__navItem">Emails from Photogram</li>
                        <li className="left__navItem">Switch to Professional Account</li>
                    </ul>
                </div>
                <div className="userEdit__right">
                    <div className="right__top">
                        <div><Avatar className="top__avatar" src={user.photoURL} onClick={() => setAvatarModal(true)}></Avatar></div>
                        <div>
                            { user ? <p className="right__username">{user.displayName}</p> : <Skeleton width={150} height={30} /> }
                            <p className="right__changeProfileBtn" onClick={() => setAvatarModal(true)}>Change Profile Photo</p>
                        </div>
                    </div>
                    
                    <form className="userEdit__form">
                    { error && <p className="form__error">{error}</p>}
                        <div className="form__item form__name">
                            <aside className="item__aside">
                                <label htmlFor="name">Name</label>
                            </aside>
                            <div className="item__input">
                                <input id="name" className="item__inputField" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                                <p className="item__note">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
                            </div>
                        </div>
                        <div className="form__item form__username">
                            <aside className="item__aside">
                                <label htmlFor="username">Username*</label>
                            </aside>
                            <div className="item__input">
                                <input id="username" className="item__inputField" placeholder="Username" onChange={(e) => setUsername(e.target.value)} required />
                            </div>
                        </div>
                        <div className="form__item form__website">
                            <aside className="item__aside">
                                <label htmlFor="website">Website</label>
                            </aside>
                            <div className="item__input">
                                <input id="website" className="item__inputField" placeholder="Website" onChange={(e) => setWebsite(e.target.value)} />
                            </div>
                        </div>
                        <div className="form__item form__bio">
                            <aside className="item__aside">
                                <label htmlFor="bio">Bio</label>
                            </aside>
                            <div className="item__input">
                                <textarea id="bio" className="item__inputField" style={{resize: 'vertical', minHeight: '50px'}} onChange={(e) => setBio(e.target.value)} />
                            </div>
                        </div>
                        <div className="form__item form__submit">
                            <aside className="item__aside"></aside>
                            <div className="item__input">
                                <button className="form__submitBtn" type="submit" onClick={handleSubmit}>Submit</button>
                            </div>
                        </div>
                        
                    </form>
                </div>
            </div>
        </div>
    )
}
