(function () {
  window.BB = window.BB || {};

  var Ground = BB.Ground = function (yPos, frictionCoeff, bounceCoeff) {
    this.yPos = yPos;
    BB.Boundary.call(this, frictionCoeff, bounceCoeff);
  }

  BB.Util.inherits(Ground, BB.Boundary);

  Ground.prototype.collided = function (vertex) {
    return vertex.pos.y > this.yPos;
  }

  Ground.prototype.restorePosition = function (vertex) {
    vertex.pos.y = this.yPos;
  }

  Ground.prototype.applyFriction = function (vertex) {
    vertex.force.x -= vertex.vel.x * this.frictionCoeff;
  }
}())
