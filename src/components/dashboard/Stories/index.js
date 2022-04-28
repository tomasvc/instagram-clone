import React from "react";
import Story from "../Story";
import "./styles.css";

// Returns a div will all the stories

export default function Stories({ stories, loading }) {
  return (
    <div className="app__storiesWrapper">
      {!loading && stories?.length === 0 ? (
        <div className="storiesWrapper__noStories"></div>
      ) : (
        stories?.map(({ id, story }) => {
          return (
            <Story
              key={id}
              storyId={id}
              username={story?.username}
              imageUrl={story?.imageUrl}
              avatar={story?.avatar}
            />
          );
        })
      )}
    </div>
  );
}
