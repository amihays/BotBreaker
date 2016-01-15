(function () {
  window.BB = window.BB || {};

  var FixedBoundary = BB.FixedBoundary = function (pos1, pos2, frictionCoeff, bounceCoeff) {
    this.pos1 = pos1;
    this.pos2 = pos2;
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
    var buffer = 0.0001;

    var sideVect = restorePos.subtract(vertex.lastPos);
    var side = sideVect.dot(normVec);
    if (side >= 0) {
      vertex.collisionSideSign = -1;
    } else {
      vertex.collisionSideSign = 1;
    }

    restorePos = restorePos.add(normVec.scale(vertex.collisionSideSign * buffer));
    vertex.pos = restorePos;

    var projectedVel = normVec.dot(vertex.vel);
    var projectedVec = normVec.scale(projectedVel * -1);

    vertex.vel = vertex.vel.add(projectedVec);
  }

  FixedBoundary.prototype.applyFriction = function (vertex) {
    // vertex.force.x -= vertex.vel.x * this.frictionCoeff;
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