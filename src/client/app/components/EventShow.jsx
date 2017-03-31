import React from 'react';
import ShortInfo from './ShortInfo.jsx';
import AttendingList from './AttendingList.jsx';
import MessageInputBox from './MessageInputBox.jsx';
import Chatbox from './Chatbox.jsx';
import CreateEventButton from '../CreateEventButton.jsx';
import DeleteButton from './DeleteButton.jsx';

const EventShow = (props) => (
  // functions here
  <div className='event-show'>
    <CreateEventButton 
      friends={ props.friends } 
      getEvents={ props.getEvents } 
      history={ props.history } 
    />
    <ShortInfo 
      event={ props.event } 
    />
    <AttendingList
      friends={ props.friends }
      isGoing={ props.isGoing }
      handleDeclineEvent={ props.handleDeclineEvent }
      handleAcceptEvent={ props.handleAcceptEvent }
    />
    <DeleteButton 
      event={ props.event } 
      accessToken={ props.accessToken }
    />
    <Chatbox
      messages={ props.messages }
      renderNewMessage={ props.renderNewMessage }
    />
  </div>
);

export default EventShow;
