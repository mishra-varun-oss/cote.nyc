const path = require('path');
const express = require('express');

const router = express.Router();

const authorize = require(path.join(__dirname, "../middleware/authorize.js"));

router.use(authorize.login_check);

router.get('/', (req, res) => {
	res.send(`1 Million dollars for ${req.session.username}!`);
})

module.exports = router;
