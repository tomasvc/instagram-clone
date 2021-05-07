import { Button, LinearProgress, Input } from '@material-ui/core';
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { storage, db } from '../../firebase/fbConfig';
import firebase from 'firebase';
import '../../styles/App.css';
import '../../styles/ImageUpload.css';
import { addPost } from '../store/actions/postActions';

export default function ImageUpload({ user, username, onClose }) {

    const dispatch = useDispatch();

    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
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
                <LinearProgress className="imageUpload__progressBar" variant="determinate" value={progress} max="100" />
                <Button
                    className="imageUpload__file"
                    variant="contained"
                    component="label"
                    >
                    Upload File
                    <input
                        id="file__input"
                        onChange={handleChange}
                        type="file"
                        hidden
                    />
                </Button>
                {image ? <span>File Selected</span> : ""}
                <Input className="app__modalInput imageUpload__caption" type="text" multiline placeholder="Enter a caption..." value={caption} onChange={(e) => setCaption(e.target.value)} />
                <Button onClick={handleUpload}>Upload</Button>
        </div>
    )
}