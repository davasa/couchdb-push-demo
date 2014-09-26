CouchDB Push Demo
=================

A very simple demo of push notifications from CouchDB messages.

How to use it
-------------

* Preparation
  * Install and start CouchDB locally
  * Create a database called _messages_
  * Clone this repo
* From the root directory run:
  ```bash
  npm install
  npm start
  ```
* In a browser window
 * Navigate to: `http://localhost:3000`
 * Type in an id, e.g. _test_id_ and hit Enter
* In a bash shell type
  ```bash
  curl -X POST http://localhost:5984/messages -d'{"type": "message", "to": "test_id", "payload": "test notification"}' -H "Content-Type: application/json"
  ```
* Enjoy!

Credits
-------

This demo is partly based on [socket.io's chat example](https://github.com/Automattic/socket.io/tree/master/examples/chat).
