var express = require("express"),
	path = require("path"),
	morgan = require('morgan'),
	app = express();

app.use(morgan('combined'));

var scripts_dir= '/scripts/';

app.get('/*.css', function(req, res){
	q = req.params[0];
	console.log('browser requesting: ' + q);
	res.sendFile(path.join(__dirname + scripts_dir + q + '.css'));
});

app.get('/*.js', function(req, res){
	q = req.params[0];
	console.log('browser requesting: ' + q);
	res.sendFile(path.join(__dirname + scripts_dir + q + '.js'));
});

app.get('/',function(req,res){
  	q = req.params[0];
  	console.log('browser requesting: ' + q);
  	res.sendFile(path.join(__dirname + '/scripts/html/index.html'));
});


app.listen(8080);