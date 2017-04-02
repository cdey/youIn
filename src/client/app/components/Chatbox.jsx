import React from 'react';
import MessageInputBox from './MessageInputBox.jsx';
import MessageList from './MessageList.jsx';

const Chatbox = (props) => {
  let messages = props.messages.filter(message => message.event_id === props.currentEvent.event_id);

  return (
    <div>
      <MessageList messages={ messages } />
      <MessageInputBox
        userName={ props.userName }
        currentUser={ props.currentUser }
        currentEvent={ props.currentEvent }
        renderNewMessage={ props.renderNewMessage }
        socket= { props.socket }
        />
    </div>
  );
}

export default Chatbox;
