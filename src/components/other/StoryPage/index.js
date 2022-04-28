import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import { Avatar, Modal } from "@material-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
// import { faXmarkLarge } from "@fortawesome/free-regular-svg-icons";
import { db } from "../../../firebase/config";
import firebase from "firebase/app";
import { makeStyles } from "@material-ui/core/styles";
import UserContext from "../../../userContext";
import "./styles.css";

export default function StoryPage() {
  const { user } = useContext(UserContext);

  const { storyId } = useParams();
  const [story, setStory] = useState(null);

  useEffect(() => {
    if (user) {
      getStory();
    }
  });

  async function getStory() {
    const snapshot = await db.collection("stories").doc(storyId).get();

    setStory(snapshot.data());
  }

  return (
    <div className="storyPage__wrapper">
      {/* <FontAwesomeIcon icon={"fa-regular fa-xmark"} color="primary" /> */}
      <div className="wrapper__container">
        <img className="container__content" src={story?.imageUrl} alt="" />
        <div className="container__controls">
          <div className="controls__timeline">
            <div className="timeline__line">
              <div className="line__progress"></div>
            </div>
          </div>
          <div className="controls__user">
            <div className="user__user">
              <Avatar className="user__avatar" src={story?.avatar} />
              <p className="user__name">{story?.username}</p>
            </div>
            <div className="user__right">
              <svg
                aria-label="Play"
                color="#fff"
                fill="#fff"
                viewBox=" 0 0 24 24"
                width="16"
              >
                <path d="M5.888 22.5a3.46 3.46 0 01-1.721-.46l-.003-.002a3.451 3.451 0 01-1.72-2.982V4.943a3.445 3.445 0 015.163-2.987l12.226 7.059a3.444 3.444 0 01-.001 5.967l-12.22 7.056a3.462 3.462 0 01-1.724.462z" />
              </svg>
              <svg
                aria-label="Video has no audio"
                color="#fff"
                fill="#fff"
                viewBox=" 0 0 24 24"
                width="16"
              >
                <path d="M11.403 1.083a1.001 1.001 0 00-1.082.187L5.265 6H2a1 1 0 00-1 1v10.003a1 1 0 001 1h3.265l5.01 4.682.02.021a1 1 0 001.704-.814L12.005 2a1 1 0 00-.602-.917zM20.704 12l1.94-1.94a1.5 1.5 0 00-2.122-2.12l-1.939 1.939-1.94-1.94a1.5 1.5 0 10-2.12 2.122L16.461 12l-1.94 1.94a1.5 1.5 0 102.122 2.12l1.939-1.939 1.94 1.94a1.5 1.5 0 002.12-2.122z" />
              </svg>
              <svg
                aria-label="Menu"
                color="#fff"
                fill="#fff"
                viewBox=" 0 0 24 24"
                width="16"
              >
                <path d="M12 9.75A2.25 2.25 0 1014.25 12 2.25 2.25 0 0012 9.75zm-6 0A2.25 2.25 0 108.25 12 2.25 2.25 0 006 9.75zm12 0A2.25 2.25 0 1020.25 12 2.25 2.25 0 0018 9.75z" />
              </svg>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
