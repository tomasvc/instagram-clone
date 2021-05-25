import { Button } from '@material-ui/core';
import React, { useState } from 'react';
import { storage, db } from '../../firebase/fbConfig';
import firebase from 'firebase/app';
import { Avatar } from "@material-ui/core";
import '../../styles/App.css';
import './ImageUpload.css';

export default function ImageUpload({ user, username, onClose }) {

    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    const handleUploadClick = () => {
        document.getElementById('file__input').click()
    }

    const handleUpload = () => {

        const uploadTask = storage.ref(`images/${image.name}`).put(image);

        const avatar = user.photoURL;

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
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setImage(url)
                        db.collection('posts').add({
                            caption,
                            username,
                            avatar,
                            imageUrl: url,
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

    return (
        <div className="imageUpload">
                {/* <LinearProgress className="imageUpload__progressBar" variant="determinate" value={progress} max="100" /> */}
                <button
                    className="imageUpload__file"
                    variant="contained"
                    component="label"
                    onClick={handleUploadClick}
                    >
                    Upload File
                </button>
                <input
                        id="file__input"
                        onChange={handleChange}
                        type="file"
                        hidden
                    />
                <div className="imageUpload__bottom">
                    <Avatar></Avatar>
                    <input className="bottom__caption" type="text" multiline placeholder="Enter a caption..." value={caption} onChange={(e) => setCaption(e.target.value)}></input>
                </div>
                
                {image ? <span>File Selected</span> : ""}
                <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}