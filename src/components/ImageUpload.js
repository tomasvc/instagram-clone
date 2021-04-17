import { Button, LinearProgress, Input } from '@material-ui/core';
import React, { useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import firebase from 'firebase/app';
import { storage, db } from '../fbConfig';
import '../App.css';
import './ImageUpload.css';
import { addPost } from './store/actions/postActions';

export default function ImageUpload({ username, onClose }) {

    const dispatch = useDispatch();

    const [caption, setCaption] = useState('')
    const [progress, setProgress] = useState(0)
    const [image, setImage] = useState(null)

    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0])
        }
    }

    var state = {
        caption,
        image,
        username
    }

    const handleUpload = () => {

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
            () => {
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        setImage(url)
                        console.log(image)
                        dispatch(addPost({caption, url, username}))
                    })

                    onClose()

                    setProgress(0)
                    setCaption('')
                    setImage(null)
            }
        )


        // 
        //     () => {
        //         // complete function...
        //         storage
        //             .ref("images")
        //             .child(image.name)
        //             .getDownloadURL()
        //             .then(url => {
        //                 // post image inside db
        //                 db.collection("posts").add({
        //                     timestamp: firebase.firestore.FieldValue.serverTimestamp(),
        //                     caption: caption,
        //                     imageUrl: url,
        //                     username: username
        //                 });

        //                 setOpenAdd(false);

        //                 setProgress(0);
        //                 setCaption('');
        //                 setImage(null);

        //             })
        //     }
        // )
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