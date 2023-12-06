const slideLeft = [];
const slideRight = [];
let aspect_ratios;
let count = 1;
//get_all_slides();
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

const changeSlide = direction => {
  direction = (direction == "up" ? 'right' : 'left')
	slideLeft.forEach(function(photo){
		photo.classList.remove("outleft");	
		photo.classList.remove("outright");
	});

	slideRight.forEach(function(photo){
		photo.classList.remove("rightoutleft");
		photo.classList.remove("rightoutright");
	});

	slideLeft[count-1].classList.remove("inleft");
	slideLeft[count-1].classList.remove("inright");
	slideLeft[count-1].classList.add("out"+direction);

	slideRight[count-1].classList.remove("rightinleft");
	slideRight[count-1].classList.remove("rightinright");
	// *** Add class from sliding out photo *** //
	slideRight[count-1].classList.add("rightout"+direction);

	count = (direction == "left" ? count-1 : count+1);

	if (count > slideLeft.length) { count = 1; } // *** if reached end go to first slide *** //
	if (count < 1) { count = slideLeft.length; } // *** if reached first go to last one *** //

  let bgColor = document.querySelector('.left-slide .pic:nth-child('+(count)+')').getAttribute("data-bgcolor");
/*
  let listOfClass = document.body.classList;
  for(let i=0; i<listOfClass.length; i++)
  {
    document.body.classList.remove(listOfClass[i]);
  }
  document.body.classList.add(bgColor);
*/
	document.body.style.backgroundColor = bgColor;
	slideLeft[count-1].classList.add("in"+direction);
	slideRight[count-1].classList.add("rightin"+direction);
  
};


function get_all_slides() {
	fetch('/get/all_slides')
	.then((response) => response.json())
	.then((data) => {
		let left_div = document.querySelector("#left-slide");
		let right_div = document.querySelector("#right-slide");
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
					slideLeft.push(image_div);
					image_div.classList.add('left-side');
					image_div.addEventListener('click', () => { changeSlide('down') });
					left_div.appendChild(image_div);	
				} else if (image.side == 'right') {
					slideRight.push(image_div);
					image_div.classList.add('right-side');
					image_div.addEventListener('click', () => {  changeSlide('up') });
					right_div.appendChild(image_div);
				}
			})
		})
		aspect_ratios = calculate_aspect_ratio();
	})
}

function calculate_aspect_ratio() {
	let right_slide = document.querySelector("#right-slide");
	let img = right_slide.children[0].children[0];

	let max_width = right_slide.offsetWidth;
	let max_height = right_slide.offsetHeight;
	let img_width = img.naturalWidth;
	let img_height = img.naturalHeight;

	let result = { width: img_width, height: img_height };
	return result;
}

window.addEventListener('resize', (e) => {
	e.preventDefault();

	let right_side = document.querySelector("#right-slide");
	let left_side = document.querySelector("#left-slide");

	console.log(aspect_ratios.width, aspect_ratios.height);
})

window.onload = () => {
	get_all_slides();
}
