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
var bigpimple = 0;

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
		z = 0;
		var k = 0;
		var DBEIndex = 0;
		var counter = 0;
		console.log("storedDB.length value is " + storedDB.length);
		console.log("storedDB at 2 is " + storedDB[2]);
		//show tables in (database name)
		for (k = 0; k < storedDB.length; k++) {
			connection.query(str2.concat(storedDB[k]),function(err,rows,fields){
				if(err){
    					console.log('Error looking up databases2 '+err);
 				 } else {
					 //code for debugging
					// console.log(fields);
					 console.log("k inside the query " + k);
					 console.log("Please be correct: " + rows.length);
					 for(i = 0; i < rows.length; i++){	
						 storedRows[z] = rows[i][fields[0].name];	
					//	 console.log(storedRows.length);
						 z++;
					 }
					 //code for debugging
					 // console.log(storedRows.length);
					 databaseEIndex[DBEIndex] = z;
					 DBEIndex++;
					 //used for debugging
					 //console.log('it actually went past here');
					 //console.log(storedRows[0].Tables_in_XaiMarsh);
					 //console.log('it actually went farther');
          			}
			console.log(storedRows.length);
			counter++;

				if (counter == storedDB.length){
				console.log("baylieve that this is right " + storedRows.length);
				databaseEIndex[DBEIndex - 1] = databaseEIndex[DBEIndex - 1] + 1;
				callback();
			}
			});
			console.log("k outside the query " + k);
			console.log("i eat fish" + databaseEIndex[0]);
			console.log("fish eat i" + databaseEIndex[2]);
		}
		//callback();
	},
	function(callback) {
		var rowIndex = 0;
		var outerDBIndex = 0;
		var innerDBIndex = 0;
		var i = 0;
		var counter = 0;
		console.log("yolo");
		console.log("legends never die" + storedRows.length);
		for (i = 0; i < storedRows.length; i++) {
			//"describe (database_name).(table_name)
			connection.query(str1.concat(storedDB[outerDBIndex], ".", storedRows[i]),function(err,rows,fields) {
                		if (err) {
                       			 console.log('Error describing rows'+err);
               			 } else {
					 //used for debugging
					 //console.log(storedRows[pimple]);
					 console.log('......|'+storedDB[innerDBIndex]+'.'+storedRows[rowIndex] + '>'); 
					 for (j = 0; j < rows.length; j++ ) {
                       			 	console.log(rows[j].Field + " " + rows[j].Type);
					 }
					 rowIndex++;
					 console.log("rowIndex " + rowIndex);
					 if(rowIndex == databaseEIndex[innerDBIndex]-1){
						 innerDBIndex++;
					 }
					 console.log(innerDBIndex);
                		}
				counter++;
				if(counter == storedRows.length -1){
					callback();
				}
       			 });
			console.log("Monica is here");
			console.log("Monica says that outerDBIndex is " + outerDBIndex + "And its value is "+databaseEIndex[outerDBIndex] );
			if(i == (databaseEIndex[outerDBIndex] - 1)){
				console.log("Where you at monica" + outerDBIndex);
				console.log(outerDBIndex);
				outerDBIndex++;
			}
		}
		// callback();
	},
	function(callback) {
		connection.end();
		callback();
	}

]);

//connection.end()
