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
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT, text TEXT, user_id TEXT,'
        + 'REMINDER_TYPE TEXT)';
    const favorites = 'CREATE TABLE IF NOT EXISTS favorites ('
        + 'address TEXT , fullName TEXT , user_id TEXT, PRIMARY KEY (address, user_id))';

    sendQuery(notifications)
    sendQuery(reminders)
    sendQuery(favorites)
}

function sendQueryWithArgs(sql, args, callback) {	
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
        callback(toReturn) 
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
    })

    return toReturn;
}

exports.initilize = getInstance

var addFavorite = function(userId, emailAddress, firstName, lastName, callback) {
    const sql = 'insert into favorites values($1, $2, $3)'
    return sendQueryWithArgs(sql, [emailAddress, firstName + ' ' + lastName, userId], callback);
}

exports.addFavorite = addFavorite

var getFavorites = function(userId, callback) {
    const sql = 'select * from favorites where user_id = $1'
    return sendQueryWithArgs(sql, [userId], callback);
}

exports.getFavorites = getFavorites

var deleteFavorite = function(userId, id, callback) {
    const sql = 'delete from favorites where address = $1 and user_id = $1'
    return sendQueryWithArgs(sql, [id, userId], callback)
}

exports.deleteFavorite = deleteFavorite

var addReminder = function(userId, text, callback) {
    const sql = 'insert into reminders values(NULL, $1, $2, $3)'
    return sendQueryWithArgs(sql, [text, userId, ''],callback)
}

exports.addReminder = addReminder

var getReminders = function(userId, callback) {
    const sql = 'select * from reminders where user_id = $1'
    return sendQueryWithArgs(sql, [userId], callback)
}

exports.getReminders = getReminders

var deleteReminder = function(userId, text, callback) {
    const sql = 'delete from reminders where id in (select id from reminders where $1 like text and user_id = $2 limit 1)'
    return sendQueryWithArgs(sql, [text, userId], callback)
}

exports.deleteReminder = deleteReminder







