const mysql = require('mysql');

const connection = mysql.createConnection({
	host:'127.0.0.1',
	user:'landing_page',
	password:'adonsinEOIN12#9)',
	database:'cote'
});

connection.connect((err)=>{
	if (err) throw err;
	console.log('cote.nyc is connected to MySQL!');
});

module.exports = connection; 
