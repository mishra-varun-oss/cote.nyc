const path = require('path');
const mysql = require('mysql');

const configs = require(path.join(__dirname, "./configs.js"));

require('dotenv').config(configs.src_path);

const connection = mysql.createConnection({
	host:process.env.MYSQL_HOSTNAME,
	user:process.env.MYSQL_COTE_USERNAME,
	password:process.env.MYSQL_COTE_PASSWORD,
	database:'cote'
});

connection.connect((err)=>{
	if (err) throw err;
	console.log('cote.nyc is connected to MySQL!');
});

module.exports = connection; 
