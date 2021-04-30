export const addPost = (post) => {
    return (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        firestore.collection('posts').add({
            caption: post.caption,
            imageUrl: post.url,
            username: post.username
        })
            .then(() => {
                dispatch({ type: 'ADD_POST_SUCCESS' })
            }).catch(err => {
                dispatch({ type: 'ADD_POST_ERROR' }, err)
            })
    }
}

export const getPosts = (posts) => {
    return (dispatch, { getFirestore }) => {

    }
}