(function () {
  window.BB = window.BB || {}

  var LinearSpring = BB.LinearSpring = function (vertex1, vertex2, stiffness, damping, equilLength) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.equilLength = equilLength;
    BB.Spring.call(this, stiffness, damping);
  }

  // LinearSpring.prototype.

  LinearSpring.prototype.applyForce = function () {
    var vector = vertex2.pos.subtract(vertex1.pos);
    var length = vector.magnitude();
    var strain = length - this.equilLength;
    var direction = vector.unitVector();
    var springForce = direction.scale(strain * this.stiffness);

    this.vertex1.force = this.vertex1.force.add(springForce);
    this.vertex2.force = this.vertex2.force.subtract(springForce);
  }
}())
