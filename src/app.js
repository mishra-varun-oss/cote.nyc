const path = require('path');
const express = require('express');
const hbs = require('hbs');
const body_parser = require('body-parser');
const session = require('express-session');

const app = express();

const public_directory = path.join(__dirname, "../public/");
const views_directory = path.join(__dirname, "../templates/views");

const panel = require(path.join(__dirname, "./routes/panel.js"));
const login = require(path.join(__dirname, "./routes/login.js"));
const get_data = require(path.join(__dirname, "./routes/get_data.js"));
const configs = require(path.join(__dirname, "./tools/configs.js"));

require('dotenv').config(configs.src_path);

app.set('view engine', '.hbs');
app.set('views', views_directory);
app.use(express.static(public_directory));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(session({ 
	secret: process.env.SESSION_SECRET,
	resave: false,
	saveUninitialized: true
}))

app.use('/login', login);
app.use('/panel', panel);
app.use('/get', get_data);
app.get('/', (req, res) => {
/*
	let front_end = path.join(views_directory, 'front_end.html');
	res.sendFile(front_end);
*/
	res.render('index');
})
app.get('/logout', (req, res) => {
	req.session.destroy();
	res.redirect('/login?logout=true');
})


const port = process.env.PORT;
app.listen(port, () => {
	console.log(`cote.nyc is up on port ${port}!`);
})
