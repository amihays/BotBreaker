(function () {
  window.BB = window.BB || {}

  var LinearSpring = BB.LinearSpring = function (vertex1, vertex2, stiffness, damping, equilLength) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.equilLength = equilLength;
    BB.Spring.call(this, stiffness, damping);
  }

  LinearSpring.prototype.applyForce = function () {
    var vector = this.vertex2.pos.subtract(this.vertex1.pos);
    var length = vector.magnitude();
    var strain = length - this.equilLength;
    var direction = vector.unitVector();
    var springForce = direction.scale(strain * this.stiffness);

    this.vertex1.force = this.vertex1.force.add(springForce);
    this.vertex2.force = this.vertex2.force.subtract(springForce);

    var vel_dot_dir1 = direction.dot(this.vertex1.vel); // proportion of velocity in the direction of the spring
    var vel_dot_dir2 = direction.dot(this.vertex2.vel); // proportion of velocity in the direction of the spring
    var damp_force1 = direction.scale(-vel_dot_dir1 * this.damping);
    var damp_force2 = direction.scale(-vel_dot_dir2 * this.damping);

    if (damp_force1.magnitude() <= springForce.magnitude()) {
      damp_force1.scale(springForce.magnitude() / damp_force1.magnitude())
    }
    if (damp_force2.magnitude() <= springForce.magnitude()) {
      damp_force2.scale(springForce.magnitude() / damp_force2.magnitude())
    }
    this.vertex1.force = this.vertex1.force.add(damp_force1);
    this.vertex2.force = this.vertex2.force.add(damp_force2);
  }

  LinearSpring.prototype.draw = function (ctx) {
    ctx.fillStyle = "green";
    ctx.beginPath();
    ctx.moveTo(this.vertex1.pos.x, this.vertex1.pos.y)
    ctx.lineTo(this.vertex2.pos.x, this.vertex2.pos.y);
    ctx.stroke();
  }

}())
