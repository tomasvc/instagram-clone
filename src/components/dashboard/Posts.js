import React from 'react';
import Post from './Post';
import './Posts.css';

export default function Posts({ user, posts }) {

    return (
        <div className="app__postsWrapper">
          {
            posts?.length === 0 ?
            <div className="postsWrapper__noPosts">
              <div className="noPosts__image"></div>
              <h3 className="noPosts__header">Find People to Follow</h3>
              <a href="/suggestions">See suggestions</a>
            </div>
             
             :
            posts?.map(({id, post}) => {
              return <Post key={id} postId={id} user={user} username={post?.username} caption={post?.caption} imageUrl={post?.imageUrl} avatar={post?.avatar} />
            })
          }
          </div>
    )
}
