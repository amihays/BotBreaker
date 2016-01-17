(function () {
  window.BB = window.BB || {};

  var FixedBoundary = BB.FixedBoundary = function (pos1, pos2, frictionCoeff, bounceCoeff) {
    this.pos1 = pos1;
    this.pos2 = pos2;
    this.dir = pos2.subtract(pos1);
    BB.Boundary.call(this, frictionCoeff, bounceCoeff);
  }

  BB.Util.inherits(FixedBoundary, BB.Boundary);

  FixedBoundary.prototype.collided = function (vertex) {
    var xi = vertex.lastPos,
        xf = vertex.pos,
        A = this.pos1.subtract(xi),
        B = this.pos1.subtract(this.pos2),
        C = xf.subtract(xi);

    var t = ((A.y * B.x) - (A.x * B.y)) / ((C.y * B.x) - (C.x * B.y));
    var d = (A.x - t * C.x) / B.x;

    // console.log(C);
    // console.log(t);

    if ((t <= 1 && t >= 0) && (d <= 1 && t >= 0)) {
      vertex.collisionTimeFraction = t;
      vertex.collisionDistanceFraction = d;
      return true;
    }
    return false;
  }

  FixedBoundary.prototype.restorePosition = function (vertex) {
    var diffVec = this.pos2.subtract(this.pos1).scale(vertex.collisionDistanceFraction);
    var restorePos = this.pos1.add(diffVec).scale(1);
    var normVec = diffVec.getNormalDirection();
    var buffer = 0.00001;

    var sideVect = restorePos.subtract(vertex.lastPos);
    var side = sideVect.dot(normVec);
    if (side >= 0) {
      vertex.collisionSideSign = -1;
    } else {
      vertex.collisionSideSign = 1;
    }

    restorePos = restorePos.add(normVec.scale(vertex.collisionSideSign * buffer));
    vertex.pos = restorePos;
  }

  FixedBoundary.prototype.drawMoreShit = function (vectorPos, vectorVel, scalar) {
    // var scalar = 1000;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(vectorPos.x, vectorPos.y)
    ctx.lineTo(scalar * vectorVel.x + vectorPos.x, scalar * vectorVel.y + vectorPos.y);
    ctx.stroke();
  }

  FixedBoundary.prototype.restoreVelocity = function () {

  }

  FixedBoundary.prototype.applyFriction = function (vertex, normalForce) {
    // vertex.force.x -= vertex.vel.x * this.frictionCoeff;
    vertex.vel = vertex.vel.scale(1 - this.frictionCoeff);
  }

  FixedBoundary.prototype.updateVertexInteraction = function (vertex) {
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

  FixedBoundary.prototype.draw = function () {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(this.pos1.x, this.pos1.y)
    ctx.lineTo(this.pos2.x, this.pos2.y);
    ctx.stroke();
  }
}())
