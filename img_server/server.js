const express = require('express');
const cors = require('cors');
// const fetch = require('cross-fetch');
// const proxy = require('express-http-proxy');


// const API_KEY = 'ed272c50-d3f0-11e9-a98b-17c2205dae62';
// const GOOGLE_API_KEY = 'AIzaSyDQvo1OUA3lvFyyj_0GqpeIDLjIZzKhR9k';

// const GOOGLE_CLIENT_ID = '999074495829-i5499d9aqlel5r1dpbmd1hdftg1mmsck.apps.googleusercontent.com';
// const GOOGLE_CLIENT_SECRET = 'KQcHUHL0mWYipD7kegRv7iFd';


// const baseUrl = new URL('https://api.harvardartmuseums.org');


// proxy all requests to /vue/XXX to locahost:8080; change the port if your vue dev server runs on a different port
// the proxy middleware stripts the /vue from the URL automatically




const app = express();
const port = 3000;

// let session = require('express-session');
// app.use('/vue', proxy('http://localhost:8080'));

app.use(cors());

// Allow the index.html and js files to be accessed
app.use(express.static('public'));

// Serve up the original html and js files if a user is logged in
app.get('/red_green.jpg',
  (req, res) => {
    console.log("Sending uncertainty image!")
    res.sendFile(__dirname + '/public/red_green.jpg');
  });

app.get('/red_yellow.jpg',
  (req, res) => {
    console.log("Sending uncertainty image!")
    res.sendFile(__dirname + '/public/red_yellow.jpg');
  });


// Just to insure that the server is up and running
app.listen(3000, () => {
  console.log(`Express running on localhost:${port}`);
});

