// canvas
var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

// get/set canvas size
var canvasWidth = canvas.width = window.innerWidth - 20;
var canvasHeight = canvas.height;

// particle properties
var positionX = 200;
var velocityX = 0;
var friction = 0.9;
var isDragging = false;
var dragPositionX = positionX;
var targetA = positionX;
var targetB = 700;
var targetBound = 150;
var attractionStrength = 0.01;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

function update() {
  attract( targetA );
  attract( targetB );
  // drag
  applyDragForce();
  // integrate physics
  velocityX *= friction;
  positionX += velocityX;
}

function attract( target ) {
  // attraction
  var distance = target - positionX;
  // attract if within bounds
  var attraction = Math.abs( distance ) <= targetBound ?
    distance * attractionStrength : 0;
  applyForce( attraction );
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
  // render target
  ctx.fillStyle = 'hsla(210, 100%, 50%, 0.5)';
  circle( targetA, 200, targetBound, 'fill' );
  circle( targetB, 200, targetBound, 'fill' );
  // render particle
  ctx.fillStyle = 'hsla(0, 100%, 50%, 0.7)';
  circle( positionX, 200, 25, 'fill' );
}

function circle( x, y, radius, render ) {
  ctx.beginPath();
  ctx.arc( x, y, radius, 0, Math.PI * 2 );
  ctx[ render ]();
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
  window.removeEventListener( 'mousemove', setDragPosition );
  window.removeEventListener( 'mouseup', onMouseup );
}
