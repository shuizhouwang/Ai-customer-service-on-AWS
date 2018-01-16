'use strict';

// libraries and imports
const AWS = require('aws-sdk');
AWS.config.update({
  region: '',
  accessKeyId:'',
  secretAccessKey:''

});

var sendMessage = "";
const uuidv4 = require('uuid/v4');
const path = require('path');
const express = require('express');
const app = express();
const http = require('http').Server(app);
const bodyParser = require('body-parser');
const io = require('socket.io')(http);
const port = process.env.PORT || 3000;
var sessionAttributes = {};
// application-specific variables
const state = {};
const sockets = {};

const lexruntime = new AWS.LexRuntime({apiVersion: '2016-11-28'});
const s3 = new AWS.S3({apiVersion: '2006-03-01'});
// helper function for initializing state
const initState = function() {
  return {
    name: '',
    messages: [],
    conversationId: uuidv4() // auto-assign conversationId
  };
};

// wraps a string as a text message
// ready to be sent through socket.io
const textMessage = function(text) {
  if (typeof text !== 'string') {
    throw new Error('text parameter needs to be a string');
  }

  return JSON.stringify({
    text: text
  });
  return text;
};


io.on('connection', function(socket) {

  console.log(`socket ${socket.id} connected ${new Date().toISOString()}`);

  sockets[socket.id] = socket;

  let socketRef = socket;

  socket.on('handshake', function(userObj) {
    console.log(`received handshake for user`, userObj);

    try {
      let user = JSON.parse(userObj);
      let userId = user.userId;
      console.log(userId);

      // if a state object does not exist
      // for this user, create a new one
      if (!state[userId]) {
        state[userId] = initState();
        state[userId].name = user.name;
      }

      // event handler for messages from this particular user
      socketRef.on(userId, function(message) {
        console.log(`received message for ${userId}`, message);

        let currentState = state[userId];

        // track the message
        currentState.messages.push(message);
        console.log(message);
        sendMessage=sendMessage.concat(message);
        sendMessage=sendMessage.concat(".");

		var params = {
			botAlias: '$LATEST',
			botName: 'CoffeeBot',
			inputText: message,
			userId: userId,
			sessionAttributes: sessionAttributes
		}

 lexruntime.postText(params, function(err, data) {
  if (err) {console.log(err, err.stack);} // an error occurred
  if (data)
  {
  console.log(data);
  console.log(JSON.stringify(data));
  sessionAttributes = data.sessionAttributes;
  if(data.message!=null){
    //var m=JSON.parse(data.message);
    sendMessage=sendMessage.concat(data.message);
    socket.emit(userId, textMessage(data.message));}

  else{
    //data['con_id']=conversationId;

    /*const initState = function() {
  return {
    name: '',
    messages: [],
    conversationId: uuidv4() // auto-assign conversationId
  };
};*/
    data['con_id']=initState()['conversationId'];
    data['user_id']=userId;
    //console.log(data.intentName);

    data['con_con']=sendMessage;
    console.log(data.con_con);

    /*if(data.intentName=="cafeOrderBeverageIntent"){
      var s1=data.slots.BeverageType.concat(" is what I want. ");
      var s2=data.slots.BeverageSize.concat(" is what I want. ");
      var s5=data.slots.BeverageTemp.concat(" is what I want. ");
      var s4=data.slots.Creamer.concat(" is what I want. ");
      var m=s1.concat(s2,s5,s4);
      data['con_con']=m;

    }

    if(data.intentName=="cafeOrderDinnerIntent"){
      console.log("test success!");

    }*/

    console.log(data);
    console.log(JSON.stringify(data));
    //socket.emit(userId, textMessage(JSON.stringify(data)));
    socket.emit(userId, textMessage("Thank you for your order!"));

    var params2 = {
          Bucket: '',
          Key: data.intentName,
          Body: JSON.stringify(data),
          ContentType: 'application/json'
        };

    //console.log("ust before s3 line");
    s3.putObject(params2, function (perr, pres) {
      if (perr) {
        console.log("Error uploading data: ", perr);
      } else {
        console.log("Successfully uploaded data to myBucket/myKey");
      }
    });


  }
  }          // successful response
});

        // TODO: below, you need to handle the incoming message
        // and use Lex to disambiguate the user utterances
           /*socket.emit(userId, textMessage(`Hi there. I'm under development, but should be functional soon :)`));*/




      });
    } catch (handshakeError) {
      console.log('user handshake error', handshakeError);
    }
  });

  socket.on('agentHandshake', function(agentObj) {
    console.log(`received handshake for agent`, agentObj);

    // TODO
  });

  socket.on('disconnect', function() {
    console.log(`socket ${socket.id} disconnected at ${new Date().toISOString()}`);
    if (sockets[socket.id]) delete sockets[socket.id];
  });

});

// middleware
app.use(bodyParser.urlencoded());
app.use(bodyParser.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

http.listen(port, function() {
  console.log('listening on *:' + port);
});

// serve up agent dashboard
app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, 'index.html'));
});
