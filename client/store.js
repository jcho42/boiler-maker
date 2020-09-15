import { createStore, applyMiddleware } from 'redux'
import loggerMiddleware from 'redux-logger'
import thunkMiddleware from 'redux-thunk'

import appReducer from './reducers'

const middleware = applyMiddleware(loggerMiddleware, thunkMiddleware)

export default createStore(appReducer, middleware)
