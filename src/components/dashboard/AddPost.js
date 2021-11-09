import React, { useState, useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Avatar } from '@material-ui/core';
import { storage, db } from '../../firebase/config';
import firebase from 'firebase/app';
import imageCompression from 'browser-image-compression';
import UserContext from '../../userContext';
import '../../App.css';
import './AddPost.css';

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
      width: '70%',
      maxWidth: '400px', 
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderRadius: '12px',
      outline: 0,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      paddingBottom: 0
    }
  }));


// The AddPost component handles the image upload functionality.
// It provides a modal where the user can upload an image and provide a caption.
// The image is automatically compressed to a smaller size before being uploaded.

export default function AddPost({ openAdd, onClose }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const { user } = useContext(UserContext)

    const [caption, setCaption] = useState('')
    const [image, setImage] = useState(null)
    const [imageURL, setImageURL] = useState(null)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
            const url = URL.createObjectURL(e.target.files[0])
            setImageURL(url)
        }
    }

    // simulate a button click
    const handleUploadClick = () => {
      document.getElementById('file__input').click()
    }

    const handleUpload = async () => {

      if (image) {

        let uploadTask = null;

        const options = {
          maxSizeMB: 0.5,
          maxWidthOrHeight: 1000
        }

        // custom library that comppresses an image which is then stored in firebase storage
        await imageCompression(image, options).then(compressedFile => {
          uploadTask = storage.ref(`images/${image.name}`).put(compressedFile);
        })
          
        uploadTask.on(
            "state_changed",
            async () => {
                await storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setImage(url)

                        const ref = db.collection('posts').doc();

                        ref.set({
                            id: ref.id,
                            caption,
                            username: user.displayName,
                            avatar: user.photoURL,
                            imageUrl: url,
                            likes: 0,
                            comments: 0,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        })
                    })
                    .catch (error => {
                      setError(error.message)
                    })

                    onClose()

                    setCaption('')
                    setImage(null)
            }
            
        )

      }
    }

    return (
        <div>
            <Modal 
              className="app__modal"
              open={openAdd}
              onClose={onClose}
            >
              <div style={modalStyle} className={classes.paper} >
                <center>
                  <h4 className="app__modalLabel">Upload Image</h4>

                  <div className="imageUpload">
                      
                          <div id="imageUpload__btn" onClick={handleUploadClick}>
                            { imageURL ? <img className="btn__image" src={imageURL} alt='' /> : 'Select Image'}
                          </div>

                          <input
                                  id="file__input"
                                  onChange={handleChange}
                                  type="file"
                                  hidden
                              />
                    
                      <div className="imageUpload__caption">

                          { error && error }
                        
                          <Avatar src={user?.photoURL}></Avatar>
                          <textarea className="caption__input" type="text" placeholder="Enter a caption..." value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
                          
                      </div>

                  </div>

                  <button disabled={!image ? true : false} className="imageUpload__uploadBtn modalBtn" onClick={handleUpload}>Upload</button>
                  <button className="imageUpload__cancelBtn modalBtn" onClick={onClose}>Cancel</button>
                  
                </center>
              </div>
            </Modal>
        </div>
    )
}