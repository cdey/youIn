import React from 'react';
import $ from 'jquery';
import {render} from 'react-dom';
import Sidebar from './Sidebar.jsx';
import EventShow from './EventShow.jsx';
import Chatbox from './Chatbox.jsx';
import MessageInputBox from './MessageInputBox.jsx';
import data from './../../../../server/data.js';
import io from 'socket.io-client';

export default class Chat extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      ownerEvents: props.allState.ownerEvents,
      friendEvents: props.allState.friendEvents,
      currentEvent: props.ownerEvents[0],
      currentAttendees: '',
      messages: [],
      isGoing: '',
      buttonAccept: 'ui button',
      buttonDecline: 'ui button',
      socket: ''
    }

    this.handleSidebarEventClick = this.handleSidebarEventClick.bind(this);
    this.handleDeclineEvent = this.handleDeclineEvent.bind(this);
    this.handleAcceptEvent = this.handleAcceptEvent.bind(this);
    this.renderNewMessage = this.renderNewMessage.bind(this);
    this.renderNewEvent = this.renderNewEvent.bind(this);
  }

  componentDidMount() {
    this.initSockets();
    this.fetchMessages();
	}

  initSockets() {
    let socket = io();
    /*  Joins channels for all relevant events and a
        default room:new-rooms channel */
    socket.emit('chat-join', {
      user_id: this.props.currentUser
    })
    socket.on('connect', function() {
      console.log('Socket Id: ', socket.id);
    })
    socket.on('new-message', function(data) {
      console.log('Sockets: Received new message: ', data);
      var ownerArray = this.state.ownerEvents;
      ownerArray.forEach(event => {
        if (data.event_id === event.event_id) {
          if (!event.unread_messages) {
            event.unread_messages = [];
          } 
          event.unread_messages.push(data);
        } else {
          if (!event.unread_messages) {
            event.unread_messages = [];
          }
        }
      });
      this.setState({
        ownerEvents: ownerArray
      })
      var friendArray = this.state.friendEvents;
      friendArray.forEach(event => {
        if (data.event_id === event.event_id) {
          if (!event.unread_messages) {
            event.unread_messages = [];
          } 
          event.unread_messages.push(data);
        } else {
          if (!event.unread_messages) {
            event.unread_messages = [];
          }
        }
      });
      this.setState({
        friendEvents: friendArray
      })
    }.bind(this))
    socket.on('new-room', function(data) {
      console.log('Sockets: A new event room was created: ', data);
      data.users.map(user => {
        if (user === this.props.currentUser) {
          this.renderNewEvent(data.event)
        }
      })
    }.bind(this))
    this.setState({
      socket: socket
    });
  }

  renderNewEvent(event) {
    this.setState({
      friendEvents: this.state.friendEvents.push(event)
    })
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

  updateEventStatus(url) {
    $.ajax({
      url: url,
      method: 'POST',
      'Content-type': 'application/json',
      beforeSend: (xhr) => {
        xhr.setRequestHeader ('Authorization', 'Bearer ' + this.props.allState.facebookToken);
      },
      data: {
        eventId: JSON.stringify(this.state.currentEvent.event_id)
      },
      success: function() {
        console.log('Update Event Status Successfully');
      },
      error: function(err) {
        console.log('Update Event Status Error: ', err);
      }
    });
  }

  handleDeclineEvent() {
    this.setState({
      buttonDecline: 'ui primary button',
      buttonAccept: 'ui button',
      isGoing: false,
    })

    this.updateEventStatus('/reject');
  }

  handleAcceptEvent() {
    this.setState({
      buttonDecline: 'ui button',
      buttonAccept: 'ui button primary',
      isGoing: true
    })

    this.updateEventStatus('/accept');
  }

  handleSidebarEventClick(event) {
    this.setState({
      currentEvent: event,
      currentAttendees: event.attendees
    })
    if (this.state.currentEvent.unread_messages) {
      this.state.currentEvent.unread_messages.splice(0);
    }
  }

  render() {
    return (
      <div>
        <div className="ui visible sidebar">
          <Sidebar myEvents={ this.props.ownerEvents }
            friendEvents={ this.props.friendEvents }
            handleSidebarEventClick={ this.handleSidebarEventClick }
            currentEvent={ this.state.currentEvent }
            socket={ this.state.socket }
          />
        </div>
        <div className="pushable">
          <EventShow
            friends={ this.props.friends }
            currentAttendees={ this.state.currentAttendees }
            event={ this.state.currentEvent }
            isGoing={ this.state.isGoing }
            messages={ this.state.messages }
            handleDeclineEvent={ this.handleDeclineEvent }
            handleAcceptEvent={ this.handleAcceptEvent }
            renderNewMessage={ this.renderNewMessage }
            getEvents={ this.props.getEvents }
            history={ this.props.history }
            accessToken={ this.props.allState.facebookToken }
            buttonDecline={ this.state.buttonDecline }
            buttonAccept={ this.state.buttonAccept }
            currentEvent={ this.state.currentEvent }
            currentUser={ this.props.currentUser }
            socket={ this.state.socket }
          />
        </div>
      </div>
    );
  }
}
