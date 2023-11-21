const path = require('path');
const express = require('express');
const hbs = require('hbs');

const app = express();
const port = 3083;

const public_directory = path.join(__dirname, "../public/");
const views_directory = path.join(__dirname, "../templates/views");

app.set('view engine', '.hbs');
app.set('views', views_directory);
app.use(express.static(public_directory));

app.get('/', (req, res) => {
	res.render('index');
})

app.listen(port, () => {
	console.log(`cote.nyc is up on port ${port}!`);
})
