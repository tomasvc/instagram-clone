import React, { useState, useEffect, useContext } from "react";
import { db } from "../../../firebase/config";
import firebase from "firebase/app";
import UserContext from "../../../userContext";
import { makeStyles } from "@material-ui/core/styles";
import "./styles.css";
import { Avatar, Modal } from "@material-ui/core";

export default function Story({ storyId }) {
  const { user } = useContext(UserContext);

  const [story, setStory] = useState(null);

  useEffect(() => {
    async function getStory() {
      const snapshot = await db.collection("stories").doc(storyId).get();

      setStory(snapshot.data());
    }

    getStory();
  }, [storyId, user]);

  return (
    <div className="story" id={storyId}>
      <div className="story__avatar">
        <a
          className="avatar__link"
          href={"/stories/" + story?.username + "/" + story?.id}
        >
          <div className="link__circle">
            <svg
              viewBox="0 0 120 120"
              xmlns="http://www.w3.org/2000/svg"
            //   style="enable-background:new -580 439 577.9 194;"
            //   xml:space="preserve"
            >
                <circle cx="60" cy="60" r="53" />
            </svg>
            <Avatar className="link__avatar" src={story?.avatar} alt="" />
          </div>
          <p className="link__username">{story?.username}</p>
        </a>
      </div>
    </div>
  );
}
