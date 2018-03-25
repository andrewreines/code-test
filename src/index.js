#!/usr/bin/env node
/*
code-test npm project
created by Andrew Reines

Tasks:
From a predetermined URL, output a JSON file, or display on a browser or endpoint these values:
[
    "{date}":
    {
        “price”:”{value}"
        "priceChange": "{up/down/same}",
        "change": "{amount}",
        "dayOfWeek":"{name}”,
        "highSinceStart": "{true/false}”,
        “lowSinceStart": "{true/false}”,
    }
]
- Results ordered by oldest date first.
- "Price change" is since previous day in the list, first day can be “na”
- "change" is the difference between previous day in list. “na” for first
- "day of week" is name of the day Saturday, Tuesday, etc
- "high since start” / “low since start” is if this is the highest/lowest price since the oldest date in the list. 




Example raw data for one day:

[{ timestamp: '2017-12-15T10:55:00.000Z',
    symbol: 'BTCUSD',
    indexSymbol: '.XBT',
    reference: 'BSTP',
    lastPrice: 17432.18,
    weight: 0.5,
    logged: '2017-12-15T10:55:00.098Z' }]

*/

require('./functions.js')();

var https = require('https');
var url = "https://www.bitmex.com/api/v1/instrument/compositeIndex?symbol=.XBT&filter=%7B%22timestamp.time%22%3A%2210%3A55%3A00%22%2C%22reference%22%3A%22BSTP%22%7D&count=100&reverse=true";

//get data and begin process
https.get(url, res => {
	res.setEncoding("utf8");
	var body = "";
	res.on("data", data => {
		body += data;
	});
	res.on("end", () => {
		body = JSON.parse(body);
		transformData(body);
	});
});

