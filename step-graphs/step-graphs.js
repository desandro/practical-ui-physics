// --------------------------  -------------------------- //

var step = 0;
var stepsCount = 6;
var delay = 500; // milliseconds
var blockSize = 100;

// --------------------------  -------------------------- //

function StepGraph( canvas ) {
  this.canvas = canvas;
  this.canvasWidth = canvas.width;
  this.canvasHeight = canvas.height;
  this.ctx = canvas.getContext('2d');
  this.velocity = parseFloat( canvas.getAttribute('data-velocity') || 0 );
  this.friction = parseFloat( canvas.getAttribute('data-friction') || 1 );
  this.force = parseFloat( canvas.getAttribute('data-force') || 0 );

  this.render();
}

StepGraph.prototype.render = function() {
  var ctx = this.ctx;
  ctx.clearRect( 0, 0, this.canvasWidth, this.canvasHeight );

  this.previousX = step === 0 ? 1 : this.x || 1;

  var x;
  for ( var i=0; i <= step; i++ ) {
    var prevX = x || 1;
    var velocity = i === 0 ? this.velocity : ( velocity + this.force ) * this.friction;
    x = i === 0 ? 1 : x + velocity;


    ctx.fillStyle = i == step ? 'hsla(0, 100%, 50%, 1)' : 'hsla(0, 100%, 50%, 0.3)' ;
    circle( ctx, x * blockSize, blockSize, blockSize * 0.4 );

    if ( i > 0 ) {
      var delta = x - prevX;
      ctx.font = '28px sans-serif';
      ctx.fillStyle = i == step ? 'hsla(0, 0%, 20%, 1)' : 'hsla(0, 0%, 20%, 0.2)';
      var text = '+' + Math.round( delta * 10 ) / 10;
      ctx.fillText( text, (x + prevX) * 0.5 * blockSize - 14, blockSize * 1.75 );
    }
  }

  // var delta = x - this.previousX;
  // ctx.font = '24px sans-serif';
  // ctx.fillStyle = '#333';
  // var text = '+' + Math.round( delta * 10 ) / 10;
  // ctx.fillText( text, x * blockSize, blockSize * 1.75 );

  this.x = x;

};

function circle( ctx, x, y, radius ) {
  ctx.beginPath();
  ctx.arc( x, y, radius, 0, Math.PI * 2 );
  ctx.fill();
  ctx.closePath();
}

// --------------------------  -------------------------- //

var canvases = document.querySelectorAll('.graph--canvas');

var graphs = [];

for ( var i=0, len = canvases.length; i < len; i++ ) {
  var graph = new StepGraph( canvases[i] );
  graphs.push( graph );
}

setInterval( function() {
  step++;
  step = step % stepsCount;
  for ( var i=0, len = graphs.length; i < len; i++ ) {
    graphs[i].render();
  }
}, delay );

( function() {
  var graphElems = document.querySelectorAll('.graph');
  for ( var i=0, len = graphElems.length; i < len; i++ ) {
    var graphElem = graphElems[i];
    var onClick = getOnClick( graphElem );
    graphElem.addEventListener( 'click', onClick, false );
  }

  function getOnClick( graphElem ) {
    return function() {
      graphElem.className += ' is-visible';
    }
  }
})();
