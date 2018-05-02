var conn = anyDB.createPool('sqlite3://gmail.db', {min: 0, max: 20});

/**
 * SQL Database functions.
 **/

function createTables() {
    const user = 'CREATE TABLE user (' 
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,' 
        + 'address TEXT , message_count INTEGER ,'  
        + 'notification_count INTEGER , reminder _count INTEGER)';
    const notifications = 'CREATE TABLE notifications ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'NOTIFICATION_TYPE ENUM ("UNREAD_EMAIL", "RECIEVED_MESSAGE"),'
        + 'notification TEXT, keywords TEXT ,'
        + 'FOREIGN KEY (user_id) REFERENCES users(id))';
    const reminders = 'CREATE TABLE reminders ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'REMINDER_TYPE ENUM ("SEND_DRAFT", "SEND_REPLY", "EMAIL_DURATION"),'
        + 'FOREIGN KEY (user_id) REFERENCES users(id))';
    const favorites = 'CREATE TABLE favorites ('
        + 'id INTEGER PRIMARY KEY AUTOINCREMENT,'
        + 'address TEXT , priority INTEGER ,'
        + 'FOREIGN KEY (user_id) REFERENCES users(id))';

    sendQuery(user)
    sendQuery(notifications)
    sendQuery(reminders)
    sendQuery(favorites)
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