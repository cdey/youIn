import React from 'react';
import $ from 'jquery';

export default class DeleteButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      confirm: false
    }
    //bind methods here
    this.deleteEvent = this.deleteEvent.bind(this);
    this.updateEventStatus = this.updateEventStatus.bind(this);
  }
  //insert methods here


  updateEventStatus(url) {
    // AJAX request to delete event from users list in the database
    // console.log('yo', this.props.accessToken);
    $.ajax({
      url: url,
      method: 'POST',
      'Content-type': 'application/json',
      beforeSend: (xhr) => {
        xhr.setRequestHeader ('Authorization', 'Bearer ' + this.props.accessToken);
      },
      data: {
        eventId: JSON.stringify(this.props.event.event_id)
      },
      success: data => {
        console.log('Success');
        this.props.deleteEvent(this.props.event.event_id)
      },
      error: function(err) {
        console.log('Error in updateEventStatus in DeleteButton.jsx', err);
      }
    });
  }

  deleteEvent () {
    console.log('event DELETED!');
    this.updateEventStatus('/delete/owner');

  }

  render() {
    return (
      <button id="owner-delete-button" 
        className="ui labeled icon button right floated"
        onClick={ this.deleteEvent }>
        <i className="trash icon"></i>
        Delete this Event
      </button>
    );
  }
}