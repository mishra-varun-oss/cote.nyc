const add_slide_button = document.getElementById('add_slide_button');
const close_modal_button = document.getElementById('closeModalBtn');
const add_slide_modal = document.getElementById('add_slide_modal');

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
			console.log(data);
		})
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
