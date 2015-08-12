// ----- Particle ----- //

var photoElem;
var positionX = 0;
var dragPositionX = 0;
var velocityX = 0;
var friction = 0.95;
var isDragging = false;

var rightBound, leftBound;

function update() {
  applyDragForce();
  applyBoundForce( rightBound, true );
  applyBoundForce( leftBound, false );
  integrate();
}

function integrate() {
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
  // change the position to drag position by applying force to velocity
  var dragVelocity = dragPositionX - positionX;
  var dragForce = dragVelocity - velocityX;
  applyForce( dragForce );
}

function applyBoundForce( bound, isForward ) {
  var isInside = isForward ? positionX < bound : positionX > bound;
  if ( isDragging || isInside ) {
    return;
  }
  // bouncing past bound
  var distance = bound - positionX;
  var force = distance * 0.1;
  var restX = positionX + ( velocityX + force ) * friction / ( 1 - friction );
  var isRestOutside = isForward ? restX > bound : restX < bound;
  if ( isRestOutside ) {
    applyForce( force );
    return;
  }
  // bounce back
  force = distance * 0.1 - this.velocityX;
  applyForce( force );
}

function render() {
  photoElem.style.transform = 'translateX(' + (this.positionX ) + 'px)';
}

// ----- init ----- //

// create particle
photoElem = document.querySelector('img');
// set bounds
rightBound = 0;
leftBound = window.innerWidth - 2000; // 2000 = img width

document.body.addEventListener( 'mousedown', onMousedown, false );

function animate() {
  update();
  render();
  requestAnimationFrame( animate );
}
// start animation
animate();

// ----- mouse events ----- //

var dragStartX;
var particleDragStartX;

function onMousedown( event ) {
  event.preventDefault();
  // get drag start positions
  dragStartX = event.pageX;
  particleDragStartX = positionX;
  isDragging = true;
  setDragPositionX( event );
  window.addEventListener( 'mousemove', onMousemove, false );
  window.addEventListener( 'mouseup', onMouseup, false );
}

function onMousemove( event ) {
  setDragPositionX( event );
}

function setDragPositionX( event ) {
  var moveX = event.pageX - dragStartX;
  // set dragPosition
  dragPositionX = particleDragStartX + moveX;
}

// stop dragging
function onMouseup() {
  isDragging = false;
  window.removeEventListener( 'mousemove', onMousemove, false );
  window.removeEventListener( 'mouseup', onMouseup, false );
}
