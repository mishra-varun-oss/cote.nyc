function get_srcset(id) {
	let widths = [350, 430, 500, 650, 800, 1100];
	let srcset_strings = [];
	widths.forEach((width) => {
		let random_number = Math.random();
		let src = `/images/${id}/${id}_${width}?refresh=${random_number} ${width}w`;
		srcset_strings.push(src);
	})
	return srcset_strings;
}

function get_sizes() {
	let widths = [350, 430, 500, 650, 800, 1100];
	let sizes = [];
	widths.forEach((width) => {
		let str = `(max-width: ${width}px) ${width - 40}px`;
		sizes.push(str);
	})
	return sizes;
}

function get_all_slides() {
	fetch('/get/all_slides')
	.then((response) => response.json())
	.then((data) => {
		let left_div = document.querySelector("#left-slide");
		let right_div = document.querySelector("#right-slide");
		console.log(data.data);
		data.data.forEach((slide) => {
			slide.images.forEach((image) => {
				let image_div = document.createElement('div');
				image_div.classList.add('pic');
				image_div.setAttribute('data-bgcolor', slide.slide_color);

				let img = document.createElement('img');
				img.setAttribute('srcset', get_srcset(image.id).join(', '));
				img.setAttribute('sizes', get_sizes().join(', '));
				image_div.appendChild(img);

				if (image.side == 'left') {
					image_div.classList.add('left-side');
					left_div.appendChild(image_div);	
				} else if (image.side == 'right') {
					image_div.classList.add('right-side');
					right_div.appendChild(image_div);
				}
			})
		})
	})
}

window.onload = () => {
	get_all_slides();
}
