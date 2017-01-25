import express from 'express'
import config from './../config.js'
import bodyParser from 'body-parser'
import { handleMessage } from './bot.js'
import { receivedPostback } from './bot.js'

function sendThreadSettings(messageData) {
  return new Promise((resolve, reject) => {
   console.log('Passing')
    request({
      uri: 'https://graph.facebook.com/v2.6/me/thread_settings',
      qs: { access_token: config.pageAccessToken },
      method: 'POST',
      json: messageData,
    }, (error, response) => {
      if (!error && response.statusCode === 200) {
        console.log('Thread settings set correctly')
        resolve()
      } else {
        console.log('ERROR')
        reject(error)
      }
    })
  })
}


function setMenu(){
  const menuData = {
    setting_type : "call_to_actions",
    thread_state : "existing_thread",
    call_to_actions:[
      {
        type:"postback",
        title:"Help",
        payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
      },
      {
        type:"postback",
        title:"Hello world",
        payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER"
      }
    ]
  }
  sendThreadSettings(menuData)
}




const facebookConfig = {
  pageAccessToken: config.pageAccessToken,
  validationToken: config.validationToken,
}

/*
* Creation of the server
*/

const app = express()
app.set('port', process.env.PORT || config.port || 5000)
app.use(bodyParser.json())

/*
* connect your webhook
*/

app.get('/webhook', (req, res) => {
  if (req.query['hub.mode'] === 'subscribe' &&
  req.query['hub.verify_token'] === facebookConfig.validationToken) {
    console.log('Validating webhook')
    res.status(200).send(req.query['hub.challenge'])
  } else {
    console.error('Failed validation. Make sure the validation tokens match.')
    res.sendStatus(403)
  }
})

/*
* Take care of the messages
*/

app.post('/webhook', (req, res) => {
  const data = req.body
  if (data.object === 'page') {
    data.entry.forEach(pageEntry => {
      pageEntry.messaging.forEach(messagingEvent => {
        if (messagingEvent.message) {
          if (!messagingEvent.message.is_echo) {
            handleMessage(messagingEvent)
          }
        } else if (messagingEvent.postback) {
            receivedPostback(messagingEvent)   
        }
      })
    })
    res.sendStatus(200)
  }
})



app.listen(app.get('port'), () => {
  console.log('Our bot is running on port', app.get('port'))
  /* set messenger side menu */
  setMenu()
})






/*
"type":"phone_number",
          "title":"Call Representative",
          "payload":"+33676395561"*/