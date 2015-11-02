// Requires \\
var express = require('express');
var bodyParser = require('body-parser');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/testdb')
var session = require('express-session');
var passport = require('passport');
var passportConfig = require('./config/passport'); 
// Create Express App Object \\
var app = express();

app.use(session({
	secret: 'secret',
	resave: true,
	saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));

// Routes \\
var testController = require('./controllers/testcontroller')
var authenticationController = require('./controllers/authentication');

app.get('/', function(req, res){
	console.log('get request')
    res.sendFile('/html/home2.html', {root : './public'})
});


// Our get request for viewing the login page
app.get('/auth/login', authenticationController.login);

// Post received from submitting the login form
app.post('/auth/login', authenticationController.processLogin);

// Post received from submitting the signup form
app.post('/auth/signup', authenticationController.processSignup);

// Any requests to log out can be handled at this url
app.get('/auth/logout', authenticationController.logout);

// This route is designed to send back the logged in user (or undefined if they are NOT logged in)
app.get('/api/me', function(req, res){
	res.send(req.user)
})

app.get('/profile/:username/:chartname', function(req, res){
  res.sendFile('/html/chart.html', {root : './public'})
});


app.get('/chart/:username/:chartname', testController.findChart)

app.use(passportConfig.ensureAuthenticated);

app.post('/chart/', testController.chartSave)


// app.get('/profile/:heroName', function(req, res){
//   res.sendFile('/html/hero.html', {root : './public'})
// });

// app.post('/api/test', testController.testFunction)
// Hero Routes
// app.post('/api/heroes', heroCtrl.createHero)
// app.get('/api/heroes', heroCtrl.findHeroes)
// app.get('/api/heroes/:heroName', heroCtrl.findHeroes)
// req.params -> {heroName : 'gorilla'}

// Creating Server and Listening for Connections \\
var port = 80;
app.listen(port, function(){
  console.log('Server running on port ' + port);

});
