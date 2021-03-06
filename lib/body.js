(function () {
  window.BB = window.BB || {};

  var Body = BB.Body = function (vertices, springs) {
    this.vertices = vertices;
    this.springs = springs;
  }

  Body.prototype.applyBoundaryForces = function () {
    this.vertices.forEach(function (vertex) {
      var boundary = vertex.boundary;
      if (boundary) {
        boundary.applyFriction(vertex);
      }
    })
  }

  Body.prototype.updateVelocities = function (dt) {
    this.vertices.forEach(function(vertex) {
      vertex.updateVelocity(dt);
    })
    this.springs.forEach(function(spring) {
      spring.dampVelocities();
    })
  }

  Body.prototype.zeroForces = function () {
    this.vertices.forEach(function(vertex) {
      vertex.force = new BB.Vector(0, 0);
    })
  }

  Body.prototype.applyInternalForces = function () {
    this.springs.forEach(function(spring) {
      spring.applyForce();
    })
  }

  Body.prototype.applyGravity = function (gravity) {
    this.vertices.forEach(function (vertex) {
      vertex.force = vertex.force.add(gravity.scale(vertex.mass));
    }.bind(this))
  }

  Body.prototype.draw = function (ctx) {
    // ctx.save();
    // ctx.translate(this.position.x, this.position.y);
    // ctx.rotate(-this.angle);
    // var scalar = 0.125;
    // ctx.drawImage(this.drawing,
    //               scalar * (-this.drawing.width / 2),
    //               scalar * (-this.drawing.height / 2 - 20),
    //               this.drawing.width * scalar,
    //               this.drawing.height * scalar);
    // ctx.restore();

    this.springs.forEach(function(spring) {
      spring.draw(ctx)
    })

    this.vertices.forEach(function(vertex){
      vertex.draw(ctx);
    });
  }

  Body.prototype.move = function (dt) {
    this.vertices.forEach(function(vertex) {
      vertex.move(dt);
    })
  }
}())
