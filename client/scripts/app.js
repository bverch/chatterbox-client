// YOUR CODE HERE:

var app = {

  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',

  init: function() {
    $(document).ready(function() {
      $('#postMessage').on('click', function(event) {
        var message = app.composeMessage();
        app.postMessage(message);
      });

      $('#getMessages').on('click', function(event) {
        app.getMessages();
      });        

      $('#clearMessages').on('click', function(event) {
        app.clearMessages();
      });        

      $('#roomSelector').on('click', function(event) {
        app.getRoomMessages();
      }); 
      // app.renderRoom('lobby');
      app.getMessages();

    });

  // calls render messages on initial fetch of messages
  // appendTo("body")
  },

  // method for preparing an object to pass into postMessages
  composeMessage: function() {
    var message = {};
    var username = document.location.href.slice(document.location.href.indexOf('username='));

    message['username'] = username.slice(9); 
    message.text = document.getElementById('messageBox').value;
    message.roomname = document.getElementById('roomSelect').value;

    return message;
  },

  postMessage: function(message) {
    $.ajax({
      url: app.server,
      type: 'POST',
      data: message, // ?? We removed JSONStringify here from the message arg
      //contentType: 'application/json; charset=utf-8',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  getMessages: function() {
    $.ajax({
      url: app.server,
      type: 'GET',
      'Retry-After': 6000,
      success: function(data) {

// Must render these when they come back.
        app.clearMessages();
        app.fetchRoomNames(data);
        for (var i = data['results'].length - 1; i > 0; i--) {
          app.renderMessage(data['results'][i]);
        }
      },
      error: function (data) {
        console.log('error!');
      }
    });
  },

// render message onto the DOM
  renderMessage: function(messageObj) {
    //TODO: maybe we should change the test instead of doing this hacky thing
    if (document.getElementById('roomSelect').value === '') {
      var string = messageObj['username'] + '\n' + messageObj['text'] + '\n' + messageObj['roomname'] + '\n' + '';
      $('#chats').append('<div class="chat">' + string + '</div>');
    }
    if (document.getElementById('roomSelect').value === messageObj['roomname']) {
      var string = messageObj['username'] + '\n' + messageObj['text'] + '\n' + messageObj['roomname'] + '\n' + '';
      $('#chats').append('<div class="chat">' + string + '</div>');
    }
  },



  clearMessages: function() {
    // empty out the class='chat'
    document.getElementById('chats').innerHTML = '';
  },

  renderRoom: function(newRoomName) {
    var children = $('#roomSelect').children();
    // we are adding it to the list of options
    var contains = false;
    for (var i = 0; i < children.length; i++) {
      if (children[i].value === newRoomName) {
        contains = true;
      }
    }

    if (!contains) {
      $('#roomSelect').append('<option value="' + newRoomName + '">' + newRoomName + '</option>');
    }
  },

  fetchRoomNames: function(resultsObj) {
    var rooms = {};
    // so we can iterate the array of message objects
    for (var i = 0; i < resultsObj['results'].length; i++) {
      // pull out the roomnames to an obj where key is room name and value is true
      rooms[resultsObj['results'][i]['roomname']] = 1;
    }
// Object.keys(on the roomObj) and loop over and renderRoom.
    Object.keys(rooms).forEach(function(item) {
      app.renderRoom(item);
    });
  },

  handleUsernameClick: function() {

  }



};

app.init();


// Nice to have: Refresh every 10 seconds
// events
// Add a friend by clicking their username





