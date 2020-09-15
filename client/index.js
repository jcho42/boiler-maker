import React from 'react'
import ReactDOM from 'react-dom'
import { Provider } from 'react-redux'

import Main from './components/Main'
import store from './store'

import './index.css'

ReactDOM.render(
  <Provider store={store}>
    <Main />
  </Provider>,
  document.getElementById('app')
)
