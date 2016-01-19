(function () {
  window.BB = window.BB || {};

  var Wheel = BB.Wheel = function (center, frameHeight, tireRadius, scale, numSpokes) {
    this.axelVertex = new BB.Vertex(center, new BB.Vector(0, 0), new BB.Vector(0, 0), 1);
    this.vertices = [this.axelVertex];
    this.springs = [];
    this.tireVertices = this.buildTire(numSpokes, tireRadius, scale);
    this.axelFrameVertices = this.buildAxelFrameVertices(center, frameHeight, scale);
    this.buildAxelFrameSprings();
  }

  Wheel.prototype.buildAxelFrameVertices = function (center, frameHeight, scale) {
    var topPos = new BB.Vector(center.x, center.y - ((frameHeight / 2) * scale)),
        bottomPos = new BB.Vector(center.x, center.y + ((frameHeight / 2) * scale)),
        rightPos = new BB.Vector(center.x + ((frameHeight / 2) * scale), center.y),
        leftPos = new BB.Vector(center.x - ((frameHeight / 2) * scale), center.y);
    var zeroVec = new BB.Vector(0, 0);

    var topVertex = new BB.Vertex(topPos, zeroVec, zeroVec, 1),
        bottomVertex = new BB.Vertex(bottomPos, zeroVec, zeroVec, 1),
        rightVertex = new BB.Vertex(rightPos, zeroVec, zeroVec, 1),
        leftVertex = new BB.Vertex(leftPos, zeroVec, zeroVec, 1);

    var axelFrameVertices = {
      top: topVertex,
      bottom: bottomVertex,
      right: rightVertex,
      left: leftVertex
    }

    Object.keys(axelFrameVertices).forEach(function (key) {
      this.vertices.push(axelFrameVertices[key]);
    }.bind(this))

    return axelFrameVertices;
  }

  Wheel.prototype.buildAxelFrameSprings = function () {
    var innerAxelFrameStiffness = 40;
    var dampRat = 0.5;

    Object.keys(this.axelFrameVertices).forEach(function (location) {
      var vertex = this.axelFrameVertices[location];
      var spring = new BB.LinearSpring(vertex, this.axelVertex, innerAxelFrameStiffness, dampRat * innerAxelFrameStiffness);
      this.springs.push(spring);
    }.bind(this))

    var outerAxelFrameStiffness = 40;

    var top = this.axelFrameVertices['top'];
    var right = this.axelFrameVertices['right'];
    var bottom = this.axelFrameVertices['bottom'];
    var left = this.axelFrameVertices['left'];

    var topToRightSpring = new BB.LinearSpring(top, right, outerAxelFrameStiffness, dampRat * outerAxelFrameStiffness);
    var rightToBottomSpring = new BB.LinearSpring(right, bottom, outerAxelFrameStiffness, dampRat * outerAxelFrameStiffness);
    var bottomToLeftSpring = new BB.LinearSpring(bottom, left, outerAxelFrameStiffness, dampRat * outerAxelFrameStiffness);
    var leftToTopSpring = new BB.LinearSpring(left, top, outerAxelFrameStiffness, dampRat * outerAxelFrameStiffness);
    this.springs = this.springs.concat([topToRightSpring, rightToBottomSpring, bottomToLeftSpring, leftToTopSpring]);
  }

  Wheel.prototype.buildTire = function (numSpokes, radius, scale) {
    var radius = radius * scale;
    var angle = (2 * Math.PI) / numSpokes;
    var vertices = [];
    var zeroVec = new BB.Vector(0, 0);
    var tireStiffness = 40;
    var dampRat = 0.05;
    for(var n = 0; n < numSpokes; n++) {
      var pos = this.axelVertex.pos.scale(1);
      pos.x += radius * Math.cos(n * angle);
      pos.y += radius * Math.sin(n * angle);
      vertices.push(new BB.Vertex(pos, zeroVec, zeroVec, 0.25));
      if (n > 0) {
        var outerSpring = new BB.LinearSpring(vertices[n], vertices[n - 1], tireStiffness, dampRat * tireStiffness);
        this.springs.push(outerSpring);
      }
      var innerSpring = new BB.LinearSpring(vertices[n], this.axelVertex, tireStiffness, dampRat * tireStiffness);
      this.springs.push(innerSpring);
    }
    var lastOuterSpring = new BB.LinearSpring(vertices[numSpokes - 1], vertices[0], tireStiffness, dampRat * tireStiffness);
    this.springs.push(lastOuterSpring);

    this.vertices = this.vertices.concat(vertices);

    return vertices;
  }
}())
