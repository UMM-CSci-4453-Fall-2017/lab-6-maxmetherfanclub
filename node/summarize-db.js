async = require("async");

var credentials = require('./credentials.json');

var mysql=require("mysql");

credentials.host="ids";
var connection = mysql.createConnection(credentials);

var storedRows = null;
var str1 = "describe ";

async.series([
	function(callback) {
		connection.connect(function(err){

  		if(err){
    			console.log("Problems with MySQL: "+err);
  		} else {
   			 console.log("Connected to Database.");
  		}
			callback();
		});
	},
	function(callback) {
		connection.query('Use XaiMarsh',function(err,rows,fields){
		  if(err){
    			console.log('Error looking up databases');
 		 } else {
    			console.log('Successfully using database');
			}
			callback();
		});
	},
	function(callback) {
		connection.query('SHOW Tables',function(err,rows,fields){
			if(err){
    				console.log('Error looking up databases2');
 			 } else {
    				storedRows = rows;
          		}
			callback();
		});
	},
	function(callback) {
		for (i = 0; i < storedRows.length; i++) {
       			 connection.query(str1.concat(storedRows[i]),function(err,rows,fields) {
                		if (err) {
                       			 console.log('Error describing rows'+err);
               			 } else {
                       			 console.log(rows);
                		}

       			 });
			callback();
		}
	}

]);

connection.end()
