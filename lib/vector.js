(function () {
  window.BB = window.BB || {};

  var Vector = BB.Vector = function (x, y) {
    this.x = x;
    this.y = y;
  }

  Vector.prototype.unitVector = function () {
    var mag = this.magnitude();
    if (mag === 0) {
      return new Vector(0, 0);
    } else {
      return this.scale(1/mag);
    }
  }

  Vector.prototype.scale = function (scalar) {
    return new Vector(this.x * scalar, this.y * scalar)
  }

  Vector.prototype.add = function (vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  Vector.prototype.subtract = function (vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  Vector.prototype.magnitude = function () {
    return Math.pow((Math.pow(this.x, 2) + Math.pow(this.y, 2)), .5);
  }

  Vector.prototype.dot = function (vector) {
    return (this.x * vector.x) + (this.y * vector.y);
  }

  Vector.prototype.cross = function (vector) {
    return this.x * vector.y - this.y * vector.x;
  }

  Vector.prototype.findAngle = function (vector) {
    var dot = this.dot(vector);
    var cross = this.cross(vector);
    var theta = Math.atan2(cross, dot); // finds angle between this and vector
    if (theta >= 0) {
      return theta;
    } else {
      return Math.PI * 2 + theta;
    }
  }

  Vector.prototype.getNormalDirection = function () {
    var origDir = this.unitVector();
    return new BB.Vector(origDir.y, -origDir.x);
  }
}())
