import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Modal } from '@material-ui/core';
import ImageUpload from './ImageUpload';
import '../App.css';

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
      backgroundColor: theme.palette.background.paper,
      border: 'none',
      borderRadius: '12px',
      outline: 0,
      boxShadow: theme.shadows[5],
      padding: theme.spacing(2, 4, 3),
    }
  }));

export default function AddPost({ openAdd, onClose, user }) {

    const classes = useStyles();
    const [modalStyle] = useState(getModalStyle);

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

            {user?.displayName ? (
              <ImageUpload user={user} username={user.displayName} setOpenAdd={openAdd} onClose={onClose} />
            ):
              (<h4>You need to log in to upload</h4>)
            }
            
          </center>
        </div>
      </Modal>
        </div>
    )
}