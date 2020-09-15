import React, { Component } from 'react'
import { connect } from 'react-redux'

import { thunkCreator } from '../reducers/reducer'

class Main extends Component {
  render() {
    return (
      <div>Hello World!!</div>
    )
  }
}

const mapStateToProp = (state) => ({
  data: state.data
})

const mapDispatchToProp = (dispatch) => ({
  getData: (data) => dispatch(thunkCreator(data))
})

export default connect(mapStateToProp, mapDispatchToProp)(Main)
