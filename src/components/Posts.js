import React from 'react';
import Post from './Post';

export default function Posts({ user, posts }) {
    return (
        <div className="app__postsWrapper">

          {
            posts.map(({id, post}) => {
              return <Post key={id} postId={id} user={user} username={post.username} caption={post.caption} imageUrl={post.imageUrl} />
            })
          }
          </div>
    )
}
