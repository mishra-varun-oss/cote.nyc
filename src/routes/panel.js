const fs = require('fs');
const path = require('path');
const express = require('express');
const multer = require('multer');
const sharp = require('sharp');

const router = express.Router();

const authorize = require(path.join(__dirname, "../middleware/authorize.js"));
const db = require(path.join(__dirname, "../tools/db_cote.js"));
const utils = require(path.join(__dirname, "../tools/panel_utils.js"));
const multer_config = require(path.join(__dirname, "../tools/multer_config.js"));

const storage = multer.diskStorage(multer_config);
const upload = multer({ storage: storage });

router.use(authorize.login_check);

router.get('/', (req, res) => {
	res.render('panel', { username: req.session.username });
})

router.post('/create_slide', upload.single('file'), (req, res) => {
	let image_path = path.join(__dirname, `../../public/images/${req.file.originalname}`);
	let image_id = utils.generate_string(7);
	let output_directory = path.join(__dirname, `../../public/images/${image_id}`);
	fs.mkdir(output_directory, (err) => {
		if (err) throw err;
		utils.new_slide_no()
		.then(result => { 
			let output_image_path = path.join(__dirname, `../../public/images/${image_id}/${image_id}_original`);
			fs.rename(image_path, output_image_path, (err) => {
				if (err) throw err;
				let q = `INSERT INTO images VALUES (default, ${result}, '${image_id}', '${req.body.side}', '${req.body.slide_color}', 'MPENGS')`;
				db.query(q, (err, results) => {
					if (err) throw err;
					
					utils.resize_image(output_image_path, image_id)
					.then((result) => {
						res.send({ success: true })
					})
				})
			})
		})
	})
})

router.post('/replace_image', upload.single('file'), (req, res) => {
	let image_path = path.join(__dirname, `../../public/images/${req.file.originalname}`);
	let image_id = req.body.id;
	let output_directory = path.join(__dirname, `../../public/images/${image_id}`);
	let output_image_path = path.join(__dirname, `../../public/images/${image_id}/${image_id}_original`);
	
	utils.clear_directory(output_directory)
	.then((result) => {
		fs.rename(image_path, output_image_path, (err) => {
			if (err) throw err;
			utils.resize_image(output_image_path, image_id)
			.then((result) => {
				res.send({ success: true, id: image_id })
			})
		})
	})
})

router.get('/get_slide_data', (req, res) => {
	//filter by organization 
	let q = `SELECT * FROM images`;
	db.query(q, (err, results) => {
		if (err) throw err;
		utils.group_slides(results)
		.then((slides) => {
			console.log(slides);
			res.send({ success: true, data: slides });
		})
		.catch((error) => {
			console.error(error)
		})
	})
})

module.exports = router;
