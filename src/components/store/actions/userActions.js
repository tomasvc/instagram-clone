export const createUser = (user) => {
    return (dispatch, getState, { getFirestore }) => {
        const firestore = getFirestore();
        firestore.collection('users').add({
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            website: user.website,
            bio: user.bio
        })
        .then(() => {
            dispatch({ type: 'CREATE_USER_SUCCESS' })
        }).catch(err => {
            dispatch({ type: 'CREATE_USER_ERROR' }, err)
        })
    }
}

export const editUser = (user) => {
    return (dispatch, { getFirestore }) => {
        const firestore = getFirestore();
        firestore.collection('users').doc().update({
            username: user.username,
            name: user.name,
            avatarUrl: user.avatarUrl,
            website: user.website,
            bio: user.bio
        })
        .then(() => {
            dispatch({ type: 'EDIT_USER_SUCCESS' })
        }).catch(err => {
            dispatch({ type: 'EDIT_USER_ERROR' }, err)
        })
    }
}
