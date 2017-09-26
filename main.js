// setup canvas

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

var width = canvas.width = window.innerWidth;
var height = canvas.height = window.innerHeight;

// function to generate random number

function random(min,max) {
  var num = Math.floor(Math.random()*(max-min)) + min;
  return num;
}

var balls = [];
var ballsStartNo = 0;
var ballsNo = 0;

function displayMessage()
{
  var panel = document.querySelector('div');
  ballsSubmit.addEventListener('click', function(){
    ballsStartNo = Number(ballsField.value);
    panel.parentNode.removeChild(panel);
    loop();
  })
}

var para = document.querySelector('body > p');

function Shape(x, y, velX, velY) {
  this.x = x;
  this.y = y;
  this.velX = velX;
  this.velY = velY;
  this.exists = true;
}
function Ball(x, y, velX, velY, color, size){
  Shape.call(this, x, y, velX, velY);
  this.color = color;
  this.size = size;
}
Ball.prototype = Object.create(Shape.prototype);
Ball.prototype.constructor = Ball;
Ball.prototype.draw = function() {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.fill();
}
Ball.prototype.update = function() {
  if ((this.x + this.size) >= width) {
    this.velX = -(this.velX);
  }

  if ((this.x - this.size) <= 0) {
    this.velX = -(this.velX);
  }

  if ((this.y + this.size) >= height) {
    this.velY = -(this.velY);
  }

  if ((this.y - this.size) <= 0) {
    this.velY = -(this.velY);
  }

  this.x += this.velX;
  this.y += this.velY;
}
Ball.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if (!(this === balls[j])) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].color = this.color = 'rgb(' + random(0, 255) + ',' + random(0, 255) + ',' + random(0, 255) +')';
      }
    }
  }
}

function EvilCircle(x, y)
{
  Shape.call(this, x, y, 20, 20);
  this.color = 'white';
  this.size = 10;
}
EvilCircle.prototype = Object.create(Shape.prototype);
EvilCircle.prototype.constructor = EvilCircle;
EvilCircle.prototype.draw = function() {
  ctx.beginPath();
  ctx.lineWidth = 3;
  ctx.strokeStyle = this.color;
  ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
  ctx.stroke();
}
EvilCircle.prototype.checkBounds = function() {
  if ((this.x + this.size) >= width) {
    this.x -= this.size;
  }

  if ((this.x - this.size) <= 0) {
    this.x += this.size;
  }

  if ((this.y + this.size) >= height) {
    this.y -= this.size;
  }

  if ((this.y - this.size) <= 0) {
    this.y += this.size;
  }
}
EvilCircle.prototype.setControls = function() {
  var _this = this;
  window.onkeydown = function(e) {
      if (e.keyCode === 65) {
        _this.x -= _this.velX;
      } else if (e.keyCode === 68) {
        _this.x += _this.velX;
      } else if (e.keyCode === 87) {
        _this.y -= _this.velY;
      } else if (e.keyCode === 83) {
        _this.y += _this.velY;
      }
    }
}
EvilCircle.prototype.collisionDetect = function() {
  for (var j = 0; j < balls.length; j++) {
    if(balls[j].exists == true) {
      var dx = this.x - balls[j].x;
      var dy = this.y - balls[j].y;
      var distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < this.size + balls[j].size) {
        balls[j].exists = false;
        --ballsNo;
        para.textContent = 'Balls count: ' + String(ballsNo);
      }
    }
  }
}
var player = new EvilCircle(random(0, width), random(0, height));
player.setControls();
function loop() {
  ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
  ctx.fillRect(0, 0, width, height);

  while (balls.length < ballsStartNo) {
    var ball = new Ball(
      random(0,width),
      random(0,height),
      random(-7,7),
      random(-7,7),
      'rgb(' + random(0,255) + ',' + random(0,255) + ',' + random(0,255) +')',
      random(10,20)
    );
    balls.push(ball);
    ++ballsNo;
    para.textContent = 'Balls count: ' + String(ballsNo);
  }

  for (var i = 0; i < balls.length; i++) {
    if(balls[i].exists == true){
      balls[i].draw();
      balls[i].update();
      balls[i].collisionDetect();
    }
  }
  player.draw();
  player.checkBounds();
  player.collisionDetect();
  if(ballsNo > 0)
  {
    requestAnimationFrame(loop);
  }
  else
  {
    canvas.parentNode.removeChild(canvas);
    document.body.removeChild(document.querySelector('h1'));
    document.body.removeChild(para);
    document.body.margin = '0 auto';
    var gameOver = document.createElement('h1');
    gameOver.textContent = 'You\'ve Won!';
    gameOver.style.color = 'black';
    //gameOver.style.display = 'inline-block';
    gameOver.style.margin = '250px 0';
    gameOver.style.position = 'static';
    gameOver.style.textAlign = 'center';
    document.body.appendChild(gameOver);
  }
}

var ballsField = document.querySelector('.ballsField');
var ballsSubmit = document.querySelector('.ballsSubmit');

displayMessage();