import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Avatar, Modal } from "@material-ui/core";
import { db } from '../../firebase/fbConfig';
import firebase from 'firebase';

export default function UploadPage({ user }) {
    return (
        <div>
            <div>
                <Avatar></Avatar>
                <textarea type="text" placeholder="Write a caption..."></textarea>
                <img src="" alt="" />
            </div>
        </div>
    )
}
