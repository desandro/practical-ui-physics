// canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// get/set canvas size
var canvasWidth = canvas.width = window.innerWidth - 20;
var canvasHeight = canvas.height;

// particle properties
var positionX = 100;
var velocityX = 0;
var friction = 0.9;
var target = 100;
var attractionStrength = 0.01;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

function update() {
  // attract particle to target
  var distance = target - positionX;
  var attraction = distance * attractionStrength;
  applyForce( attraction );
  // integrate physics variables
  velocityX *= friction;
  positionX += velocityX;
}

function applyForce( force ) {
  velocityX += force;
}

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  // render target
  ctx.fillStyle = 'hsla(210, 100%, 50%, 0.7)';
  circle( target, 100, 15 );
  // render particle
  ctx.fillStyle = 'hsla(0, 100%, 50%, 0.7)';
  circle( positionX, 100, 25 );
}

function circle( x, y, radius ) {
  ctx.beginPath();
  ctx.arc( x, y, radius, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}

document.addEventListener( 'click', function( event) {
  target = event.pageX;
});
