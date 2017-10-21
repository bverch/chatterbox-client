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
    // console.log('I\'ve been clicked');
    $.ajax({
      url: app.server,
      type: 'GET',
      'Retry-After': 6000,
      success: function(data) {

// Must render these when they come back.
        app.clearMessages();
        for (var i = 0; i < data['results'].length; i++) {
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
    var string = messageObj['username'] + '\n' + messageObj['text'] + '\n' + messageObj['roomname'] + '\n' + '';
    $('#chats').append('<div class="chat">' + string + '</div>');
  },



  clearMessages: function() {
    // empty out the class='chat'
    document.getElementById('chats').innerHTML = '';
  },


  getRoomNameList: function() {
  // get all the messages back and pull out the roomnames
  // add as option tags

  },
// // Room name list: append room names to ".roomSelector"

  renderRoom: function(newRoomName) {
    // we are adding it to the list of options
    $('#roomSelect').append('<option value="' + newRoomName + '">' + newRoomName + '</option>');
  },

  filterMessagesByRoomName: function() {

  }
//   app.fetchRoomNames = function() {

//   };


};

app.init();


// Nice to have: Refresh every 10 seconds


// Add rooms to the DOM = somehow make new roomname filter
// You can filter this blob and get all the room names
// Or somehow keep track of added roomnames?

// events
// Add a friend by clicking their username

// 

//};


// Question: How do we know all the room names?





