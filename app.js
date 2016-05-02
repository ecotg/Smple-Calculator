var express = require("express"),
	path = require("path"),
	app = express();

app.get('/*', function(req, res){
	q = req.params[0];
	console.log('asking for ' + q);
	console.log('all params');
	console.log(req.params);
	console.log(req.query);
	res.sendFile(path.join(__dirname + '/' + q));
});

app.get('/',function(req,res){
  res.sendFile(path.join(__dirname+'/index.html'));
});


app.listen(8080);