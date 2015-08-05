// canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// get/set canvas size
var canvasWidth = canvas.width = window.innerWidth - 20;
var canvasHeight = canvas.height;

// particle properties
var positionX = 100;
var velocityX = 0;
var friction = 0.95;

function update() {
  // integrate physics
  // velocityX *= friction;
  // positionX += velocityX;
}

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  // render particle
  ctx.fillStyle = 'red';
  circle( positionX, 100, 25 );
}

function circle( x, y, radius ) {
  ctx.beginPath();
  ctx.arc( positionX, 100, radius, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}
