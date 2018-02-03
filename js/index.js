var express = require('express');
var bodyParser = require('body-parser');
var app = express();
// Initialize the Alexa SDK
var Alexa = require('alexa-sdk');
app.use(bodyParser.json());
app.post('/', function(req, res) {
    // Build the context manually, because Amazon Lambda is missing
    var context = {
        succeed: function (result) {
            console.log(result);
            res.json(result);
        },
        fail:function (error) {
            console.log(error);
        }
    };
    // Delegate the request to the Alexa SDK and the declared intent-handlers
    var alexa = Alexa.handler(req.body, context);
    alexa.registerHandlers(handlers);
    alexa.execute();
});
// Declare handlers for processing the incoming intents

const handlers = {
    'LaunchRequest': function () {
    	this.emit(':ask', 'Welchen Radiosender möchtest du hören?');
	},

	'PlayRadioStationIntent': function () {
	this.emit(':tell', 'Radio wird gespielt.');
	}
};

app.listen(1900, function () {
  console.log('Example app listening on port 1900!');
});
