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
var isDragging = false;
var dragPositionX = positionX;
var target = 400;
var targetBound = 200;
var gravityStrength = 3;

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}

animate();

function update() {
  applyGravity();
  applyDragForce();
  // integrate physics
  velocityX *= friction;
  positionX += velocityX;
}

function applyForce( force ) {
  velocityX += force;
}

function applyGravity() {
  var distance = target - positionX;
  // stop if in center of well
  // if ( Math.abs( distance )  < 5 ) {
  //   applyForce( -velocityX );
  //   return;
  // }
  var gravity =  ( 1 - Math.abs( distance / targetBound ) ) * Math.sign( distance);
  // limit at target
  gravity = Math.abs( distance ) > targetBound ? 0 : gravity;
  gravity *= gravityStrength;
  applyForce( gravity );
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
  circle( target, 200, targetBound, 'fill' );
  ctx.fillStyle = 'black';
  circle( target, 200, 10, 'fill' );
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
