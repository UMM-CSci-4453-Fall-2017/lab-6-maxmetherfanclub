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
		});
		connection.query('Use XaiMarsh',function(err,rows,fields){
                  if(err){
                        console.log('Error looking up databases: '+err);
                 } else {
                        console.log('Successfully using database');
                        }
                        callback();
                });

	},
//	function(callback) {
//		connection.query('Use XaiMarsh',function(err,rows,fields){
//		  if(err){
//    			console.log('Error looking up databases: '+err);
// 		 } else {
//    			console.log('Successfully using database');
//			}
//			callback();
//		});
//	},
	function(callback) {
		connection.query('SHOW TABLES',function(err,rows,fields){
			if(err){
    				console.log('Error looking up databases2 '+err);
 			 } else {
    				console.log('it actually went in here');
				 storedRows = rows;
				 console.log('it actually went past here');
				 console.log(storedRows[0].Tables_in_XaiMarsh);
				 console.log('it actually went farther');
          		}
			 callback();
		});
	},
	function(callback) {
		var pimple = 0;
		for (i = 0; i < storedRows.length; i++) {
			connection.query(str1.concat(storedRows[i].Tables_in_XaiMarsh),function(err,rows,fields) {
                		if (err) {
                       			 console.log('Error describing rows'+err);
               			 } else {
					 console.log(storedRows[pimple]);
					 console.log('......|XaiMarsh.'+storedRows[pimple].Tables_in_XaiMarsh + '>'); 
					 pimple++;
					 for (j = 0; j < rows.length; j++ ) {
                       			 	console.log(rows[j].Field + " " + rows[j].Type);
					 }
                		}

       			 });
		
		}
		 callback();
	},
	function(callback) {
		connection.end();
		callback();
	}

]);

//connection.end()
