'use strict';

// Imports dependencies and set up http server
const
requestify=require('requestify'),
  express = require('express'),
  bodyParser = require('body-parser'),
  PageAccessToken='EAAFOSGHruaUBAIxX6i8YWhnAD7mz0POodKwqb1BK2YVyNmn9a4WUuHbA40UdTMOoT00YpbehUZCzKrxf4ZCGsDJdZBmRDBlJn8drXXr2r3qnEQTLoZBcJ8GF0ij3mqdAw1FliRCnrJQ84cY929jlcVBYHckKczYfDLm1pv601PM8xATQuPmSPhr34Rmz0TgZD',
  app = express().use(bodyParser.json()); // creates express http server 
   const sendmessageurl='https://graph.facebook.com/v4.0/me/messages?access_token='+PageAccessToken

  requestify.post('https://graph.facebook.com/v2.6/me/messenger_profile?access_token='+PageAccessToken,
  	{"get_started":{"payload":"Hi"},
  	"persistent_menu":[
  	{
  		"locale":"default",
  		"composer_input_disabled":false,
  		"call_to_actions":[
  		{
  			"type":"postback",
  			"title":"Home",
  			"payload":"Hi"

  		},
  		{
  			"type":"web_url",
  			"title":"Visit Page",
  			"url":"https://mym-acavxb.firebaseapp.com/index.html",
  			"webview_height_ratio":"tall"


  		}
  	]

  }
 ],
  "greeting": [
    {
      "locale":"default",
      "text":"Hello {{user_first_name}}! \nWe provide service!!" 
    }
  ]

}).then(function(success) {
	console.log('persistent_menu.success');
	// body...
})

// Sets server port and logs message on success
app.listen(process.env.PORT || 1337, () => console.log('webhook is listening'));
app.get('/', (req, res)=>{
	res.send("Hello vro!");
})

/

// Adds support for GET requests to our webhook
app.get('/webhook', (req, res) => {

  // Your verify token. Should be a random string.
  let VERIFY_TOKEN = "367547764160933"
    
  // Parse the query params
  let mode = req.query['hub.mode'];
  let token = req.query['hub.verify_token'];
  let challenge = req.query['hub.challenge'];
    
  // Checks if a token and mode is in the query string of the request
  if (mode && token) {
  
    // Checks the mode and token sent is correct
    if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      
      // Responds with the challenge token from the request
      console.log('WEBHOOK_VERIFIED');
   	   res.status(200).send(challenge);
    
    } else {
      // Responds with '403 Forbidden' if verify tokens do not match
      res.sendStatus(403);      
    }
  }
});

// Creates the endpoint for our webhook 
app.post('/webhook', (req, res) => {  
 
  let body = req.body;

  // Checks this is an event from a page subscription
  if (body.object === 'page') {

    // Iterates over each entry - there may be multiple if batched
    body.entry.forEach(function(entry) {

      // Gets the message. entry.messaging is an array, but 
      // will only ever contain one message, so we get index 0
      let webhook_event = entry.messaging[0];
      console.log(webhook_event);
      var senderID=webhook_event.sender.id;
      console.log('senderID',senderID);
      if(webhook_event.postback){
      	var userButton=webhook_event.postback.payload;
      	console.log('reply',userButton);
    }
    if (webhook_event.message) {if (webhook_event.message.text) {
    	var userComment=webhook_event.message.text;
    	console.log('userComment',userComment);
    }
	if (webhook_event.message.attachments){
		var userImage=webhook_event.message.attachments;
		console.log('userPhoto',userImage);

	}}
	 if(userButton == 'Hi' || userComment == 'Hi'){

 
requestify.post(sendmessageurl,
{        
        "recipient":{
    "id":senderID
  },
  "message":{
    "attachment":{
      "type":"template",
      "payload": {
  "template_type":"generic",
  "elements":[
     {
      "title":"Hi",
	  "image_url":"https://sites.psu.edu/siowfa16/files/2016/10/YeDYzSR-10apkm4.png",
      "subtitle":"test",
      "buttons":[{
  "type": "postback",
  "title": "button 1",
  "payload": "payload 1"
},{
  "type": "postback",
  "title": "button 2",
  "payload": "payload 2"
},{
  "type": "postback",
  "title": "button 3",
  "payload": "payload 3"
}
]
},

{
      "title":"SaPal Phyu",
	  "image_url":"https://sites.psu.edu/siowfa16/files/2016/10/YeDYzSR-10apkm4.png",
      "subtitle":"test",
      "buttons":[{
  "type": "postback",
  "title": "button 1",
  "payload": "payload 1"
},{
  "type": "postback",
  "title": "button 2",
  "payload": "payload 2"
},{
  "type": "postback",
  "title": "button 3",
  "payload": "payload 3"
}       
 ]
    
},
{
      "title":"Shwe Sein",
	  "image_url":"https://sites.psu.edu/siowfa16/files/2016/10/YeDYzSR-10apkm4.png",
      "subtitle":"test",
      "buttons":[{
  "type": "postback",
  "title": "button 1",
  "payload": "payload 1"
},{
  "type": "postback",
  "title": "button 2",
  "payload": "payload 2"
},{
  "type": "postback",
  "title": "button 3",
  "payload": "payload 3"
}       
 ]
    
}
]
}
    }
  }
      }).then(function(success){
console.log('successful template');
}).catch(function(error){
console.log('error', error);
  
  });
  }
  
  
    });

    // Returns a '200 OK' response to all requests
    res.status(200).send('EVENT_RECEIVED');
     } else {
    // Returns a '404 Not Found' if event is not from a page subscription
    res.sendStatus(404);
  }

});