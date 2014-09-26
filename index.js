// Express.js
var express = require('express');
var app = express();
var server = require('http').createServer(app);
// Socket.IO
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;

// CouchDB
var cradle = require('cradle');
var message_db = new(cradle.Connection)().database('messages');

// Message feed
var message_feed = message_db.changes();
message_feed.filter = function (doc, req) {
  console.log('Something happened...');
  if (doc.type && (doc.type == 'message')) {
    console.log('Message arrived');
    return true;
  } else {
    console.log('False alarm :(');
  }
  return false;
};

// Starting up the server
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Active clients
var sockets = {};

// Handling connections
io.on('connection', function (socket) {

  // Register as active client
  socket.on('register', function (id) {
    socket.id = id;
    sockets[socket.id] = socket;
    console.log(socket.id + ' connected and active');
  });

  // Deregister upon disconnect
  socket.on('disconnect', function () {
    if (sockets[socket.id]) {
      delete sockets[socket.id];
    }
    console.log(socket.id + ' disconnected and inactive');
  });
});

// Pushing notification on message
message_feed.on('change', function (change) {
  var message = change.doc;
  console.log('Routing message ' + JSON.stringify(message.payload) + ' to ' + JSON.stringify(message.to));
  if (sockets[message.to]) {
    sockets[message.to].emit('notification', message.payload);
    console.log('Message delivered to ' + message.to);
  } else {
    // TODO stage undelivered messages
    console.log('Unable to deliver to ' + message.to);
  }
});

// Demo app
app.use(express.static(__dirname + '/public'));
