var express 	 = require('express');
var fortune 	 = require('./lib/fortune.js');
var formidable = require('formidable');

var app = express();

var handlebars = require('express3-handlebars').create({
	  defaultLayout:'main',
    helpers: {
      section: function(name, options){
        if(!this._sections) this._sections = {};
        this._sections[name] = options.fn(this);
        return null;
       	}
    }
});
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', process.env.PORT || 3000);
app.use(express.static(__dirname + '/public'));
app.use(require('body-parser')());
app.use(function(req, res, next) {
	res.locals.showTests = app.get('env') !== 'production' && req.query.test === '1';
	next();
});

app.get('/contest/vacation-photo',function(req,res) {
	var now = new Date();
	res.render('contest/vacation-photo', {
		year: now.getFullYear(),month: now.getMonth()
  });
});

app.post('/contest/vacation-photo/:year/:month', function(req, res) {
	var form = new formidable.IncomingForm();
	form.parse(req, function(err, fields, files) {
		if (err) return res.redirect(303, '/error');
		console.log('received fields:');
		console.log(fields);
		console.log('received files:');
		console.log(files);
    res.redirect(303, '/thank-you');
  });
});


app.get('/newsletter', function(req, res) {
	res.render('newsletter', {csrf: 'CSRF token goes here'});
});

app.post('/process', function(req, res){
	if (req.xhr || req.accepts('json,html')==='json') {
		res.send({success: true});
	} else {
  res.redirect(303, '/thank-you');
  }
});

app.get('/tours/hood-river', function(req, res) {
				res.render('tours/hood-river');
});

app.get('/tours/oregon-coast', function(req, res) {
				res.render('tours/oregon-coast');
});

app.get('/tours/request-group-rate', function(req, res) {
				res.render('tours/request-group-rate');
});

function getWeatherData(){ 
	return {
  	locations: [
      {
      	name: 'Portland',
        forecastUrl: 'http://www.wunderground.com/US/OR/Portland.html',
        iconUrl: 'http://icons-ak.wxug.com/i/c/k/cloudy.gif',
        weather: 'Overcast',
        temp: '54.1 F (12.3 C)',
			},
			{
				name: 'Bend',
				forecastUrl: 'http://www.wunderground.com/US/OR/Bend.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/partlycloudy.gif',
				weather: 'Partly Cloudy',
				temp: '55.0 F (12.8 C)',
			},
			{
				name: 'Manzanita',
				forecastUrl: 'http://www.wunderground.com/US/OR/Manzanita.html',
				iconUrl: 'http://icons-ak.wxug.com/i/c/k/rain.gif',
				weather: 'Light Rain',
				temp: '55.0 F (12.8 C)',
			},
		],
	};
}

app.use(function(req, res, next) {
	if(!res.locals.partials) res.locals.partials = {}; 
	res.locals.partials.weather = getWeatherData(); 
	next();
});

app.get('/nursery-rhyme', function(req, res){ res.render('nursery-rhyme');
});
app.get('/data/nursery-rhyme', function(req, res){
  res.json({
    animal: 'squirrel',
    bodyPart: 'tail',
    adjective: 'bushy',
    noun: 'heck',
	}); 
});

app.get('/', function(req, res) {
	res.render('home');
});

app.get('/about', function(req, res) {
				res.render('about', {
								fortune: fortune.getFortune(),
								pageTestScript: '/qa/tests-about.js'
				});
});
app.use(function(req, res) {
	res.status(404);
	res.render('404');
});

app.use(function(err, req, res, next) {
	console.error(err.stack);
	res.status(500);
	res.render('500');
});

app.listen(app.get('port'), function() {
	console.log('Express listening on http://localhost:' + app.get('port'));
});

