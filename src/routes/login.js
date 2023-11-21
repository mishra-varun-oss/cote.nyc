const express = require('express');

const router = express.Router();

router.get('/', (req, res) => {
	res.render('login');
})

router.post('/', (req, res) => {
	let u = req.body.username;
	let p = req.body.permission;
	
	req.session.username = u;
	req.session.permission = p;
	req.session.loggedin = true;

	res.send({ url: `https://cote.nyc/panel` })
})

module.exports = router;
