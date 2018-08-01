import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'

class DropDown extends Component {
  render () {
    console.log(this.props.matches)
    return (
      <div className='dropdown'>
        <ul>
          {this.props.matches.map((name) => (
            <li>{name}</li>
          ))}
        </ul>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  matches: state.matches
})

DropDown.propTypes = {
  matches: PropTypes.arrayOf(PropTypes.string).isRequired
}

export default connect(mapStateToProps, null)(DropDown)
