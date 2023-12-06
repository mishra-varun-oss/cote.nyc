const path = require('path');
const express = require('express');
const cors = require('cors');

const router = express.Router();

const db = require(path.join(__dirname, '../tools/db_cote.js'));
const utils = require(path.join(__dirname, '../tools/panel_utils.js')); 

router.get('/all_slides', (req, res) => {
	let q = `SELECT * FROM images`;
	db.query(q, (err, results) => {
		if (err) throw err;
		utils.group_slides(results)
		.then((slides) => {
			res.send({ success: true, data: slides })
		})
	})
})

module.exports = router;
