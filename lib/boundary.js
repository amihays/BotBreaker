(function () {
  window.BB = window.BB || {};

  var Boundary = BB.Boundary = function (frictionCoeff, bounceCoeff) {
    this.frictionCoeff = frictionCoeff;
    this.bounceCoeff = bounceCoeff;
  }

  Boundary.prototype.draw = function () {}

  Boundary.prototype.move = function () {}

  Boundary.prototype.restorePosition = function (vertex) {}

  Boundary.prototype.collided = function (vertex) {}
}())
