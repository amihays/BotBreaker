(function () {
  window.BB = window.BB || {};

  var Car = BB.Car = function () {
    var frameHeight = 50;
    var scale = 1;
    var pos = new BB.Vector(BB.Game.DIM_X / 2, BB.Game.DIM_Y / 2),
        centerMass = 5;
    this.centerVertex = new BB.Vertex(pos, new BB.Vector(0, 0), new BB.Vector(0, 0), centerMass);
    this.wheels = this.buildWheels(frameHeight, scale);
    this.body = this.buildBody(frameHeight, scale);
  }

  Car.prototype.buildBody = function (frameHeight, scale) {
    var topCentralFramePos = new BB.Vector(this.centerVertex.pos.x, this.centerVertex.pos.y - (frameHeight / 2) * scale);
    var bottomCentralFramePos = new BB.Vector(this.centerVertex.pos.x, this.centerVertex.pos.y + (frameHeight / 2) * scale);
    var frameStiffness = 50;
    var dampRat = 0.5;
    var zeroVec = new BB.Vector(0, 0);
    this.topCentralFrameVertex = new BB.Vertex(topCentralFramePos, zeroVec, zeroVec, 1);
    this.bottomCentralFrameVertex = new BB.Vertex(bottomCentralFramePos, zeroVec, zeroVec, 1);

    var centralToTopFrameSpring = new BB.LinearSpring(this.centerVertex, this.topCentralFrameVertex, frameStiffness, frameStiffness * dampRat);
    var centralToBottomFrameSpring = new BB.LinearSpring(this.centerVertex, this.bottomCentralFrameVertex, frameStiffness, frameStiffness * dampRat);

    var bodyVertices = [this.centerVertex, this.bottomCentralFrameVertex, this.topCentralFrameVertex];
    this.wheels.forEach(function(wheel) {
      wheel.vertices.forEach(function(vertex) {
        bodyVertices.push(vertex);
      })
    })
    var bodySprings = [centralToTopFrameSpring, centralToBottomFrameSpring];

    return new BB.Body(bodyVertices, bodySprings);
  }

  Car.prototype.buildWheels = function (frameHeight, scale) {
    var frameWidth = 200;
    var backTirePos = new BB.Vector(this.centerVertex.pos.x - ((frameWidth / 2) * scale), this.centerVertex.pos.y);
    var frontTirePos = new BB.Vector(this.centerVertex.pos.x + ((frameWidth / 2) * scale), this.centerVertex.pos.y);
    var tireRadius = 70;
    var backWheel = new BB.Wheel(backTirePos, frameHeight, tireRadius, scale);
    var frontWheel = new BB.Wheel(frontTirePos, frameHeight, tireRadius, scale);
    return [backWheel, frontWheel];
  }
}())
