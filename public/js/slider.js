const sliderContainer = document.querySelector('.slider-container');
const slideRight = document.querySelectorAll('.right-slide .pic');
const slideLeft = document.querySelectorAll('.left-slide .pic');

const upButton = document.querySelector('.up-button');
const downButton = document.querySelector('.down-button');
const slidesLength = slideRight.length;
const screenSize = document.querySelector('.page-wrap');
let activeSlideIndex = 0;

var deleteLink = document.querySelectorAll('.delete');

let count 	= 1
	
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

// Auto slide start
const interval = setInterval(function() {
  changeSlide('up')
}, 10000);
// Auto slide end

document.querySelectorAll('.left-slide .pic').forEach(input => input.addEventListener('click',function(){ changeSlide('down') }));
document.querySelectorAll('.right-slide .pic').forEach(input => input.addEventListener('click',function(){ changeSlide('up') }));




