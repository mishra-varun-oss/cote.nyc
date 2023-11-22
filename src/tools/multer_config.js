const path = require('path');

const images_path = path.join(__dirname, "../../public/images");

let config = {
	destination: (req, file, cb) => {
		cb(null, images_path);
	}, 
	filename: (req, file, cb) => {
		cb(null, file.originalname);
	}
}

module.exports = config;
