async = require("async");

var credentials = require('./credentials.json');

var mysql=require("mysql");

credentials.host="ids";
var connection = mysql.createConnection(credentials);

var storedDB = null;
var storedRows = null;
var str1 = "describe ";
var str2 = "show tables in ";

var z = 1;

async.series([
	function(callback) {
		connection.connect(function(err){

  		if(err){
    			console.log("Problems with MySQL: "+err);
  		} else {
   			 console.log("Connected to Database.");
  		}
		});
//		connection.query('Use XaiMarsh',function(err,rows,fields){
//                  if(err){
//                        console.log('Error looking up databases: '+err);
//                 } else {
//                        console.log('Successfully using database');
//                        }
//                        callback();
//                });

		connection.query('SHOW DATABASES', function(err, rows, fields){
			if(err){
				console.log('SHOW DATABASES error '+err);
			} else {
				storedDB = rows;
				for(i = 0; i < rows.length; i++){
					storedDB[i] = storedDB[i].Database;
				}
				console.log(storedDB[1]);
				//used for debugging
				//console.log('it saved databases');
				//console.log(storedDB[1]);
				//console.log(storedDB[1].Database);
			}
			callback();
		});
	},
	function(callback) {
		connection.query(str2.concat(storedDB[z]),function(err,rows,fields){
			if(err){
    				console.log('Error looking up databases2 '+err);
 			 } else {
				 storedRows = rows;
				 for(i = 0; i < rows.length; i++){
					 console.log(fields[0].name);
					 console.log(rows[i].fields[0].name);
					 console.log(rows[i]);
					storedRows[i] = rows[i].fields[0].name;
					 console.log(storedRows[i]);
				 }
				 //used for debugging
				 //console.log('it actually went past here');
				 //console.log(storedRows[0].Tables_in_XaiMarsh);
				 //console.log('it actually went farther');
          		}
			 callback();
		});
	},
	function(callback) {
		var pimple = 0;
		for (i = 0; i < storedRows.length; i++) {
			connection.query(str1.concat(storedDB[z], ".", storedRows[i]),function(err,rows,fields) {
                		if (err) {
                       			 console.log('Error describing rows'+err);
               			 } else {
					 //used for debugging
					 //console.log(storedRows[pimple]);
					 console.log('......|XaiMarsh.'+storedRows[pimple] + '>'); 
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
