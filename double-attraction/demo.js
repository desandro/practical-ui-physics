/**
 * drag physics
 */

// ----- Particle ----- //

function Particle( elem ) {
  this.element = elem;
  this.positionX = 25;
  this.dragPositionX = 0;
  this.velocityX = 0;
  this.friction = 0.93;
  this.accelX = 0;
  this.isDragging = false;
  this.attractionStrength = 0.03;
}

Particle.prototype.update = function() {
  // this.positionX = this.dragPositionX;
  this.applyAttraction( 300 );
  this.applyAttraction( 800 );
  this.applyDragForce();
  this.integrate();
};

Particle.prototype.integrate = function() {
  this.velocityX *= this.friction;
  this.positionX += this.velocityX;
};

Particle.prototype.applyForce = function( force ) {
  this.velocityX += force;
  this.accelX += force;
};

Particle.prototype.applyAttraction = function( target ) {
  var delta = target - this.positionX;
  var attraction = delta * this.attractionStrength;
  attraction = Math.abs( delta ) > 150 ? 0 : attraction;
  this.applyForce( attraction );
}

Particle.prototype.applyDragForce = function() {
  if ( !this.isDragging ) {
    return;
  }
  // change the position to drag position by applying force to acceleration
  var dragVelocity = this.dragPositionX - this.positionX;
  var dragForce = dragVelocity - this.velocityX;
  // dragForce *= 0.01;
  this.applyForce( dragForce );
  // or
  // this.velocityX = dragVelocity;
};

Particle.prototype.render = function() {
  this.element.style.transform = 'translateX(' + (this.positionX - 25) + 'px)';
};

// ----- demo ----- //

var particle;

document.addEventListener( 'DOMContentLoaded', init, false );

function init() {
  // create particle
  var particleElem = document.querySelector('.particle');
  particle = new Particle( particleElem );
  // logger = document.querySelector('.logger');
  // 
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
