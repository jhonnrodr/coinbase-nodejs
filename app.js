var express = require('express');
var coinbase = require("lib/coinbase");
 
var app = express();
app.use(express.bodyParser());
app.set('view engine', 'ejs');

coinbase.connection("APIkey", "APIsecret");
 
 
	app.get("/", function(req, res){
		res.send("Hey");
	});
 
 
 
app.listen(5000, function(){
    console.log("Listen in Localhost:5000");
});