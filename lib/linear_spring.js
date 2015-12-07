(function () {
  window.BB = window.BB || {}

  var LinearSpring = BB.LinearSpring = function (vertex1, vertex2, stiffness, damping, equilLength) {
    this.vertex1 = vertex1;
    this.vertex2 = vertex2;
    this.equilLength = equilLength;
    BB.Spring.call(this, stiffness, damping);
  }

  LinearSpring.prototype.applyForce = function () {
    var vector = this.springVector();
    var strain = this.strain();
    var direction = vector.unitVector();
    var springForce = direction.scale(strain * this.stiffness);

    this.vertex1.force = this.vertex1.force.add(springForce);
    this.vertex2.force = this.vertex2.force.subtract(springForce);

    var vel_dot_dir1 = direction.dot(this.vertex1.vel); // proportion of velocity in the direction of the spring
    var vel_dot_dir2 = direction.dot(this.vertex2.vel); // proportion of velocity in the direction of the spring
    var dampForce1 = direction.scale(-vel_dot_dir1 * this.damping);
    var dampForce2 = direction.scale(-vel_dot_dir2 * this.damping);

    // if (dampForce1.magnitude() >= springForce.magnitude()) {
    //   dampForce1.scale(springForce.magnitude() / dampForce1.magnitude())
    // }
    // if (dampForce2.magnitude() >= springForce.magnitude()) {
    //   dampForce2.scale(springForce.magnitude() / dampForce2.magnitude())
    // }
    this.vertex1.force = this.vertex1.force.add(dampForce1);
    this.vertex2.force = this.vertex2.force.add(dampForce2);

    this.drawShit(springForce, dampForce1, dampForce2);
  }

  LinearSpring.prototype.drawShit = function (springForce, dampForce1, dampForce2) {
    var scalar = 30;
    ctx.strokeStyle = "red";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.vertex1.pos.x, this.vertex1.pos.y)
    ctx.lineTo(scalar * springForce.x + this.vertex1.pos.x, scalar * springForce.y + this.vertex1.pos.y);
    ctx.stroke();

    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(this.vertex2.pos.x, this.vertex2.pos.y)
    ctx.lineTo(scalar * -springForce.x + this.vertex2.pos.x, scalar * -springForce.y + this.vertex2.pos.y);
    ctx.stroke();

    ctx.strokeStyle = "teal";
    ctx.beginPath();
    ctx.moveTo(this.vertex1.pos.x, this.vertex1.pos.y)
    ctx.lineTo(scalar * dampForce1.x + this.vertex1.pos.x, scalar * dampForce1.y + this.vertex1.pos.y);
    ctx.stroke();

    ctx.strokeStyle = "teal";
    ctx.beginPath();
    ctx.moveTo(this.vertex2.pos.x, this.vertex2.pos.y)
    ctx.lineTo(scalar * dampForce2.x + this.vertex2.pos.x, scalar * dampForce2.y + this.vertex2.pos.y);
    ctx.stroke();
  }

  LinearSpring.prototype.springVector = function () {
    return this.vertex2.pos.subtract(this.vertex1.pos);
  }

  LinearSpring.prototype.strain = function () {
    var length = this.springVector().magnitude();
    return length - this.equilLength;
  }

  LinearSpring.prototype.draw = function (ctx) {
    var strain = this.strain();
    if (Math.abs(strain) < .1) {
      ctx.strokeStyle = "green";
    } else if (strain > 0) {
      ctx.strokeStyle = "orange";
    } else {
      ctx.strokeStyle = "purple";
    }
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(this.vertex1.pos.x, this.vertex1.pos.y)
    ctx.lineTo(this.vertex2.pos.x, this.vertex2.pos.y);
    ctx.stroke();
  }

}())
