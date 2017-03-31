import React from 'react';
import io from 'socket.io-client';

export default class MessageInputBox extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			text: '',
			socket: ''
		}

		this.updateText = this.updateText.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	componentDidMount() {
		// let socket = io();
		// this.setState({
		// 	socket: socket
		// });
	}

	sendMessage() {
		let message = {
			event_id: this.props.eventId,
			user_id: this.props.userId,
			text: this.state.text,
			created: new Date()
		}
		console.log(message);
		// let socket = this.state.socket;
		// socket.emit('send-message', message);
	}

	updateText(event) {
		this.setState({
			text: event.target.value
		});
	}

	render() {
		return (
			<div className="message-input-box">
				<input type="text" placeholder="Message"
					value={ this.state.text }
					onChange={ this.updateText } />
				<button
					onClick={ this.sendMessage }>Send</button>
			</div>
		)
	}
}

MessageInputBox.propTypes = {
	eventId: React.PropTypes.number,
	userId: React.PropTypes.number
}