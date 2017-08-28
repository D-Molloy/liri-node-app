//require/link to the file that contains twitter and spotify keys
var keys = require("./keys.js");
//require core cnode package for reading and writing files
var fs = require("fs");
//store the third argument (what LIRI function to run) into a variable
var argOne = process.argv[2];
//prep the last arguement so that it is query friendly
var titleInput = process.argv.slice(3).join("+");
var songQuery = "";
var movieQuery = "";

//append the entered command to log.txt
fs.appendFile("log.txt", process.argv, function(err){if(err){console.log(err);}});

//check if titleInput has a value, if not assign the recommended song/movie to the correct varaible
if (!titleInput) {
	//no song provided: default to The Sign by Ace of base
    songQuery = "the+sign";
    //no movie provided for movie-this, default to Mr. Nobody
    movieQuery = "mr+nobody";
} else {
	//otherwise use the inputted title
    songQuery = titleInput;
    movieQuery = titleInput;
}

//check to see what liri command was inputted and run the correct function
switch (argOne) {
    case "my-tweets":
        myTweets();
        break;
    case "spotify-this-song":
        spotifyThisSong(songQuery);
        break;
    case "movie-this":
        movieThis(movieQuery);
        break;
    case "do-what-it-says":
        doWhatItSays();
        break;
}


//function that shows the last 20 tweets and when they were created
function myTweets() {
	//require the twitter node package
    var Twitter = require('twitter');
    //store the twitter keys from keys.js into a variable
    var twitterKeys = keys.twitterKeys;
    var client = new Twitter(twitterKeys);
    var params = {
        screen_name: 'UNC_LIRI_BOT'
    };
    if (!titleInput) {
    	//call the Twitter API client
        client.get('statuses/user_timeline', params, function(error, tweets, response) {
            if (!error) {
                for (var i = 0; i < tweets.length; i++) {
                	//format the appropriate responses and print to screen
                    console.log("~~~~~~~~~~~~~~~~~~~~~~~~");
                    console.log("Tweet:" + tweets[i].text);
                    console.log("Date: " + tweets[i].created_at);
                }
            } else {
                console.log("There was an error: " + response.body);
            }
        });
    } else {
    	//if a fourth argument is added to the command line along with 'node liri my-tweets' remind the user of the correct syntax
        console.log("~~~~~~~~~~ERROR~~~~~~~~~~");
        console.log("To view Tweets, use command: 'node liri my-tweets'.");
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~");
    }
};

//function that calls the node-spotify-api and returns info on the queried song  
function spotifyThisSong(songQuery) {
	//require the node-spotify-api package
    var Spotify = require('node-spotify-api');
    var spotifyKeys = keys.spotifyKeys;
    var spotify = new Spotify(spotifyKeys);
    spotify.search({
        type: 'track',
        query: songQuery
    }, function(err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }
        var track = data.tracks.items[0];
        //format and print the relevant info to the screen
        console.log("~~~~~~~~~~LIRI Results~~~~~~~~~~");
        console.log("Artist(s): " + track.artists[0].name);
        console.log("Song Name: " + track.name);
        console.log("Song Preview: " + track.preview_url);
        console.log("Album Name: " + track.album.name);
        console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
    });
}

//function that calls the OMDB API
function movieThis(movieQuery) {
    var request = require("request");
    var queryUrl = "http://www.omdbapi.com/?t=" + movieQuery + "&y=&plot=short&apikey=40e9cece";
    request(queryUrl, function(error, response, body) {
        // handle obscure movies with no Rotten Tomato Ratings
        if (!JSON.parse(body).Ratings[0] || !JSON.parse(body).Ratings[1]){
        	console.log("~~~~~~~~~~LIRI Results~~~~~~~~~~");
        	console.log ("That movie couldn't be found.  Please try an alternative spelling or a different movie.");
        	console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        } else if (!error && response.statusCode === 200) {
            //format and print the relevant info to the screen
            var movie = JSON.parse(body);
            console.log("~~~~~~~~~~LIRI Results~~~~~~~~~~");
            console.log("Title: " + movie.Title);
            console.log("Released: " + movie.Year);
            console.log("IMDB Rating: " + movie.imdbRating);
            console.log("Rotten Tomatoes Rating: " + movie.Ratings[1].Value);
            console.log("Produced In: " + movie.Country);
            console.log("Language(s): " + movie.Language);
            console.log("Plot Synopsis: " + movie.Plot);
            console.log("Actors: " + movie.Actors);
            console.log("~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~");
        }
    });
}

//function that reads in the content of random.txt and calls one of the above functions depending on the contents
function doWhatItSays() {
	//read in the txt file
    fs.readFile("random.txt", "utf8", function(error, data) {
        if (error) {
            return console.log(error);
        }
        //create an array of the values
        var dataArr = data.split(",");
  		//store the liri function into variables	
        argOne = dataArr[0];
        
        //decide which function to call and (if needed) pass in the song/movie name
        if (argOne == "my-tweets") {
        	myTweets();
        } else if (argOne == "spotify-this-song"){
        	titleInput = dataArr[1].split(' ').join('+');
        	spotifyThisSong(titleInput);
        } else if (argOne == "movie-this") {
        	titleInput = dataArr[1].split(' ').join('+');
        	movieThis(titleInput);
        } else {
        	console.log("I'm sorry, Dave.  I'm afraid I can't do that.")
        }
    });
}