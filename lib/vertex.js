(function () {
  window.BB = window.BB || {};

  var Vertex = BB.Vertex = function (position, velocity, force, mass) {
    this.mass = mass;
    this.pos = position.scale(1);
    this.vel = velocity.scale(1);
    this.force = force.scale(1);
    this.setLasts();
    this.spring = null;
    this.boundary = null;
    this.collisionTimeFraction = 0;
    this.collisionDistanceFraction = 0;
    this.collisionSideSign = 0;
  }

  Vertex.prototype.setLasts = function () {
    this.lastPos = this.pos;
    this.lastVel = this.vel;
    this.lastForce = this.force;
  }

  Vertex.prototype.move = function (dt) {
    // this.setLasts(); // could be a source of errors! This was at end before.
    var lastAcceleration = this.lastForce.scale(1 / this.mass);
    // var acceleration = this.force.scale(1 / this.mass);
    // this.vel = this.lastVel.add((lastAcceleration.add(acceleration)).scale(0.5 * dt))

    if (this.boundary) {
      this.boundary.updateVertexInteraction(this);
    }

    this.pos = this.lastPos.add(this.lastVel.scale(dt)).add(lastAcceleration.scale(0.5 * Math.pow(dt, 2)));
  }

  Vertex.prototype.updateVelocity = function (dt) {
    var lastAcceleration = this.lastForce.scale(1 / this.mass);
    var acceleration = this.force.scale(1 / this.mass);
    this.vel = this.lastVel.add((lastAcceleration.add(acceleration)).scale(0.5 * dt))
  }

  Vertex.prototype.draw = function(ctx){
    ctx.fillStyle = "blue";
    ctx.beginPath();

    ctx.arc(this.pos.x, //x pos
            this.pos.y, //y pos
            5,
            0,
            Math.PI * 2,
            false);
    ctx.fill();

    Vertex.prototype.setAdjacentBoundary = function (boundary) {
      this.boundary = boundary;
    }

    // var scale = 30;
    // ctx.strokeStyle = "red";
    // ctx.lineWidth = 2;
    // ctx.beginPath();
    // ctx.moveTo(this.pos.x, this.pos.y);
    // ctx.lineTo(this.force.x * scale + this.pos.x, this.force.y * scale + this.pos.y);
    // ctx.stroke();
  }
}())
