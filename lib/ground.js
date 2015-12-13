(function () {
  window.BB = window.BB || {};

  var Ground = BB.Ground = function (yPos, frictionCoeff, bounceCoeff) {
    this.yPos = yPos;
    BB.Boundary.call(this, frictionCoeff, bounceCoeff);
  }

  BB.Util.inherits(Ground, BB.Boundary);
}())
