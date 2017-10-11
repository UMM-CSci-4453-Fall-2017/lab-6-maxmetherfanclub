async = require("async");

var credentials = require('./credentials.json');

var mysql=require("mysql");

credentials.host="ids";
var connection = mysql.createConnection(credentials);

var storedDB = [];
var storedRows = [];
var str1 = "describe ";
var str2 = "show tables in ";
var databaseEIndex = [];

var z = 0;

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
					databaseEIndex[i] = 0;
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

	//show tables in (database_name)
	function(callback) {
		console.log(storedDB.length);
		z = 0;
		var k = 0;
		for (k = 0; k < storedDB.length; k++) {
			connection.query(str2.concat(storedDB[k]),function(err,rows,fields){
				if(err){
    					console.log('Error looking up databases2 '+err);
 				 } else {
					 //code for debugging
					// console.log(fields);
					// console.log(rows[0][fields[0].name]);
					 for(i = 0; i < rows.length; i++){	
						 storedRows[z] = rows[i][fields[0].name];	
						z++;
					 }
					 //code for debugging
					// console.log(storedRows.length);
					 databaseEIndex[k] = z;
					 //used for debugging
					 //console.log('it actually went past here');
					 //console.log(storedRows[0].Tables_in_XaiMarsh);
					 //console.log('it actually went farther');
          			}
			
			});
		}
		callback();
	},
	function(callback) {
		var pimple = 0;
		var pimple2 = 0;
		var i = 0;
		for (i = 0; i < storedRows.length; i++) {
			//"describe (database_name).(table_name)
			connection.query(str1.concat(storedDB[pimple2], ".", storedRows[i]),function(err,rows,fields) {
                		if (err) {
                       			 console.log('Error describing rows'+err);
               			 } else {
					 //used for debugging
					 //console.log(storedRows[pimple]);
					 console.log('......|'+storedDB[pimple2]+'.'+storedRows[pimple] + '>'); 
					 for (j = 0; j < rows.length; j++ ) {
                       			 	console.log(rows[j].Field + " " + rows[j].Type);
					 }
					 pimple++;
					 if(pimple == databaseEIndex[pimple2] && pimple2 < databaseEIndex.length){
						 pimple2++;
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
