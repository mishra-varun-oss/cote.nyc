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

function update_color(slide_no, element) {
	post('/panel/update_color', { slide_no: slide_no, value: element.value })
	.then((data) => {
		if (data.success) {
			element.style.backgroundColor = data.color;
		}	
	})
}

function replace_img(id) {
	let file_input = document.querySelector(`#id_${id}`);
	let form_data = new FormData();
	form_data.append('file', file_input.files[0]);
	form_data.append('id', id);
	fetch('/panel/replace_image', {
		method: 'POST',
		body: form_data
	})
	.then((response) => response.json())
	.then((data) => {
		get_slide_data();
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
				let indiv_img_div = document.createElement('div');
				let img = document.createElement('img');
				let replace_img_div = document.createElement('div');

				let file_input = document.createElement('input');
				let replace_btn = document.createElement('button');
				file_input.type = 'file';
				file_input.id = `id_${image.id}`;
				replace_btn.textContent = 'Upload';
				replace_btn.addEventListener('click', (e) => { replace_img(image.id) });
				replace_img_div.appendChild(file_input);
				replace_img_div.appendChild(replace_btn);

				img.setAttribute('srcset', get_srcset(image.id).join(', '));
				img.setAttribute('sizes', get_sizes().join(', '));
				img.id = `img_${image.id}`;

				indiv_img_div.classList.add(`image-${image.side}`);
				indiv_img_div.appendChild(img);
				indiv_img_div.appendChild(replace_img_div);
				slide_images.appendChild(indiv_img_div);
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
