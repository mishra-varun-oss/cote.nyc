const add_slide_button = document.getElementById('add_slide_button');
const close_modal_button = document.getElementById('closeModalBtn');
const add_slide_modal = document.getElementById('add_slide_modal');

async function post(url = '', data = {}) {
	const response = await fetch(url, {
		method: 'POST', 
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify(data)
	})
	return response.json();
}

function add_slide() {
	let file_inputs = document.querySelectorAll('input[type="file"]');
	file_inputs.forEach((file_input) => {
		const form_data = new FormData();
		form_data.append('file', file_input.files[0]);
		form_data.append('side', file_input.name);
		form_data.append('slide_color', document.querySelector("#add_slide_color").value);
		
		fetch('/panel/create_slide', { 
			method: 'POST',
			body: form_data
		})
		.then((response) => response.json())
		.then((data) => {
			get_slide_data();
		})
	})
}

function get_srcset(id) {
	let widths = [350, 430, 500, 650, 800, 1100];
	let srcset_strings = [];
	widths.forEach((width) => {
		let src = `/images/${id}/${id}_${width} ${width}w`;
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

function update_color(slide_no, element) {
	post('/panel/update_color', { slide_no: slide_no, value: element.value })
	.then((data) => {
		if (data.success) {
			element.style.backgroundColor = data.color;
		}	
	})
}

function get_slide_data() {
	let slide_container = document.querySelector("#slide_container");
	fetch('/panel/get_slide_data')
	.then((response) => response.json())
	.then((data) => {
		slide_container.innerHTML = '';
		let slide_div = document.createElement('div');
		slide_div.classList.add('slide-div');
		data.data.forEach((slide) => {
			let p = document.createElement('p');
			p.textContent = `Slide ${slide.slide_no}`;

			let slide_images = document.createElement('div');
			slide_images.classList.add('image-div');

			slide.images.forEach((image) => {
				let img = document.createElement('img');
				img.setAttribute('srcset', get_srcset(image.id).join(', '));
				img.setAttribute('sizes', get_sizes().join(', '));
				img.classList.add(`image-${image.side}`);
				slide_images.appendChild(img);
			})

			let slide_color_input = document.createElement('input');
			slide_color_input.type = 'text';
			slide_color_input.value = slide.slide_color;
			slide_color_input.style.backgroundColor = slide.slide_color;
			slide_color_input.addEventListener('change', (e) => { update_color(slide.slide_no, slide_color_input) });

			slide_div.appendChild(p);
			slide_div.appendChild(slide_images);
			slide_div.appendChild(slide_color_input);
		})
		slide_container.appendChild(slide_div);
	})
}

function get_data() {
	fetch('/panel/get_slide_data')
	.then((response) => response.json())
	.then((data) => {
		console.log(data);
	})
}

add_slide_button.addEventListener('click', function () {
	add_slide_modal.style.display = 'block';
});

close_modal_button.addEventListener('click', function () {
	add_slide_modal.style.display = 'none';
});

window.onload = () => {
	get_slide_data();
}
