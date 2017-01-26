import express from 'express'
import config from './../config.js'
import bodyParser from 'body-parser'
import { handleMessage } from './bot.js'
import { receivedPostback } from './bot.js'


function setMenu(){
console.log('setting menu...')
var request = require('request');
 return new Promise((resolve, reject) => {
  request({
    url: 'https://graph.facebook.com/v2.6/me/thread_settings',
    qs: {access_token: config.pageAccessToken},
    method: 'POST',
    json:{
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
              title:"Say hello",
              payload:"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
            },
            {
              type:"web_url",
              title:"View Website",
              url:"https://google.com/"
            }
          ]
    }
  }, function(error, response, body) {
      console.log('menu set successfully')
       //console.log(response)
      if (error) {
        console.log('Error sending messages: ', error)
      } else if (response.body.error) {
        console.log('Error: ', response.body.error)
      }
    })
  })
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