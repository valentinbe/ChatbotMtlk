import { replyMessage, replyButton, replyCallButton, getUserInfo } from './facebook.js'
import config from './../config.js'
import { Client } from 'recastai'

const client = new Client(config.recastToken, config.language)

function handleMessage(event) {
  const senderID = event.sender.id
  const messageText = event.message.text
  const messageAttachments = event.message.attachments
  if (messageText) {
    if(messageText=="Button")
    {
      const options = {
          messageText: null,
          buttonTitle: 'Enter website',    /* Option of your button. */
          buttonUrl: 'www.meeterlink.fr',   /* If you like more option check out ./facebook.js the function replyButton, and look up */
          buttonType: 'web_url',             /* the facebook doc for button https://developers.facebook.com/docs/messenger-platform/send-api-reference#message */
          elementsTitle: 'Visit Meeterlink',
        }
        replyButton(senderID, options)        /* to reply a button */
    } else{
      client.textConverse(messageText, { conversationToken: senderID }).then((res) => {
      const reply = res.reply()               /* To get the first reply of your bot. */
      const replies = res.replies             /* An array of all your replies */
      const action = res.action               /* Get the object action. You can use 'action.done' to trigger a specification action when it's at true. */

      if (!reply) {
        const options = {
          messageText: null,
          buttonTitle: 'My first button',    /* Option of your button. */
          buttonUrl: 'https://recast.ai/',   /* If you like more option check out ./facebook.js the function replyButton, and look up */
          buttonType: 'web_url',             /* the facebook doc for button https://developers.facebook.com/docs/messenger-platform/send-api-reference#message */
          elementsTitle: 'I don\'t get it :(',
        }
        replyButton(senderID, options)        /* to reply a button */
      } else {
          if (action && action.done === true) {
            console.log('action is done')
            // Use external services: use res.memory('notion') if you got a notion from this action
          }
          let promise = Promise.resolve()
          replies.forEach(rep => {
            promise = promise.then(() => {
              if(rep== "bonjour en anglais")
              {
                getUserInfo(senderID)
              } else{
                replyMessage(senderID,rep)
              }
            })
          })
          promise.then(() => {
            console.log('ok')
          }).catch(err => {
            console.log(err)
          })
        }
      }).catch(err => {
        console.log(err)
      })
    }
    } else if (messageAttachments) {
      replyMessage(senderID, 'Message with attachment received')
    }  
}

//custom 
function receivedPostback(event) {
  const senderID = event.sender.id
  const recipientID = event.recipient.id
  const timeOfPostback = event.timestamp

  // The 'payload' param is a developer-defined field which is set in a postback 
  // button for Structured Messages. 
  const payload = event.postback.payload

  console.log("\nReceived postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);

  switch(payload){
    case 'DEVELOPER_DEFINED_PAYLOAD_FOR_HELP':
      //replyMessage(senderID, "You asked for help...");
      const options = {
          message:"Ask for help to our representative",
          type:"phone_number",
          title:"Call",
          payload:"+33676395561"
        }
        replyCallButton(senderID, options)        /* to reply a button */
      break;
    default:
      replyMessage(senderID, "Unknown Postback called");
  }
  
}
//end custom

module.exports = {
  handleMessage,
  receivedPostback,
}
