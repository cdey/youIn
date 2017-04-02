import React from 'react';
import moment from 'moment';
import tz from 'moment-timezone';

const MessageListEntry = (props) => {
  let name = props.message.firstname + ' ' + props.message.lastname;
  let ago = moment().tz('America/Los_Angeles').fromNow();

  return (
    <div className="item">
      <div className="content">
        <a className="header">{ name }</a>
        <div className="meta">
          { ago }
        </div>
        <div className="description">
          { props.message.text }
        </div>
      </div>
    </div>
  );
}

export default MessageListEntry;
