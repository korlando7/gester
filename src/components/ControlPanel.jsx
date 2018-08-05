import React, { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import PropTypes from 'prop-types'
import * as Actions from '../store/actions'

class ControlPanel extends Component {
  constructor () {
    super()
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.handleModeButton = this.handleModeButton.bind(this)
    this.handlePubButton = this.handlePubButton.bind(this)
    this.handlePubCancel = this.handlePubCancel.bind(this)
    this.handlePubSubmit = this.handlePubSubmit.bind(this)
    this.handleRecentClick = this.handleRecentClick.bind(this)
  }

  handleKeyPress (e) {
    if (e.key === 'Enter') {
      // this is a little to text based so we'll have to make it more fun
      const recipients = e.target.value
        .split(',')
        .map(x => x.trim())
      this.recipientsInput.value = ''
      this.props.goPrivate(recipients)
    }
  }

  handleModeButton () {
    this.props.goPublic()
  }

  handlePubButton () {
    this.props.setJoinPub(true)
  }

  handlePubCancel () {
    this.props.setJoinPub(false)
  }

  handlePubSubmit (invite) {
    this.props.joinPub(invite)
  }

  handleRecentClick (recipients) {
    this.props.goPrivate(recipients.split(', '))
  }

  render () {
    const privateMode = this.props.mode === 'PRIVATE'
    const sortedRecents = this.props.recents.slice().sort((a, b) => {
      const mappedA = a.map(id => (this.props.authors[id] || {}).name || id).join(', ')
      const mappedB = b.map(id => (this.props.authors[id] || {}).name || id).join(', ')
      return mappedA > mappedB
    })

    return (
      <div className='control-panel'>
        <div>
          <button className='button' onClick={this.handlePubButton}>+ join pub</button>
        </div>
        <div>
          <input
            className='control-panel__input'
            type='text'
            placeholder='New private message...'
            onKeyPress={this.handleKeyPress}
            ref={el => { this.recipientsInput = el }}
          />
        </div>
        <div className='control-panel__users'>
          <div className='recents'>
            {sortedRecents.map((recent) => {
              const currentRecps = this.props.recipients.join(', ')
              const thisRecent = recent.join(', ')
              const isCurrent = currentRecps === thisRecent
              const isUnread = this.props.unreads.some((unread) => (
                unread.join(', ') === thisRecent
              ))

              const humanNames = recent.map(id => (
                (this.props.authors[id] || {}).name || id
              )).join(', ')

              let className = isCurrent
                ? 'recents-item__active'
                : 'recents-item'
              if (isUnread) {
                className += ' unread'
              }
              return (
                <p
                  className={className}
                  onClick={() => this.handleRecentClick(humanNames)}
                  key={thisRecent}
                >{humanNames}</p>
              )
            })}
          </div>
        </div>
        <div>
          {privateMode &&
            <button className='button public-button' onClick={this.handleModeButton}>back to public</button>
          }
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  mode: state.mode,
  recents: state.recents,
  authors: state.authors,
  unreads: state.unreads,
  recipients: state.recipients
})

const mapDispatchToProps = dispatch => ({
  goPrivate: bindActionCreators(Actions.goPrivate, dispatch),
  goPublic: bindActionCreators(Actions.goPublic, dispatch),
  joinPub: bindActionCreators(Actions.joinPub, dispatch),
  setJoinPub: bindActionCreators(Actions.setJoinPub, dispatch)
})

ControlPanel.propTypes = {
  goPublic: PropTypes.func.isRequired,
  goPrivate: PropTypes.func.isRequired,
  joinPub: PropTypes.func.isRequired,
  setJoinPub: PropTypes.func.isRequired,
  recents: PropTypes.array.isRequired,
  authors: PropTypes.object.isRequired,
  unreads: PropTypes.array.isRequired,
  recipients: PropTypes.array.isRequired,
  mode: PropTypes.string.isRequired
}

export default connect(mapStateToProps, mapDispatchToProps)(ControlPanel)
