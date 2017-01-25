import config from './../config.js'
import request from 'request'


function getUserInfo(senderID) {
  var request = require('request');

  var options = {
    url: "https://graph.facebook.com/v2.6/"+senderID+"?fields=first_name,last_name,profile_pic,locale,timezone,gender&access_token="+config.pageAccessToken,
  };

  function callback(error, response, body) {
    if (!error && response.statusCode == 200) {
      var info = JSON.parse(body);
      console.log("Last name: "+ info.last_name);
      console.log("Last name: "+ info.first_name);

      var messageText = "Bonjour "+ /*info.last_name + " " +*/ info.first_name+ " !!";
      replyMessage(senderID, messageText)
      replyPicture(senderID, info.profile_pic).then(()=>{replyWhatsup(senderID)})   
    }
  }
  request(options, callback);
}

/*
* call to facebbok to send the message
*/

function sendMessage(messageData) {
    return new Promise((resolve, reject) => {
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.pageAccessToken },
        method: 'POST',
        json: messageData,
      }, (error, response) => {
        if (!error && response.statusCode === 200) {
          console.log('All good job is done')
          resolve()
        } else {
          reject(error)
        }
      })
    })
}

/*``
* type of message to send back
*/

function replyMessage(recipientId, messageText) {
  return new Promise((resolve, reject) => {

    const messageData = {
      recipient: {
        id: recipientId,
      },
      message: {
        text: messageText,
      },
    }
    sendMessage(messageData).then(() => {
      resolve()
    }).catch( err => {
      reject(err)
    })
  })
}

function replyPicture(recipientId, imgURL) {

    const messageData = {
      recipient: {
        id: recipientId
      },
      message:{
        //text: messageText,
        attachment:{
          type:"image",
          payload:{
            url:imgURL
          }
        }
      }
    }
    console.log('sending pic')
    return new Promise((resolve, reject) => {
      request({
        uri: 'https://graph.facebook.com/v2.6/me/messages',
        qs: { access_token: config.pageAccessToken },
        method: 'POST',
        json: messageData,
      }, (error, response) => {
        if (!error && response.statusCode === 200) {
          console.log('All good job is done')
          resolve()
        } else {
          reject(error)
        }
      })
    })
}


function replyButton(recipientId, option) {
  const messageData = {
    recipient: {
      id: recipientId,
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: [{
            title: option.elementsTitle,
            buttons: [{
              type: option.buttonType,
              url: option.buttonUrl,
              title: option.buttonTitle,
            }],
          }],
        },
      },
    },
  }
  sendMessage(messageData)
}


//custom 
function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  // When a postback is called, we'll send a message back to the sender to 
  // let them know it was successful
  sendTextMessage(senderID, "Postback called");
}
//end custom

module.exports = {
  replyMessage,
  replyButton,
  getUserInfo
}

function replyWhatsup(recipientId){
  const messageData = {
    recipient: {
      id: recipientId,
    },
    "message":{
      "text":"How may I help you today?",
      "quick_replies":[
        {
          "content_type":"text",
          "title":"I want to sign in!",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_YES"
        },
        {
          "content_type":"text",
          "title":"I need help",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
        },
        {
          "content_type":"text",
          "title":"Just wanted to talk",
          "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_PICKING_NO"
        }
      ]
    }
  }
  sendMessage(messageData)
}
