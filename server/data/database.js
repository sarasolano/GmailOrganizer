const anyDB = require('any-db');

var conn;

var getInstance = function() {
    if (!conn) {
        let url = 'sqlite3://gorganizer.db';
        conn = anyDB.createPool(url, {min: 0, max: 20});
        createTables()
    }
}

/**
 * SQL Database functions.
 **/

function createTables() {
    const notifications = 'CREATE TABLE IF NOT EXISTS notifications ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'NOTIFICATION_TYPE TEXT,'
        + 'notification TEXT, keywords TEXT)';
    const reminders = 'CREATE TABLE IF NOT EXISTS reminders ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT,'
        + 'REMINDER_TYPE TEXT)';
    const favorites = 'CREATE TABLE IF NOT EXISTS favorites ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'address TEXT , fullName TEXT , user_id TEXT)';

    sendQuery(notifications)
    sendQuery(reminders)
    sendQuery(favorites)
}

function sendQueryWithArgs(sql, args) {	
    if (!conn) {
        return {'ok' : false};;
    }
	var toReturn = {'ok' : true, 'data' : []}
    conn.query(sql, args, function(err, res) {
        if (err) {
        	console.log('an error was found', err);
            toReturn.ok = false;
        }

        if (res) {
            const rows = res.rows
            if (rows.length == 0) {
                console.log("no rows were found for query");
            } else {
            	toReturn.data = rows;
            }    
        }
    });

    return toReturn
}

function sendQuery(sql) {
    if (!conn) {
        return {'ok' : false};
    }
	var toReturn = {'ok' : true, 'data' : []}
    conn.query(sql, function(err, res) {
        if (err) {
            console.log('an error was found ', err);
            toReturn.ok = false;
        }

        if (res) {
            const rows = res.rows
            if (rows.length == 0) {
                console.log("no rows were found for query");
            } else {
                toReturn.data = rows;
            }    
        }
    });

    return toReturn;
}

exports.initilize = getInstance

var addFavorite = function(userId, emailAddress, firstName, lastName) {
    const sql = 'insert into favorites values(NULL, $2, $3, $4)'
    return sendQueryWithArgs(sql, [emailAddress, firstName + ' ' + lastName, userId]);
}

exports.addFavorite = addFavorite

var getFavorites = function(userId) {
    const sql = 'select * from favorites where user_Id = $1'
    return sendQueryWithArgs(sql, [userId]);
}

var addReminder = function(userId, text) {
    const sql = 'insert into reminders values(NULL, $2, $3, $4)'
    return sendQueryWithArgs(sql, [userId, text, ''])
}

exports.addReminder = addReminder

var deleteFavorite = function(userId, id) {
    
}

var getUser = function(userId) {
    const sql = 'select * from user when id = $1'
    return sendQueryWithArgs(sql, [userId])
}







