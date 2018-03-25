
module.exports = function(){

	// 1. takes in the array of objects received by our get request (data)
	// 2. transforms array to project specifications, day by day
	// 3. passes data on to output function
	this.transformData = function(data){

		var json = {};
		var previousEntry = {};

		// sorts data by oldest first
		data.sort(compareDates);

		// 
		for (var i = 0; i < data.length; i++){

			if (i === 0){
				var highValue = 0;
				var lowValue = data[i].lastPrice;
			}

			// take one day's raw data and turn it into one day's formatted data
			var value = transformEntry(data[i], data[i-1], highValue, lowValue);

			// add formatted day's data to object
			json[formatDate(data[i].timestamp)] = value;

			if (data[i].lastPrice > highValue){
				highValue = data[i].lastPrice;
			}

			if (data[i].lastPrice < lowValue){
				lowValue = data[i].lastPrice;
			}
		}

		var outputformat = getArgs();
		outputData(json, outputformat);

	};

	// function used to sort incoming data by timestamp
	this.compareDates = function(a, b){
		var compare = 0;
		if (a.timestamp > b.timestamp){
			compare = 1;
		} else if (a.timestamp < b.timestamp){
			compare = -1
		}
		return compare;
	};

	this.transformEntry = function(entry, previousEntry, highValue, lowValue){
		var price = 0;
		var priceChange = '';
		var change = '';
		var dayOfWeek = '';
		var highSinceStart = false;
		var lowSinceStart = false;

		if (previousEntry){
			// not first day
			price = entry.lastPrice;
			priceChange = Math.round((entry.lastPrice - previousEntry.lastPrice)*100)/100;

			if(priceChange > 0){
				change = 'up';
			} else if(priceChange < 0){
				change = 'down';
			} else {
				change = 'no change';
			}

			dayOfWeek = getDayofWeek(formatDate(entry.timestamp));

			if (price > highValue){
				highSinceStart = true;
			} else {
				highSinceStart = false;
			}

			if (price < lowValue){
				lowSinceStart = true;
			} else {
				lowSinceStart = false;
			}

		} else {
			// first day
			price = entry.lastPrice;
			priceChange = 'na';
			change = 'na';
			dayOfWeek = getDayofWeek(formatDate(entry.timestamp));
			highSinceStart = true;
			lowSinceStart = true;

		}

		entry = {"price":price, "priceChange":priceChange, "change":change, "dayOfWeek":dayOfWeek, "highSinceStart":highSinceStart, "lowSinceStart":lowSinceStart};

		return entry;
	};


	// gets command line argument sent from npm command. Used to determine output format.
	this.getArgs = function(){
		return process.argv[2];
	};

	this.formatDate = function(timestamp) {
		//'2017-12-15T10:55:00.000Z'
		var newTimestamp = timestamp.split("T")[0];
		return newTimestamp;
	};

	this.getDayofWeek = function(date) {
		var parts = date.split("-");
		var myDate = new Date(parts[0], parts[1] - 1, parts[2]);
		var dayAsNumber = myDate.getDay();
		var dayOfWeek = '';
		switch(dayAsNumber){
			case 0:
				dayOfWeek = 'Sunday';
				break;
			case 1:
				dayOfWeek = 'Monday';
				break;
			case 2:
				dayOfWeek = 'Tuesday';
				break;
			case 3:
				dayOfWeek = 'Wednesday';
				break;
			case 4:
				dayOfWeek = 'Thursday';
				break;
			case 5:
				dayOfWeek = 'Friday';
				break;
			case 6:
				dayOfWeek = 'Saturday';
				break;
			default:
				dayOfWeek = 'error';
		}
		return dayOfWeek;
	};


	this.displayHTML = function(jsonData){
		var html = '<html><meta charset="utf8"><style>'+''+'</style><body><div id="data">'+JSON.stringify(jsonData)+'</div></body></html>';
		return html;
	};


	this.outputData = function(data, outputformat){
		//console.log(data);
		//console.log(outputformat);

		switch(outputformat) {
			case "file":
				var fs = require('fs');
				var content = JSON.stringify(data);

				if (!fs.existsSync('./output')) {
					fs.mkdirSync('./output');
				}

				fs.writeFile("./output/result.json", content, 'utf8', function(err){
					if (err){
						console.log(err);
					}
					console.log("file saved to output/result.json");
				});
				break;
			case "web":
				var http = require('http');
				http.createServer(function(request, response){
					response.writeHead(200, {'Content-type':'text/html'});
					response.write(displayHTML(data));
					response.end();
				}).listen(6789);
				console.log("results displayed at localhost:6789");
				break;
			default:
				console.log("please specify output format");
		}
	};

}