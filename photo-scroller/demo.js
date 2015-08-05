/**
 * drag physics
 */

// ----- Particle ----- //

function Particle( elem ) {
  this.element = elem;
  this.positionX = 0;
  this.dragPositionX = 0;
  this.velocityX = 0;
  this.friction = 0.95;
  this.isDragging = false;
}

Particle.prototype.update = function() {
  // this.positionX = this.dragPositionX;
  this.applyDragForce();
  this.applyBoundForce( this.rightBound, true );
  this.applyBoundForce( this.leftBound, false );
  this.integrate();
};

Particle.prototype.integrate = function() {
  this.velocityX *= this.friction;
  this.positionX += this.velocityX;
};

Particle.prototype.applyForce = function( force ) {
  this.velocityX += force;
};

Particle.prototype.applyDragForce = function() {
  if ( !this.isDragging ) {
    return;
  }
  // change the position to drag position by applying force to velocity
  var dragVelocity = this.dragPositionX - this.positionX;
  var dragForce = dragVelocity - this.velocityX;
  this.applyForce( dragForce );
};

Particle.prototype.applyBoundForce = function( bound, isForward ) {
  var isInside = isForward ? this.positionX < bound : this.positionX > bound;
  if ( this.isDragging || isInside ) {
    return;
  }
  // bouncing past bound
  var distance = bound - this.positionX;
  var force = distance * 0.1;
  var restX = this.positionX + ( this.velocityX + force ) * this.friction / ( 1 - this.friction );
  var isRestOutside = isForward ? restX > bound : restX < bound;
  if ( isRestOutside ) {
    this.applyForce( force );
    return;
  }
  // bounce back
  force = distance * 0.1 - this.velocityX;
  this.applyForce( force );
};

Particle.prototype.render = function() {
  this.element.style.transform = 'translateX(' + (this.positionX ) + 'px)';
};

// ----- demo ----- //

var particle;

document.addEventListener( 'DOMContentLoaded', init, false );

function init() {
  // create particle
  var img = document.querySelector('img');
  particle = new Particle( img );
  particle.rightBound = 0;
  particle.leftBound = window.innerWidth - 2000; // 2000 = img width

  document.body.addEventListener( 'mousedown', onMousedown, false );
  // start animation
  animate();
}

function animate() {
  particle.update();
  particle.render();
  requestAnimationFrame( animate );
}

var dragStartX;
var particleDragStartX;
var isDragging = false;

function onMousedown( event ) {
  event.preventDefault();
  // get drag start positions
  dragStartX = event.pageX;
  particleDragStartX = particle.positionX;
  particle.isDragging = true;
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
  particle.dragPositionX = particleDragStartX + moveX;
}

// stop dragging
function onMouseup() {
  particle.isDragging = false;
  window.removeEventListener( 'mousemove', onMousemove, false );
  window.removeEventListener( 'mouseup', onMouseup, false );
}
