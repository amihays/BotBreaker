(function () {
  window.BB = window.BB || {}

  var AngularSpring = BB.AngularSpring = function (vertex1, vertex2, centerVertex, stiffness, damping, equilAngle) {
    this.vertex1 = vertex1; // counter-clockwise of vertex2 by angle equilAngle
    this.vertex2 = vertex2; // clockwise of vertex1 by angle equilAngle
    this.centerVertex = centerVertex;
    this.equilAngle = equilAngle;
    BB.Spring.call(this, stiffness, damping);
  }
}())
