(function () {
  window.BB = window.BB || {};

  var Car = BB.Car = function () {
    var frameHeight = 50;
    var scale = 1;
    var pos = new BB.Vector(BB.Game.DIM_X - 120, 0),
        centerMass = 3;
    this.centerVertex = new BB.Vertex(pos, new BB.Vector(0, 0), new BB.Vector(0, 0), centerMass);
    this.wheels = this.buildWheels(frameHeight, scale, 10);
    this.body = this.buildBody(frameHeight, scale);
  }

  Car.prototype.buildBody = function (frameHeight, scale) {
    var topCentralFramePos = new BB.Vector(this.centerVertex.pos.x, this.centerVertex.pos.y - (frameHeight / 2) * scale);
    var bottomCentralFramePos = new BB.Vector(this.centerVertex.pos.x, this.centerVertex.pos.y + (frameHeight / 2) * scale);
    var frameStiffness = 20;
    var damping = 0.99;
    var zeroVec = new BB.Vector(0, 0);
    this.topCentralFrameVertex = new BB.Vertex(topCentralFramePos, zeroVec, zeroVec, 1);
    this.bottomCentralFrameVertex = new BB.Vertex(bottomCentralFramePos, zeroVec, zeroVec, 1);

    var centralToTopFrameSpring = new BB.LinearSpring(this.centerVertex, this.topCentralFrameVertex, frameStiffness, damping);
    var centralToBottomFrameSpring = new BB.LinearSpring(this.centerVertex, this.bottomCentralFrameVertex, frameStiffness, damping);

    var bodyVertices = [this.centerVertex, this.bottomCentralFrameVertex, this.topCentralFrameVertex];
    var bodySprings = [centralToTopFrameSpring, centralToBottomFrameSpring];
    this.wheels.forEach(function(wheel) {
      bodyVertices = bodyVertices.concat(wheel.vertices);
      var topToCenterSpring = new BB.LinearSpring(wheel.axelFrameVertices['top'], this.centerVertex, frameStiffness, damping),
          bottomToCenterSpring = new BB.LinearSpring(wheel.axelFrameVertices['bottom'], this.centerVertex, frameStiffness, damping),
          topToTopSpring = new BB.LinearSpring(wheel.axelFrameVertices['top'], this.topCentralFrameVertex, frameStiffness, damping),
          bottomToBottomSpring = new BB.LinearSpring(wheel.axelFrameVertices['bottom'], this.bottomCentralFrameVertex, frameStiffness, damping);
      bodySprings = bodySprings.concat([topToCenterSpring, bottomToCenterSpring, topToTopSpring, bottomToBottomSpring])
                               .concat(wheel.springs);
    }.bind(this))

    return new BB.Body(bodyVertices, bodySprings);
  }

  Car.prototype.buildWheels = function (frameHeight, scale, numSpokes) {
    var frameWidth = 120;
    var backTirePos = new BB.Vector(this.centerVertex.pos.x - ((frameWidth / 2) * scale), this.centerVertex.pos.y);
    var frontTirePos = new BB.Vector(this.centerVertex.pos.x + ((frameWidth / 2) * scale), this.centerVertex.pos.y);
    var tireRadius = 50;
    var backWheel = new BB.Wheel(backTirePos, frameHeight, tireRadius, scale, numSpokes);
    var frontWheel = new BB.Wheel(frontTirePos, frameHeight, tireRadius, scale, numSpokes);
    return [backWheel, frontWheel];
  }
}())
