import reducer from './reducer'
import { combineReducers } from 'redux'

const appReducer = combineReducers({
  data: reducer
})

export default appReducer
