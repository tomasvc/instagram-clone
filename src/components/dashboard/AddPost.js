import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal, Avatar } from '@material-ui/core';
import { storage, db } from '../../firebase/fbConfig';
import firebase from 'firebase/app';
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
      minWidth: '350px',
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderRadius: '12px',
      outline: 0,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
      paddingBottom: 0
    }
  }));

export default function AddPost({ openAdd, onClose, user }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)
    const [error, setError] = useState('')

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUploadClick = () => {
      document.getElementById('file__input').click()
    }

    const handleUpload = () => {

      if (image) {
          
        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        uploadTask.on(
            "state_changed",
            (snapshot) => {
                // progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress)
            },
            (error) => {
                alert(error.message);
            },
            async () => {
                await storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setImage(url)
                        document.getElementById('imageUpload__btn').style.background = 'url(' + url + ')'
                        db.collection('posts').add({
                            id: db.collection('posts').doc().id,
                            caption,
                            username: user.displayName,
                            avatar: user.photoURL,
                            imageUrl: url,
                            likes: 0,
                            comments: 0,
                            timestamp: firebase.firestore.FieldValue.serverTimestamp()
                        })
                    })

                    onClose()

                    setProgress(0)
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
                      {/* <LinearProgress className="imageUpload__progressBar" variant="determinate" value={progress} max="100" /> */}
                      
                          <div id="imageUpload__btn" onClick={handleUploadClick}>Select Image</div>

                          <input
                                  id="file__input"
                                  onChange={handleChange}
                                  type="file"
                                  hidden
                              />
                    
                      <div className="imageUpload__caption">
                        
                          <Avatar src={user?.photoURL}></Avatar>
                          <textarea className="caption__input" type="text" multiline placeholder="Enter a caption..." value={caption} onChange={(e) => setCaption(e.target.value)}></textarea>
                          
                      </div>
                      
                      {image ? <span>File Selected</span> : ""}
                      <button disabled={!image ? true : false} className="imageUpload__uploadBtn" onClick={handleUpload}>Upload</button>
                      <button className="imageUpload__cancelBtn" onClick={onClose}>Cancel</button>
                  </div>
                  
                </center>
              </div>
            </Modal>
        </div>
    )
}