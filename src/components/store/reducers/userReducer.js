const userReducer = (state = {}, action) => {
    switch (action.type) {
        case 'CREATE_USER_SUCESS':
            return state;
        case 'CREATE_USER_ERROR':
            console.log('create user error')
            return state;
        case 'EDIT_USER_SUCCESS':
            return state;
        case 'EDIT_USER_ERROR':
            console.log('edit user error')
            return state;
        default:
            return state
    }
}

export default userReducer