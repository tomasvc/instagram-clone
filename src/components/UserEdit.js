import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Avatar, Modal } from "@material-ui/core";
import { useDispatch } from 'react-redux';
import { storage, db } from '../fbConfig';
import './UserEdit.css';
import { editUser } from './store/actions/userActions';

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
      minWidth: '200px',
      width: '340px',
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderRadius: '12px',
      outline: 0,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      paddingBottom: 0
    }
  }));

export default function UserEdit({ user }) {

    const dispatch = useDispatch();

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [userData, setUserData] = useState([])

    const [username, setUsername] = useState('')
    const [name, setName] = useState('')
    const [website, setWebsite] = useState('')
    const [bio, setBio] = useState('')

    const [avatarModal, setAvatarModal] = useState(false)
    const [avatar, setAvatar] = useState(null)
    const [avatarUrl, setAvatarUrl] = useState('')

    const handleSubmit = (e) => {
        e.preventDefault();
        //dispatch(editUser({username, name, website, bio}))
        db.collection('users').doc(user.uid).update({
            username,
            name,
            website,
            bio
        })
        user.updateProfile({
            displayName: username
        })
    }

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

    useEffect(() => {  
        
        if (avatar) {
            const uploadAvatar = storage.ref(`images/${avatar.name}`).put(avatar);
    
                uploadAvatar.on("state_changed", () => {
                    storage
                    .ref("images")
                    .child(avatar.name)
                    .getDownloadURL()
                    .then(url => {
                        setAvatarUrl(url)
                        db.collection('users').doc(user.uid).update({
                            avatarUrl: url
                        })
                    })
                })
        }
    
    }, [avatar])

    const uploadAvatar = (e) => {
        e.preventDefault();

        if (e.target.files[0]) {
            setAvatar(e.target.files[0])
        }
    }

    const deleteAvatar = (e) => {
        db.collection('users').doc(user.uid).update({
            avatarUrl: ''
        })

        setAvatarModal(false)
    }

    return (
        <div className="userEdit">

            <Modal 
                id="editModal"
                className="app__modal" 
                src={avatarUrl}
                open={avatarModal}
                onClose={() => setAvatarModal(false)}
                >
                <div style={modalStyle} className={classes.paper} >
                    <center>
                        <h4 className="app__modalLabel">Change Profile Photo</h4>
                        <label for="uploadAvatar">
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
                        <li className="left__navItem">Emails from Instagram</li>
                        <li className="left__navItem">Switch to Professional Account</li>
                    </ul>
                </div>
                <div className="userEdit__right">
                    <div className="right__top">
                        <div><Avatar className="top__avatar" onClick={() => setAvatarModal(true)}></Avatar></div>
                        <div>
                            <p className="right__username">{user?.displayName}</p>
                            <p className="right__changeProfileBtn" onClick={() => setAvatarModal(true)}>Change Profile Photo</p>
                        </div>
                    </div>
                    <form type="submit" className="userEdit__form">
                        <div className="form__item form__name">
                            <aside className="item__aside">
                                <label for="name">Name</label>
                            </aside>
                            <div className="item__input">
                                <input id="name" className="item__inputField" placeholder="Name" onChange={(e) => setName(e.target.value)} />
                                <p className="item__note">Help people discover your account by using the name you're known by: either your full name, nickname, or business name.</p>
                            </div>
                        </div>
                        <div className="form__item form__username">
                            <aside className="item__aside">
                                <label for="username">Username</label>
                            </aside>
                            <div className="item__input">
                                <input id="username" className="item__inputField" placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
                            </div>
                        </div>
                        <div className="form__item form__website">
                            <aside className="item__aside">
                                <label for="website">Website</label>
                            </aside>
                            <div className="item__input">
                                <input id="website" className="item__inputField" type="url" placeholder="Website" onChange={(e) => setWebsite(e.target.value)} />
                            </div>
                        </div>
                        <div className="form__item form__bio">
                            <aside className="item__aside">
                                <label for="bio">Bio</label>
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
