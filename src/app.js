const path = require('path');
const express = require('express');
const hbs = require('hbs');
const body_parser = require('body-parser');
const session = require('express-session');

const app = express();
const port = 3083;

const public_directory = path.join(__dirname, "../public/");
const views_directory = path.join(__dirname, "../templates/views");

const panel = require(path.join(__dirname, "./routes/panel.js"));
const login = require(path.join(__dirname, "./routes/login.js"));

app.set('view engine', '.hbs');
app.set('views', views_directory);
app.use(express.static(public_directory));
app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: true }));
app.use(session({ 
	secret: 'doicnsduozh)#*HDOUN39103ass;l;',
	resave: false,
	saveUninitialized: true
}))

app.use('/login', login);
app.use('/panel', panel);
app.get('/', (req, res) => {
	res.render('index');
})

app.listen(port, () => {
	console.log(`cote.nyc is up on port ${port}!`);
})
