const mysql      = require( "mysql" );
//const connection = require( "./connection.js" );
let connected = false;

const path = require( "path" );
var env       = process.env.NODE_ENV || 'development';
var connection    = require(__dirname + '/config.json')[env];

console.log( connection );

// Setting up the initial connection
let db = mysql.createConnection( {
	"host": connection.host,
	"user": connection.username,
	"port": connection.port,
	"password": connection.password,
	"database": connection.database
});

db.connect( (err) => {
	if (err) {
		console.error("Error connecting to the DB: " + err );
		return;
	}
	connected = true;
	console.log( "Connected as id " + db.threadId );
}) 

// Trap connection errors, ClearDB drop the connection after a few minutes of inactivity.
db.on( "error", function( err ) {
	console.log( "Recieved db error" , err );
	connected = false;
});

// This function checks the connection status (indicated by the connected variable) and is called before all queries to the DB
// If the db is not connected this will create a new connection before proceding.
function checkConnect() {
	if ( connected ) return;
	
	db = mysql.createConnection( {
		"host": connection.host,
		"user": connection.username,
		"port": connection.port,
		"password": connection.password,
		"database": connection.database
	});
	db.connect( (err ) => {
		if (err) {
			console.error("Error connecting to the DB: " + err );
			return;
		}
		connected = true;
		console.log( "reconnected as id " + db.threadId );
	} );

	// Refresh the handler
	db.on( "error", function( err ) {
		console.log( "Recieved db error" , err );
		connected = false;
	});
}

// Select all rows for rendering.
function selectAll() {
	return new Promise( function( resolve, reject ) {
		checkConnect();
		db.query( "SELECT * FROM burgers ORDER BY id", (err,result) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( result );
			}
		});
	});
};

// Add a new burger to the database table 
function insertOne( burger ) {
	return new Promise( function( resolve, reject ) {
		checkConnect();
		db.query( "INSERT INTO burgers ( burger_name, devoured ) values ( ?, ? )", [ burger.burger_name, burger.devoured ], (err,results) => {
			if ( err ) {
				reject( err );
			} else {
				resolve( results );
			}
		})
	})
};

// update the burger -- the only column that's updated is the devoured column
function updateOne( burger ) {
	return new Promise( function( resolve, reject ) {
		console.log( burger );
		checkConnect();
		db.query( "UPDATE burgers SET devoured = ? WHERE id = ?", [ burger.devoured, burger.id ], (err,results) => {
			if ( err ) {
				reject( err );
			} else {
				console.log( results );
				resolve( results );
			}
		})
	})
};

module.exports = {
	"selectAll": selectAll,
	"insertOne": insertOne,
	"updateOne": updateOne
}