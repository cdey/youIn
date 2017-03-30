import React from 'react';
import ShortInfo from './ShortInfo.jsx';
import AttendingList from './AttendingList.jsx';
import MessageInputBox from './MessageInputBox.jsx';

const EventShow = props => {
  // functions here

  return (
    <div className='event-show'>
      <ShortInfo event={ props.event }/>
      <AttendingList users={ props.users }/>
      <MessageInputBox />
    </div>
  );
};

export default EventShow;
