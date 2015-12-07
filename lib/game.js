(function () {
  window.BB = window.BB || {};

  var Game = BB.Game = function () {
    this.bodies = Game.buildBodies();
    this.dt = .2;
    this.gravity = new BB.Vector(0, 0)
    this.logStuff();
    // this.backgroundImage = new Image();
    // this.backgroundImage.src = "kirby-dreamland.png";
  }

  canvas = document.getElementById("game-canvas");
  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;

  Game.buildBodies = function () {
    var vertex1 = new BB.Vertex(new BB.Vector(230, 250), new BB.Vector(0, 0), new BB.Vector(0, 0), 1)
    var vertex2 = new BB.Vertex(new BB.Vector(450, 200), new BB.Vector(0, 0), new BB.Vector(0, 0), 1)
    var vertex3 = new BB.Vertex(new BB.Vector(350, 400), new BB.Vector(0, 0), new BB.Vector(0, 0), 1)

    var linSpring1_2 = new BB.LinearSpring(vertex1, vertex2, 0.04, .3, 200)
    var linSpring1_3 = new BB.LinearSpring(vertex1, vertex3, 0.2, .1, 100)
    var linSpring2_3 = new BB.LinearSpring(vertex2, vertex3, 0.1, .3, 150)

    return [new BB.Body([vertex1, vertex2, vertex3], [linSpring1_2, linSpring1_3, linSpring2_3])]
  }

  // Game.bodyBuilder = function () {
  //   var position = new BB.Vector(BB.Game.DIM_X / 2 + 67, BB.Game.DIM_Y - 125);
  //   var velocity = new BB.Vector(0, 50);
  //   var force = new BB.Vector(0, 0);
  //   var angVel = 0;
  //   var torque = 0;
  //   var vertices = [
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(8, -38), 15), //top of head
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(-5, -30), 15), //left top of head
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(26, -37), 15), //right top of head
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(43, -15), 15), //right armpit
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(-10, 0), 15), //left armpit
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(53, 10), 15), //right foot
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(30, 13), 15), //crotch
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(10, 28), 15), //left foot
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(-22, -15), 15), //left arm
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(50, -32), 15), //right arm
  //     new BB.Vertex(new BB.Vector(0, 0), new BB.Vector(10, 8), 100) //center
  //   ]
  //   return new BB.Body(position, velocity, force, angVel, torque, vertices);
  // }

  Game.prototype.draw = function(ctx){
    ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
    // ctx.drawImage(this.backgroundImage, 0, 0, Game.DIM_X, Game.DIM_Y);
    this.allObjects().forEach(function(body){
      body.draw(ctx);
    });
  }

  Game.prototype.allObjects = function () {
    return this.bodies;
  }

  Game.prototype.updateBodyForces = function () {
    this.bodies.forEach(function (body) {
      body.applyInternalForces();
    })
  }

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (body) {
      body.move(this.dt, this.gravity);
    }.bind(this))
    // this.sprite.update()
  }

  Game.prototype.logStuff = function () {
    var vector1 = new BB.Vector(0, 1);
    var vector2 = new BB.Vector(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));
    console.log((vector1.findAngle(vector2)) * (360 / (2 * Math.PI)));
  }
  //
  // Game.prototype.allBoxes = function (ctx) {
  //   var boxes = [];
  //   // this.allObjects().forEach(function(object) {
  //   //   if (object.box) {
  //   //     boxes.push(object.box)
  //   //   }
  //   // })
  //   return boxes;
  // }

  // Game.prototype.vertices = function () {
  //   var vertices = [];
  //   this.bodies.forEach(function (body) {
  //     vertices = vertices.concat(body.vertices)
  //   }.bind(this))
  //   return vertices;
  // }

  // Game.prototype.handleCollisions = function () {
  //   this.spring.applyCollisionForce(this.vertices(), this.bodies[0]);
  //   this.bricks.forEach(function (brick) {
  //     brick.applyCollisionForce(this.vertices(), this.bodies[0])
  //   }.bind(this))
  // }

  Game.prototype.zeroBodyForces = function () {
    this.bodies.forEach(function(body) {
      body.zeroForces();
    })
  }

  Game.prototype.step = function(ctx){
    this.draw(ctx);
    this.zeroBodyForces();
    this.updateBodyForces();
    // this.handleCollisions();
    this.moveObjects();
    // this.applyGravity();
  }
}())
