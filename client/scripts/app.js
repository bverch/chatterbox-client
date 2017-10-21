// YOUR CODE HERE:

var app = {

  // fills the messageContainer
  init: function() {

    $(document).ready(function() {

      $('#postMessage').on('click', function(event) {
        var message = app.composeMessage();
        app.postMessage(message);
      });        
    });

// 1. on click, no alert.
// 2. text in the box is not making it to the obj

  // calls render messages on initial fetch of messages
  // appendTo("body")
  },

  // method for preparing an object to pass into postMessages
  composeMessage: function() {
    var message = {};
    var username = document.location.href.slice(document.location.href.indexOf('username='));
    message['username'] = username.slice(9); 
    // 2. We need the text from the input box.
    // message.text = $('textarea').val();
    message.text = document.getElementById('messageBox').value;
    // 3. We need a roomname. default to lobby
    message.roomname = 'lobby';

    return message;
  },

  postMessage: function(message) {
    console.log(JSON.stringify(message));
  // needs $.ajax
    $.ajax({
      // This is the url you should use to communicate with the parse API server.
      url: 'http://parse.sfm6.hackreactor.com/chatterbox/classes/messages',
      type: 'POST',
      data: message, // ?? We removed JSONStringify here from the message arg
      contentType: 'application/json; charset=utf-8',
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
  },

  filterMessagesByRoomName: function() {

  }
// // Room name list: append room names to ".roomSelector"
//   app.fetchRoomNames = function() {

//   };


};

app.init();


// Button on click needs to clean out the box of text.
// Nice to have: Refresh every 10 seconds




// // filters messages
// app.filterMessagesByRoomName = function() {

// };


// // render message onto the DOM
//   app.renderMessage = function() {

//   };

// Add rooms to the DOM = somehow make new roomname filter
// You can filter this blob and get all the room names
// Or somehow keep track of added roomnames?

// events
// Add a friend by clicking their username

// 

//};


// Question: How do we know all the room names?





