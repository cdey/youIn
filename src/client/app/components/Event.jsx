import React from 'react';

const Event = (props) => (
  <a className={props.currentEvent.event_id === props.event.event_id ? 'item active' : 'item'}
  	onClick={ () => props.handleSidebarEventClick(props.event) }>
    { props.event.title }
    { console.log(props) }
    { 
      props.event.unread_messages && 
      props.event.unread_messages.length > 0 &&
      props.currentEvent.event_id !== props.event.event_id ? props.event.unread_messages.length : ''
    }

  </a>
);

export default Event; 

    // { props.event.unread_messages && props.currentEvent.event_id !== props.event.event_id ? props.event.unread_messages.length : '34432' }
