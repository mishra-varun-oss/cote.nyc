const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const db = require(path.join(__dirname, "./db_cote.js"))

module.exports.group_slides = (images) => {
	return new Promise((resolve, reject) => {
		if (images.length > 0) {
			let slides = [];
			let q = `SELECT DISTINCT slide_no, slide_color FROM images`;
			db.query(q, (err, results) => {
				if (err) {
					reject(err);
					return;
				}
				console.log(results);
				let count = 0;
				results.forEach((result) => {
					let slide_obj = {
						slide_no: result.slide_no,
						slide_color: result.slide_color,
						images: []
					}
					images.forEach((image) => {
						let image_obj = {
							id: image.image_id,
							side: image.side
						}
						if (image.slide_no == result.slide_no) {
							count++;
							slide_obj.images.push(image_obj);
						}
					})
					
					slides.push(slide_obj);
					if (count == images.length) {
						resolve(slides);
					}
				})
			})
		} else {
			reject("Length must be greater than 0");
		}
	})
}

module.exports.generate_string = (length) => {
	let result = '';
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
}

module.exports.new_slide_no = () => {
	return new Promise((resolve, reject) => {
		let q = `SELECT * FROM images`;
		let result;

		db.query(q, (err, results) => {
			if (err) {
				reject(err);
				return;
			}

			if (results.length > 0) {
				let q = `SELECT MAX(slide_no) AS max FROM images`;
				db.query(q, (err, max_result) => {
					if (err) {
						reject(err);
						return;
					}

					if (results.length % 2 === 0) {
						result = max_result[0].max + 1;
						resolve(result);
					} else {
						result = max_result[0].max;
						resolve(result);
					}
				});
			} else {
				result = 1;
				resolve(result);
			}
		});
	});
}

module.exports.resize_image = (image_path, image_id) => {
	return new Promise((resolve, reject) => {
		let widths = [350, 430, 500, 650, 800, 1100];
		let count = 0;
		widths.forEach((width) => {
			sharp(image_path)
			.resize(width, width)
			.jpeg({ quality: 90 })
			.toBuffer()
			.then((output_buffer) => {
				let resized_image_path = path.join(__dirname, `../../public/images/${image_id}/${image_id}_${width}`);
				fs.writeFileSync(resized_image_path, output_buffer);
				count++;
				if (count == widths.length) {
					resolve('Done!');
				}
			})
		})
	})
}

module.exports.clear_directory = (output_directory) => {
	return new Promise ((resolve, reject) => {
		fs.readdir(output_directory, (err, files) => {
			if (err) {
				reject(err);
				return;
			} 

			let count = 0;
			files.forEach((file) => {
				const file_path = path.join(output_directory, file);
				fs.unlink(file_path, (err) => {
					if (err) {
						reject(err);
						return;
					} 
					
					count++;
					if (count == files.length) {
						resolve('Done!');
					}
				})
			})
		})
	})
}

module.exports.allow_origin = (req, res, next) => {
	console.log('setting headers...');
	res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8888');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
	res.setHeader('Access-Control-Allow-Credentials', true);
	next();
}
