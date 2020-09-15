import axios from 'axios'

// Action types
const ACTION_TYPE = 'ACTION_TYPE'

// Action creators
const actionCreator = (data) => ({
  type: ACTION_TYPE,
  data
})

// Thunk creators
export const thunkCreator = () => {
  return async (dispatch) => {
    try {
      const { data } = await axios.get('/api/puppies')
      dispatch(actionCreator(data))
    } catch (error) {
      console.error(error)
    }
  }
}

// Reducer
const reducer = (state = {}, action) => {
  switch (action.type) {
    case ACTION_TYPE:
      return action.data
    default:
      return state
  }
}

export default reducer
