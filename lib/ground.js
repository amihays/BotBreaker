(function () {
  window.BB = window.BB || {};

  var Ground = BB.Ground = function (yPos, frictionCoeff, bounceCoeff) {
    this.yPos = yPos;
    this.dir = new BB.Vector(1, 0);
    BB.Boundary.call(this, frictionCoeff, bounceCoeff);
  }

  BB.Util.inherits(Ground, BB.Boundary);

  Ground.prototype.collided = function (vertex) {
    return vertex.pos.y > this.yPos;
  }

  Ground.prototype.restorePosition = function (vertex) {
    vertex.pos.y = this.yPos;
    vertex.vel.y = 0;
  }

  Ground.prototype.applyFriction = function (vertex) {
    // vertex.force.x -= vertex.vel.x * this.frictionCoeff;
    vertex.vel = vertex.vel.scale(1 - this.frictionCoeff);
  }

  Ground.prototype.updateVertexInteraction = function (vertex) {
    var boundaryDir = this.dir,
        normVec = boundaryDir.getNormalDirection(),
        projectedVel = normVec.dot(vertex.vel),
        projectedVec = normVec.scale(projectedVel * -1.0 * (1)),
        projectedForce = normVec.dot(vertex.force),
        projectedForceVec = normVec.scale(projectedForce * -1.0);

    if (projectedVel > 0) { // If vertex moving away from boundary, no longer attached
      vertex.boundary = null;
    } else {
      vertex.vel = vertex.vel.add(projectedVec);
      vertex.lastVel = vertex.vel;

      if (projectedForce < 0) {
        vertex.force = vertex.force.add(projectedForceVec);
        vertex.lastForce = vertex.force;
        this.applyFriction(vertex, projectedForceVec);
      }
    }
  }
}())
