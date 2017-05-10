var express = require("express");
var bodyParser = require("body-parser");
var sqlite = require("sqlite3").verbose();
var path = require("path");
var app = express();
var db = new sqlite.Database("example");

db.serialize(function(){
	db.run("CREATE TABLE lorem (name STRING, age  INTEGER)")
})
app.use(bodyParser.urlencoded({
	extended: true
	}));
app.use(bodyParser.json());

app.get("/", function(require, res){
	res.sendFile(path.join(__dirname, "index.html"));
})

app.post("/", function(require, res){
var data = {
	name: require.body.name,
	age: require.body.age
};
	db.serialize(function(){
		db.run("INSERT INTO lorem VALUES($name, $age)",{
			$name: data.name,
			$age: data.age

		}, function(){
			res.redirect("/data");
		});
	});	
})

app.get("/data", function(require, res){
	db.serialize(function(){
		db.get("SELECT * FROM lorem", function(err, rows){
			if(err){
				console.log(err);
			} else{
				res.json(rows);
			}
		});
	});

})

app.listen(8080);

console.log("server is running");