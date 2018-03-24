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

'use strict'

const https = require('https');
const url = "https://www.bitmex.com/api/v1/instrument/compositeIndex?symbol=.XBT&filter=%7B%22timestamp.time%22%3A%2210%3A55%3A00%22%2C%22reference%22%3A%22BSTP%22%7D&count=100&reverse=true";


// gets command line argument sent from npm command. Used to determine output format.
function getArgs(){
	return process.argv[2];
}


// function used to sort incoming data by timestamp
function compareDates(a, b){
	let compare = 0;
	if (a.timestamp > b.timestamp) {
		compare = 1;
	} else if (a.timestamp < b.timestamp){
		compare = -1
	}
	return compare;
}


// 1. takes in the array of objects received by our get request
// 2. transforms array to project specifications
// 3. passes data on to output function
function transformData(data){

	data.sort(compareDates);

	console.log(data);

	var outputformat = getArgs();

	outputData(data, outputformat);
}


// 1. takes in data from transformData()
// 2. depending on desired output format [file|web], either output final results to output directory or spin up http server to view final results 
function outputData(data, outputformat){
	console.log(data);
	console.log(outputformat);

	switch(outputformat) {
		case "file":
			break;
		case "web":
			break;
		default:
			console.log("please specify output format");
	}
}

//get data and begin process
https.get(url, res => {
	res.setEncoding("utf8");
	let body = "";
	res.on("data", data => {
		body += data;
	});
	res.on("end", () => {
		body = JSON.parse(body);
		transformData(body);
	});
});
