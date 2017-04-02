import React from 'react';
import {render} from 'react-dom';
import FriendsListItem from './FriendsListItem.jsx';
import InviteNewFriend from './components/InviteNewFriend.jsx';
import Modal from 'boron/DropModal';
import $ from 'jquery';

class CreateEventButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: {},
      friends:[],
      title: '',
      where: '',
      date: '',
      time: '12:00:00',
      invitees: {},
      invitNew: false,
      description: ''
    }

    this.handleSubmit = this.handleSubmit.bind(this);
    this.inviteFriend = this.inviteFriend.bind(this);
    this.addToUsers_Events = this.addToUsers_Events.bind(this);
    this.handleInviteNewEvent = this.handleInviteNewEvent.bind(this);

  }

  handleInviteNewEvent() {
    this.setState({
      invitNew: !this.state.invitNew
    })
  }

  componentDidMount() {
    this.setState({friends: this.props.friends})
  }


  showModal () {
    this.refs.modal.show();
  }

  hideModal () {
    this.refs.modal.hide();
  }

  callback (event) {
    console.log(event);
  }

  handleChange (name, event) {
    let newState = {};
    newState[name] = event.target.value;
    this.setState(newState);
  }

  inviteFriend(friend) {
    let it = friend.user_id;
    if (this.state.clicked[it]) {
      return () => {

       this.setState((prevState, props) => {
         let clicked = prevState.clicked;
         let invitees = prevState.invitees;
         let id = friend.user_id;
         clicked[id] = false;
         delete invitees[id];
         return {invitees: invitees, clicked: clicked};
       });
      }
    } else {
      return () => {

        this.setState((prevState, props) => {
          let clicked = prevState.clicked;
          let invitees = prevState.invitees;
          let id = friend.user_id;
          invitees[id] = friend;
          clicked[id] = true;
          return {invitees: invitees, clicked: clicked};
        });
      }
    }
  }

  addToUsers_Events(eventId) {
    //post request on new route, events/users
    //include user ids from attendees
    //include data from the event that was created
    let context = this;
    let users = this.state.invitees;
    let userIds = [];
    for(let i in users) {
      userIds.push(users[i].user_id)
    }
    let users_eventsData = {
      userIds: userIds,
      eventId: eventId,
    }

    $.ajax({
      url: '/events/users',
      method: 'POST',
      data: JSON.stringify(users_eventsData),
      contentType: 'application/json',
      success: function(data) {
        console.log('success from addToUsers_Events in CreateEventButton :', data);
        this.hideModal();
        context.props.getEvents(context.props.history, function(result) {
          context.setState({
            ownerEvents: result.ownerEvents,
            friendEvents: result.friendEvents
          });
        });
      }.bind(this),
      error: function(err) {
        console.log('error from addToUsers_Events  in CreateEventButton', err);
        // this.props.history.push('/');
      }.bind(this)
    });
  }


  handleSubmit (event) {
    let context = this;
    event.preventDefault();
    let eventData = {
      owner: '1',//this is hardcoded - we need to have the owner come from who is logged in.
      title: this.state.title,
      description: this.state.description,
      location: this.state.where,
      date: this.state.date,
      time: this.state.time,
    }
    $.ajax({
      url: '/events/create',
      method: 'POST',
      data: JSON.stringify(eventData),
      contentType: 'application/json',
      success: function(data) {
        console.log('data from ajax in CreateEventButton', data.event_id);
        context.addToUsers_Events(data.event_id);
        context.setState({title: '', where: '', date: '', description: ''})
      },
      error: function(err) {
        console.log('ajax', context);
        console.log('error in ajax request in CreateEventButton', err);
      }
    })
  }

  render () {
    return (
      <div>
        <div style={{overflow: 'hidden'}}>
          <button id="create_event" className="ui right floated primary button"
            onClick={this.showModal.bind(this)} >Create Event</button>
        </div>

        <Modal ref="modal"
          modalStyle={{width: '80%'}}>
          <div className="container-fluid">
            <form className="ui form"
              onSubmit={this.handleSubmit.bind(this)}>
              <div className="row">
                <div className="ui large header">
                  Create a New Event
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <div className="inline fields">
                    <div className="sixteen wide field">
                      <label>Event Name</label>
                      <input
                        value={this.state.title}
                        type="text"
                        onChange={this.handleChange.bind(this, 'title')} required
                        />
                    </div>
                  </div>
                  <h4 className='create'>Where</h4>
                  <input
                    value={this.state.where}
                    onChange={this.handleChange.bind(this, 'where')}
                    type="text" required
                    />
                  <h4 className='create'>When</h4>
                  <input
                    value={this.state.date}
                    onChange={this.handleChange.bind(this, 'date')}
                    type="date" required
                    />
                  <input
                    value={this.state.time}
                    onChange={this.handleChange.bind(this, 'time')}
                    type="time" required
                    />
                </div>


              </div>


              <div className="col-md-12">
                <h4 className='create'>Description </h4>
              </div>


              <div className="col-md-12">
                <input
                value={this.state.description}
                onChange={this.handleChange.bind(this, 'description')}
                type="text" required/>
              </div>

              <div
                onClick={ this.handleInviteNewEvent }
              >
                <h4 className='create'>Click Here to Invite New Friend...</h4>
              </div>

              {
                this.state.invitNew &&
                <InviteNewFriend addNewTolist={ this.props.addNewTolist }/>
              }

              <div className="col-md-4">
                <h4 className='create'>Invite from Friends List</h4>
                {
                  this.props.friends &&
                  this.props.friends.map( (friend, i) => (
                    <FriendsListItem
                      key={i}
                      friend={friend}
                      inviteFriend={this.inviteFriend(friend)}
                      />
                    )
                  )
                }
              </div>

              <div className="col-md-12">
                <button type="submit">Submit</button>
              </div>

            </form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default CreateEventButton;
