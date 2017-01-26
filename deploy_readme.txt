cd /home/valentin/bot_workspace
1/ ./ngrok http 5000

cd /home/valentin/bot_workspace/bot-messenger
2/ npm start
3/ curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":(
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
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=&&&&&&&&&&&&&&"

EAAH4s316SJ0BANFUAkWvYswJgv2WhTSgeNdEa5OtSrcuuYwC1w5ZBDHaNgZCgZB8fYiX5ZCMeZBQNXGBcqu0tKCv0cMwSSeUR5XZC6ZAWdu4ZCt4fBGZAP2wsLyVu9ChzMCKJFBFZAlwZARvX4dSkrjImXh3CBU8QBjvTTvYmSX6RYHCQZDZD"






curl -X POST -H "Content-Type: application/json" -d '{
  "setting_type" : "call_to_actions",
  "thread_state" : "existing_thread",
  "call_to_actions":[
    {
      "type":"postback",
      "title":"Helpaosse",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_HELP"
    },
    {
      "type":"postback",
      "title":"Start a New Order",
      "payload":"DEVELOPER_DEFINED_PAYLOAD_FOR_START_ORDER"
    }
  ]
}' "https://graph.facebook.com/v2.6/me/thread_settings?access_token=EAAH4s316SJ0BANFUAkWvYswJgv2WhTSgeNdEa5OtSrcuuYwC1w5ZBDHaNgZCgZB8fYiX5ZCMeZBQNXGBcqu0tKCv0cMwSSeUR5XZC6ZAWdu4ZCt4fBGZAP2wsLyVu9ChzMCKJFBFZAlwZARvX4dSkrjImXh3CBU8QBjvTTvYmSX6RYHCQZDZD"    

