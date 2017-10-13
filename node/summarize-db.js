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
		connection.query('SHOW DATABASES', function(err, rows, fields){
			if(err){
				console.log('SHOW DATABASES error '+err);
			} else {
				//Populates an array holding all the databases we have access to
				storedDB = rows;	
				for(i = 0; i < rows.length; i++){	
					storedDB[i] = storedDB[i].Database;
					databaseEIndex[i] = 0;
				}
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
		//show tables in (database name)
		for (k = 0; k < storedDB.length; k++) {
			connection.query(str2.concat(storedDB[k]),function(err,rows,fields){
				if(err){
    					console.log('Error looking up databases2 '+err);
 				 } else {
					 //Populates an array that holds all table names we have access to
					 for(i = 0; i < rows.length; i++){	
						 storedRows[z] = rows[i][fields[0].name];	
						 z++;
					 }
					 databaseEIndex[DBEIndex] = z;
					 DBEIndex++;
          			}
			counter++;
				if (counter == storedDB.length){
				databaseEIndex[DBEIndex - 1] = databaseEIndex[DBEIndex - 1] + 1;
				callback();
			}
			});
		}
	},
	function(callback) {
		var rowIndex = 0;
		var outerDBIndex = 0;
		var innerDBIndex = 0;
		var i = 0;
		var counter = 0;	
		var DBcounter = 1;
		for (i = 0; i < storedRows.length; i++) {
			//"describe (database_name).(table_name)
			connection.query(str1.concat(storedDB[outerDBIndex], ".", storedRows[i]),function(err,rows,fields) {
                		if (err) {
                       			 console.log('Error describing rows'+err);
               			 } else {
					 //If this is a new database print the database it has switched to
					 if (rowIndex == DBcounter - 1) {
						 DBcounter = databaseEIndex[innerDBIndex];
						 console.log('---|'+storedDB[innerDBIndex]+'>');
					 }

					 //Prints the database name, and table
					 console.log('......|'+storedDB[innerDBIndex]+'.'+storedRows[rowIndex] + '>');
					 //Prints the table columns and their field type
					 for (j = 0; j < rows.length; j++ ) {
                       			 	console.log("\tFieldName: `" + rows[j].Field + "`\t\t (" + rows[j].Type + ")");
					 }
					 rowIndex++;

					 //Increments displayed database name 
					 if(rowIndex == databaseEIndex[innerDBIndex]-1){
						 innerDBIndex++;
					 }
                		}
				counter++;

				//Ends function when we have gone through all the rows in all the databses
				if(counter == storedRows.length -1){
					callback();
				}
       			 });

			//Change databases when we have traversed through all the previous database rows
			if(i == (databaseEIndex[outerDBIndex] - 1)){
				outerDBIndex++;
			}
		}
		//Formating prints
		console.log('\tAcquiring Data.	This may take a bit...');	
	},
	function(callback) {
		connection.end();
		callback();
	}
]);
