import React from 'react';
import $ from 'jquery';
import {render} from 'react-dom';
import Sidebar from './Sidebar.jsx';
import EventShow from './EventShow.jsx';
import Chatbox from './Chatbox.jsx';
import MessageInputBox from './MessageInputBox.jsx';
import data from './../../../../server/data.js';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      friends: this.props.allState.friends,
      myEvents: this.props.allState.ownerEvents,
      friendEvents: this.props.allState.friendEvents,
      currentEvent: this.props.allState.ownerEvents[0],
      currentUser: null,
      messages: [],
      isGoing: false
    }

    this.handleSidebarEventClick = this.handleSidebarEventClick.bind(this);
    this.handleDeclineEvent = this.handleDeclineEvent.bind(this);
    this.handleAcceptEvent = this.handleAcceptEvent.bind(this);
    this.renderNewMessage = this.renderNewMessage.bind(this);
  }

  componentDidMount() {
    this.fetchMessages();
	}

  renderNewMessage(message) {
    this.setState({
      messages: this.state.messages.concat(message)
    })
  }

  fetchMessages() {
    $.ajax({
      url: '/messages',
      method: 'GET',
      contentType: 'application/json',
      success: data => {
        this.setState({
          messages: data
        })
      },
      error: err => {
        console.err('err', err);
      }
    });
  }

  handleDeclineEvent() {
    this.setState({
      isGoing: false,
    })
  }

  handleAcceptEvent() {
    this.setState({
      isGoing: true,
      // friends: friends.push(currentUser);
    })
  }

  handleSidebarEventClick(event) {
    this.setState({
      currentEvent: event
    })
  }

  render() {
    return (
      <div>
        <div className="ui visible sidebar">
          <Sidebar myEvents={ this.state.myEvents }
            friendEvents={ this.state.friendEvents }
            handleSidebarEventClick={ this.handleSidebarEventClick }/>
        </div>
        <div className="pushable">
          <EventShow
            friends={ this.state.friends }
            event={ this.state.currentEvent }
            isGoing={ this.state.isGoing }
            handleDeclineEvent={ this.handleDeclineEvent }
            handleAcceptEvent={ this.handleAcceptEvent }
            renderNewMessage={ this.renderNewMessage }
            messages={ this.state.messages }
            getEvents={ this.props.getEvents }
            history={ this.props.history }
            accessToken={ this.props.accessToken }
          />
        </div>
      </div>
    );
  }
}
