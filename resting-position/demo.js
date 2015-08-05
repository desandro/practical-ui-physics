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
var isDragging = false;
var dragPositionX = positionX;
var restX = positionX;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

function update() {
  applyDragForce();
  velocityX *= friction;
  positionX += velocityX;
}

function applyForce( force ) {
  velocityX += force;
}

function applyDragForce() {
  if ( !isDragging ) {
    return;
  }
  var dragVelocity = dragPositionX - positionX;
  var dragForce = dragVelocity - velocityX;
  applyForce( dragForce );
}

function render() {
  ctx.clearRect( 0, 0, canvasWidth, canvasHeight );
  // resting position
  ctx.fillStyle = 'hsla(150, 100%, 30%, 0.7)';
  circle( restX, 100, 25 );
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

// ----- mouse events ----- //

var mousedownX;
var dragStartPositionX;

document.addEventListener( 'mousedown', function( event ) {
  isDragging = true;
  mousedownX = event.pageX;
  dragStartPositionX = positionX;
  setDragPosition( event );
  window.addEventListener( 'mousemove', setDragPosition );
  window.addEventListener( 'mouseup', onMouseup );
});

function setDragPosition( event ) {
  var moveX = event.pageX - mousedownX;
  dragPositionX = dragStartPositionX + moveX;
  event.preventDefault();
}

function onMouseup() {
  isDragging = false;
  restX = positionX + velocityX * friction / ( 1 - friction  );
  window.removeEventListener( 'mousemove', setDragPosition );
  window.removeEventListener( 'mouseup', onMouseup );
}
