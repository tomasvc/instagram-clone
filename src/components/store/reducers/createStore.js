const getState = (state = {}, action) => {
    const { data } = action
    switch(action.type){
      case 'GET_STATE':
       return {
        ...state,
        data
       }
      default:
       return state  
    }
}

export default getState