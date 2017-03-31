import React from 'react';
import {render} from 'react-dom';
import OwnerEventList from './OwnerEventList.jsx';
import FriendEventList from './FriendEventList.jsx';
import CreateEventButton from './CreateEventButton.jsx';
import Homepage from './Homepage.jsx';
import {users as friends} from '../../../server/data.js';
import {BrowserRouter as Router, Route, Link} from 'react-router-dom';
import Facebook from './Facebook.jsx';
import $ from 'jquery';
import Chat from './components/Chat.jsx';

class App extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      friends: [],
      facebookToken: '',
      userName: '',
      ownerEvents: [],
      friendEvents: []
    }

    this.getUsers = this.getUsers.bind(this);
  }

  componentDidMount() {
    let context = this;
    
    context.getUsers();
  }
  setToken(token) {
    // console.log(token, 'this token went through to the top');
    this.setState({
      facebookToken: token
    });
    // console.log(this.state.facebookToken, 'so does this work?');
  }
  setName(name) {
    this.setState({
      userName: name 
    });
  }

  getUsers() {
    let context = this;
    $.ajax({
      url: '/users',
      method: 'GET',
      contentType: 'application/json',
      success: function(data) {
        console.log('result of get on /users', data);
        context.setState({friends: data});
      },
      error: function(err) {
        console.log('error in ajax get request in CreateEventButton', err);
      }
    })
  }

  getEvents(history, callback) {
    let context = this; 
    $.ajax({
      url: '/events',
      method: 'GET',
      contentType: 'application/json',
      success: callback.bind(this),
      error: function(err) {
        if (err.status >= 400) {
          history.push('/');
        }
      }.bind(this),
    });
  }

  render () {
    return (
      <Router>
      <div>
        <Route exact path='/' component={(props) => {
          return (<Facebook history={props.history} 
            setToken={this.setToken.bind(this)}
            setName={this.setName.bind(this)} 
            getEvents={this.getEvents.bind(this)}/>
          )
        }} />
        <Route path='/homepage' component={(props) => {
          return ( <Homepage ownerEvents={this.state.ownerEvents}
            friendEvents={this.state.friendEvents} friends={this.state.friends} 
            accessToken={this.state.facebookToken} userName={this.state.userName}
            history={props.history}
            getEvents={this.getEvents.bind(this)}/>)
        }} />
        <Route path='/chat' component={(props) => {
          return (
            <Chat 
              history={ props.history } 
              getEvents={ this.getEvents.bind(this)} 
              allState={ this.state }
            />
          )
        }} />
      </div>
      </Router>
    )
  }

}

render(<App/>, document.getElementById('app'));