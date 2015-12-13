function () {
  window.BB = window.BB || {};

  var Ground = BB.Ground = function () {

    BB.Boundary.call(this, frictionCoeff, bounceCoeff);
  }

  BB.Util.inherits(Ground, BB.Boundary);

}
