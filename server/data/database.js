var conn = anyDB.createPool('sqlite3://gmail.db', {min: 0, max: 20});

/**
 * SQL Database functions.
 **/

function createTables() {

}


function sendQueryWithArgs(sql, args) {	
	var toReturn = {}
    conn.query(sql, args, function(err, res) {
        if (err) {
        	console.log('an error was found');
        }

        const rows = res.rows
        if (rows.length == 0) {
            console.log("no rows were found for query");
        } else {
        	toReturn = rows;
        }    
    });
}

function sendQuery(sql) {
	var toReturn = {}
    conn.query(sql, function(err, rows) {
        if (err) console.log('an error was found');
    });

    return toReturn
}