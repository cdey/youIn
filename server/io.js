var sockets = require('socket.io');
var io;
var Message = require('./models/messages');

module.exports = {
	io: function() {
		return io;
	},

	init: function(server) {
		io = sockets(server);

		io.on('connection', function(socket) {
			console.log('Connected to sockets.');

			socket.on('chat-join', function(data) {
				/* assumes object
					{
						user_id: int
					}
				*/
				Message.getUserEvents(data.user_id)
				.then(function(result) {
					// assumes result is an array of event ids
					var rooms = result.map(function(room) {
						return 'room:' + room.event_id;
					});
					rooms.push('room:new-rooms');
					rooms.forEach(function(room) {
						socket.join(room, function() {
							/* Uncomment next line to debug socket joining rooms. */
							// console.log(socket.id, ' joined room ', room)
						});
					})
				});
			});

			socket.on('send-message', function(data) {
				console.log('Sockets: received message ', data);
			  var room = data.event_id;
			  var user = data.user_id;
			  var obj = {
			  	user_id: user,
			  	event_id: room
			  }
			  Message.getUserEvent(obj)
			  .then((result) => {
			  	if (result.length > 0) {
				  // socket.join(`${room}`, function() {
				    // new message object retrieved from db.
				    Message.write(data)
				    	.then(function (result) {
				    // sends a response of new-message event to all people in the event room.
					      io.to(`room:${room}`)
					      .emit('new-message', result);
					    })
					    .catch((err) => {
					      console.error(err, 'an error in db retrieval');
					      socket.emit('error', 'bad request with write');
					    });
				  // });
			  	} else {
			  		socket.emit('error', 'no access');
			  	}
			  }).catch((err) => {
			  	console.error(err, 'error in authentication, user not listed with event');
			  	socket.emit('error', 'bad request with getUserEvent');
			  });
			});

			socket.on('disconnect', function() {
				console.log('client disconnected');
			});
		})

		return io;
	}
}
