
(function () {
  window.BB = window.BB || {};

  var Game = BB.Game = function () {
    this.bodies = Game.buildBodies();
    this.boundaries = Game.buildBoundaries();
    this.dt = .02;
    this.gravity = new BB.Vector(0, 8.8);
    this.logStuff();
    // this.backgroundImage = new Image();
    // this.backgroundImage.src = "kirby-dreamland.png";
  }

  canvas = document.getElementById("game-canvas");
  Game.DIM_X = window.innerWidth;
  Game.DIM_Y = window.innerHeight;

  Game.buildBoundaries = function () {
    var ground = new BB.Ground(Game.DIM_Y, 10, 5);
    var pos1 = new BB.Vector(0, 0.3 * Game.DIM_Y);
    var pos2 = new BB.Vector(Game.DIM_X, 1.5 * Game.DIM_Y);
    var fixedBoundary = new BB.FixedBoundary(pos1, pos2, 1, 0);
    return [ground, fixedBoundary];
    // return [ground];
  }

  Game.buildBodies = function () {
    var vertex1 = new BB.Vertex(new BB.Vector(330, 100), new BB.Vector(0, 0), new BB.Vector(0, 0), 1);
    var vertex2 = new BB.Vertex(new BB.Vector(335, 380), new BB.Vector(0, 0), new BB.Vector(0, 0), 1);
    var vertex3 = new BB.Vertex(new BB.Vector(450, 300), new BB.Vector(0, 0), new BB.Vector(0, 0), 1);
    var vertex4 = new BB.Vertex(new BB.Vector(430, 600), new BB.Vector(0, 0), new BB.Vector(0, 0), 1);

    var dampRat = 0.5;
    var stiffness = 20;

    var linSpring1_2 = new BB.LinearSpring(vertex1, vertex2, stiffness, stiffness * dampRat, 200);
    var linSpring1_3 = new BB.LinearSpring(vertex1, vertex3, stiffness, stiffness * dampRat, 300);
    var linSpring2_3 = new BB.LinearSpring(vertex2, vertex3, stiffness, stiffness * dampRat, 200);
    var linSpring3_4 = new BB.LinearSpring(vertex3, vertex4, .8, .2, 300);

    return [new BB.Body([vertex1, vertex2, vertex3], [linSpring1_2, linSpring1_3, linSpring2_3])]
    // return [new BB.Body([vertex1, vertex2], [linSpring1_2])];
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
    return this.bodies.concat(this.boundaries);
  }

  Game.prototype.updateBodyForces = function () {
    this.bodies.forEach(function (body) {
      body.applyInternalForces();
      body.applyBoundaryForces();
      body.applyGravity(this.gravity);
    }.bind(this))
  }

  Game.prototype.moveObjects = function () {
    this.allObjects().forEach(function (body) {
      body.move(this.dt);
    }.bind(this))
    // this.sprite.update()
  }

  Game.prototype.logStuff = function () {
    var vector1 = new BB.Vector(0, 1);
    var vector2 = new BB.Vector(Math.cos(Math.PI / 4), Math.sin(Math.PI / 4));
    console.log((vector1.findAngle(vector2)) * (360 / (2 * Math.PI)));
  }

  Game.prototype.updateBoundaryContacts = function () {
    this.bodies.forEach(function (body) {
      body.vertices.forEach(function (vertex) {
        vertex.setAdjacentBoundary(null);
        this.boundaries.forEach(function (boundary) {
          if (boundary.collided(vertex)) {
            boundary.restorePosition(vertex);
            vertex.setAdjacentBoundary(boundary);
          }
        });
      }.bind(this));
    }.bind(this));
  }

  Game.prototype.zeroBodyForces = function () {
    this.bodies.forEach(function(body) {
      body.zeroForces();
    });
  }

  Game.prototype.setVertexLasts = function () {
    this.bodies.forEach(function (body) {
      body.vertices.forEach(function (vertex) {
        vertex.setLasts();
      })
    })
  }

  Game.prototype.step = function(ctx){
    this.draw(ctx);
    this.zeroBodyForces();
    this.updateBodyForces();
    this.moveObjects();
    this.updateBoundaryContacts();
    this.setVertexLasts();
    // this.applyGravity();
  }
}())
