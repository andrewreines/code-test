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
*/

'use strict'

const https = require('https');
const url = "https://www.bitmex.com/api/v1/instrument/compositeIndex?symbol=.XBT&filter=%7B%22timestamp.time%22%3A%2210%3A55%3A00%22%2C%22reference%22%3A%22BSTP%22%7D&count=100&reverse=true";

// 1. takes in the array of objects received by our get request
// 2. transforms array to project specifications
// 3. passes data on to output function
function transformData(data){
	console.log(data);
}


// 1. takes in data from transformData()
// 2. depending on desired output format [file|web], either output final results to output directory or spin up http server to view final results 
function outputData(data, format){
	switch(format){

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
