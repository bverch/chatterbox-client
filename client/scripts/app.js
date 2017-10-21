// YOUR CODE HERE:

var app = {

  server: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
  friends: {},

  init: function() {
    $(document).ready(function() {
      $('#postMessage').on('click', function(event) {
        app.handleSubmit();
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
      // contentType: 'application/json; charset=utf-8',
      success: function (data) {
        console.log('chatterbox: Message sent');
      },
      error: function (data) {
        // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
        console.error('chatterbox: Failed to send message', data);
      }
    });
  },

  handleSubmit: function() {
    var message = app.composeMessage();
    app.postMessage(message);
  },

  getMessages: function(messageFilter) {

    $.ajax({
      url: app.server,
      type: 'GET',
      'Retry-After': 6000,
      data: 'order=-createdAt',
      success: function(data) {
        // Must render these when they come back.
        app.clearMessages();
        app.fetchRoomNames(data);
        // app.renderFriendList();
        for (var i = data['results'].length - 1; i >= 1; i--) {
          app.renderMessage(data['results'][i]);
        }
      },
      error: function (data) {
        console.log('error!');
      }
    });
  },

  escapeString: function(string) {
  // loop over the string if the char is '<' substitute &length
    for (var i = 0; i < string.length; i++) {
      if (string[i] === '<') {
        string = string.slice(0, i) + '&lt' + string.slice(i + 1);
      } else if (string[i] === '>') {
        string = string.slice(0, i) + '&gt' + string.slice(i + 1);
      } else if (string[i] === '&') {
        string = string.slice(0, i) + '&amp' + string.slice(i + 1);
      } else if (string[i] === '"') {
        string = string.slice(0, i) + '&quot' + string.slice(i + 1);
      } else if (string[i] === "'") {
        string = string.slice(0, i) + '&#x27' + string.slice(i + 1); 
      } else if (string[i] === '/') {
        string = string.slice(0, i) + '&#x2f' + string.slice(i + 1); 
      }
    }
    return string;
  },


// render message onto the DOM
  renderMessage: function(messageObj) {
    // does this message content match the filters?
    // try to see filter that is selected for both room and friends    


    var span = $('<span/>');
    span.click(function() { app.handleUsernameClick(span); });
    span.text(messageObj['username']);

    var div = $('<div/>');
    div.text(' says: ' + messageObj['text'] + '  in room: ' + messageObj['roomname']);
    div.prepend(span);

    if (document.getElementById('roomSelect').value === '') {
      $('#chats').append(div);
      $('#chats').append('<br>');
    }
    if (document.getElementById('roomSelect').value === escape(messageObj['roomname']) || 
        document.getElementById('friendSelect').value === escape(messageObj['username'])
      ) {
      $('#chats').append(div);
      $('#chats').append('<br>');
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
      if (children[i].value === app.escapeString(newRoomName)) {
        contains = true;
      }
    }

    var option = $('<option/>');
    option.attr('value', newRoomName);
    option.text(app.escapeString(newRoomName));

    if (!contains) {
      $('#roomSelect').append(option);
    }
  },

  renderFriendList: function() {
    // we are adding it to the list of options
    document.getElementById('friendSelect').innerHTML = '';
    for (var k in app.friends) {
      var option = $('<option/>');
      option.attr('value', k);
      option.text(app.escapeString(k));
      $('#friendSelect').append(option);
    }
  },

  
  renderFriendMessages: function(friendName) {
    var children = $('#friendSelect').children(); 
    // we are adding it to the list of options
    var contains = false;
    for (var i = 0; i < children.length; i++) {
      if (children[i].value === app.escapeString(friendName)) {
        contains = true;
      }
    }

    var option = $('<option/>');
    option.attr('value', friendName);
    option.text(app.escapeString(friendName));

    if (!contains) {
      $('#friendSelect').append(option);
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

  fetchFriendNames: function(resultsObj) { // should just be our friend list.
    var friendNames = {};
    // so we can iterate the array of message objects
    for (var i = 0; i < resultsObj['results'].length; i++) {
      // pull out the roomnames to an obj where key is room name and value is true
      friendNames[resultsObj['results'][i]['username']] = 1;
    }
// Object.keys(on the roomObj) and loop over and renderRoom.
    Object.keys(friendNames).forEach(function(item) {
      app.renderFriendMessages(item);
    });
  },



  handleUsernameClick: function(span) {
    console.log(span[0].textContent);
    app.friends[span[0].textContent] = span[0].textContent;
    app.renderFriendList();
  }



};

app.init();


// Nice to have: Refresh every 10 seconds
// events
// Add a friend by clicking their username





