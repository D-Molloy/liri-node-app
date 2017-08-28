# liri-node-app
A LIRI (Language Interpretation and Recognition Interface) command line app built with Node.js.  The app uses three node packages to perfrom various functions by entering the following commands:
* node liri my-tweets ~ call twitter using the twitter node package and display the most recent tweets and when they were created
* node liri spotify-this-song [song name] ~ call spotify using the node-spotify-api package to display the artist name, song name, preview link and the album the song was on
* node liri movie-this [movie title] ~ using the node request package, call the OMDB API to return info on the inputted movie.  Displays the following on the screen:  Title, Release Year, IMDB Rating, Rotten Tomatoe rating, Country it was produced in, available languages, actors
* node liri do-what-it-says ~ using the fs core node package, read in the contents of random.txt and call the appropriate function
