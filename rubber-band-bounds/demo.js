/**
 * drag physics
 */

// ----- Particle ----- //

function Particle( elem ) {
  this.element = elem;
  this.positionX = 0;
  this.dragPositionX = 0;
  this.velocityX = 0;
  this.friction = 0.93;
  this.accelX = 0;
  this.isDragging = false;
}

Particle.prototype.update = function() {
  // this.positionX = this.dragPositionX;
  this.applyDragForce();
  this.applyRightBoundForce();
  this.integrate();
};

Particle.prototype.integrate = function() {
  this.velocityX += this.accelX;
  this.velocityX *= this.friction;
  this.positionX += this.velocityX;
  // reset acceleration
  this.accelX = 0;
};

Particle.prototype.applyForce = function( force ) {
  this.accelX += force;
};

Particle.prototype.applyDragForce = function() {
  if ( !this.isDragging ) {
    return;
  }
  // change the position to drag position by applying force to acceleration
  var dragVelocity = this.dragPositionX - this.positionX;
  var dragForce = dragVelocity - this.velocityX;
  // dragForce *= 0.2;
  this.applyForce( dragForce );
};

Particle.prototype.applyRightBoundForce = function() {
  if ( this.isDragging || this.positionX < 800 ) {
    return;
  }
  var delta = 800 - this.positionX;
  var force = delta * 0.03;
  // var force = -60;
  // if ( this.velocityX > 0 ) {
  //   this.applyForce( force );
  //   return;
  // }
  //
  // var force = delta * ( 1 - this.friction ) - this.velocityX;
  // this.applyForce( force * 0.5 );
  
  var restX = this.positionX + (this.velocityX + force ) / ( 1 - this.friction );
  if ( restX > 800 ) {
    this.applyForce( force );
    return;
  }

  var snapBack = delta * ( 1 - this.friction ) - this.velocityX;
  force = force * 0.5 + snapBack * 0.5;
  this.applyForce( force );
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
