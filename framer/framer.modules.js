require=(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({"material":[function(require,module,exports){
var Line, S,
  extend = function(child, parent) { for (var key in parent) { if (hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; },
  hasProp = {}.hasOwnProperty;

S = function(n) {
  var device, scale;
  scale = 1;
  device = Framer.Device.deviceType;
  if (device.slice(0, "apple-iphone".length) === "apple-iphone") {
    scale = Screen.width / 375;
  } else if (device.slice(0, "google-nexus".length) === "google-nexus") {
    scale = Screen.width / 360;
  }
  return n * scale;
};

Line = (function(superClass) {
  extend(Line, superClass);

  function Line(size, thickness, color) {
    Line.__super__.constructor.call(this, {
      width: size,
      height: size,
      backgroundColor: null
    });
    this.leftHalfWrapper = new Layer({
      backgroundColor: null,
      width: this.width / 2,
      height: this.width,
      parent: this,
      clip: true,
      force2d: true
    });
    this.leftHalfClip = new Layer({
      backgroundColor: null,
      x: this.width / 2,
      width: this.width / 2,
      height: this.width,
      originX: 0,
      originY: 0.5,
      parent: this.leftHalfWrapper,
      clip: true,
      force2d: true
    });
    this.leftHalf = new Layer({
      backgroundColor: null,
      x: -this.width / 2,
      width: this.width,
      height: this.width,
      borderRadius: this.width / 2,
      borderWidth: thickness,
      borderColor: color,
      parent: this.leftHalfClip,
      force2d: true
    });
    this.rightHalfWrapper = new Layer({
      backgroundColor: null,
      x: this.width / 2,
      width: this.width / 2,
      height: this.width,
      parent: this,
      clip: true,
      force2d: true
    });
    this.rightHalfClip = new Layer({
      backgroundColor: null,
      x: -this.width / 2,
      width: this.width / 2,
      height: this.width,
      originX: 1,
      originY: 0.5,
      parent: this.rightHalfWrapper,
      clip: true,
      force2d: true
    });
    this.rightHalf = new Layer({
      backgroundColor: null,
      width: this.width,
      height: this.width,
      borderRadius: this.width / 2,
      borderWidth: thickness,
      borderColor: color,
      parent: this.rightHalfClip,
      force2d: true
    });
  }

  Line.prototype._v = 0;

  Line.define("value", {
    get: function() {
      return this._v;
    },
    set: function(v) {
      this._v = v;
      if (v < 0.5) {
        this.rightHalfClip.rotationZ = 360 * v;
        return this.leftHalfClip.rotationZ = 0;
      } else {
        this.rightHalfClip.rotationZ = 180;
        return this.leftHalfClip.rotationZ = 360 * v - 180;
      }
    }
  });

  return Line;

})(Layer);

exports.Spinner = (function(superClass) {
  extend(Spinner, superClass);

  Spinner.prototype.colors = ["#DB4437", "#4285F4", "#0F9D58", "#F4B400"];

  function Spinner(options) {
    this.options = options != null ? options : {};
    if (!this.options.size) {
      this.options.size = 48;
    }
    if (!this.options.thickness) {
      this.options.thickness = 4;
    }
    if (!this.options.color) {
      this.options.color = "#4285f4";
    }
    if (typeof this.options.changeColor === "undefined") {
      this.options.changeColor = true;
    }
    Spinner.__super__.constructor.call(this, {
      width: S(this.options.size),
      height: S(this.options.size),
      backgroundColor: null
    });
    this.line = new Line(S(this.options.size), S(this.options.thickness), this.options.color);
    this.line.parent = this;
  }

  Spinner.prototype._started = false;

  Spinner.prototype.start = function() {
    this.rotation = this.line.value = 0;
    this.opacity = 1;
    this._started = true;
    return this._animate();
  };

  Spinner.prototype.stop = function() {
    this._started = false;
    return this.animate({
      properties: {
        opacity: 0
      },
      time: 0.2
    });
  };

  Spinner.prototype._counter = 0;

  Spinner.prototype._animate = function() {
    var lineIn, lineOut, rotate;
    rotate = new Animation({
      layer: this,
      properties: {
        rotation: 360
      },
      time: 1.9,
      curve: "linear"
    });
    lineIn = new Animation({
      layer: this.line,
      properties: {
        value: 0.75
      },
      time: 0.64,
      curve: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    });
    lineOut = new Animation({
      layer: this.line,
      properties: {
        value: 0.03,
        rotation: 360
      },
      time: 0.78,
      curve: "cubic-bezier(0.4, 0.0, 0.2, 1)"
    });
    rotate.on(Events.AnimationEnd, (function(_this) {
      return function() {
        _this.rotation = 0;
        if (_this._started) {
          return rotate.start();
        }
      };
    })(this));
    lineIn.on(Events.AnimationEnd, (function(_this) {
      return function() {
        if (_this._started) {
          return lineOut.start();
        }
      };
    })(this));
    lineOut.on(Events.AnimationEnd, (function(_this) {
      return function() {
        _this.line.rotation = 0;
        if (_this._started) {
          lineIn.start();
        }
        if (_this.options.changeColor) {
          _this.line.leftHalf.animate({
            properties: {
              borderColor: _this.colors[_this._counter]
            },
            time: 0.2,
            colorModel: "rgb"
          });
          _this.line.rightHalf.animate({
            properties: {
              borderColor: _this.colors[_this._counter]
            },
            time: 0.2,
            colorModel: "rgb"
          });
          _this._counter++;
          if (_this._counter >= _this.colors.length) {
            return _this._counter = 0;
          }
        }
      };
    })(this));
    rotate.start();
    return lineIn.start();
  };

  return Spinner;

})(Layer);


},{}],"myModule":[function(require,module,exports){
exports.myVar = "myVariable";

exports.myFunction = function() {
  return print("myFunction is running");
};

exports.myArray = [1, 2, 3];


},{}]},{},[])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZnJhbWVyLm1vZHVsZXMuanMiLCJzb3VyY2VzIjpbIi4uL21vZHVsZXMvbXlNb2R1bGUuY29mZmVlIiwiLi4vbW9kdWxlcy9tYXRlcmlhbC5jb2ZmZWUiLCJub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIl0sInNvdXJjZXNDb250ZW50IjpbIiMgQWRkIHRoZSBmb2xsb3dpbmcgbGluZSB0byB5b3VyIHByb2plY3QgaW4gRnJhbWVyIFN0dWRpby4gXG4jIG15TW9kdWxlID0gcmVxdWlyZSBcIm15TW9kdWxlXCJcbiMgUmVmZXJlbmNlIHRoZSBjb250ZW50cyBieSBuYW1lLCBsaWtlIG15TW9kdWxlLm15RnVuY3Rpb24oKSBvciBteU1vZHVsZS5teVZhclxuXG5leHBvcnRzLm15VmFyID0gXCJteVZhcmlhYmxlXCJcblxuZXhwb3J0cy5teUZ1bmN0aW9uID0gLT5cblx0cHJpbnQgXCJteUZ1bmN0aW9uIGlzIHJ1bm5pbmdcIlxuXG5leHBvcnRzLm15QXJyYXkgPSBbMSwgMiwgM10iLCJTID0gKG4pIC0+XG5cdHNjYWxlID0gMVxuXHRkZXZpY2UgPSBGcmFtZXIuRGV2aWNlLmRldmljZVR5cGVcblx0aWYgZGV2aWNlLnNsaWNlKDAsIFwiYXBwbGUtaXBob25lXCIubGVuZ3RoKSBpcyBcImFwcGxlLWlwaG9uZVwiXG5cdFx0c2NhbGUgPSBTY3JlZW4ud2lkdGggLyAzNzVcblx0ZWxzZSBpZiBkZXZpY2Uuc2xpY2UoMCwgXCJnb29nbGUtbmV4dXNcIi5sZW5ndGgpIGlzIFwiZ29vZ2xlLW5leHVzXCJcblx0XHRzY2FsZSA9IFNjcmVlbi53aWR0aCAvIDM2MFxuXHRyZXR1cm4gbiAqIHNjYWxlXG5cbmNsYXNzIExpbmUgZXh0ZW5kcyBMYXllclxuXHRjb25zdHJ1Y3RvcjogKHNpemUsIHRoaWNrbmVzcywgY29sb3IpLT5cblx0XHRzdXBlciB3aWR0aDogc2l6ZSwgaGVpZ2h0OiBzaXplLCBiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblxuXHRcdCMgTGVmdCBoYWxmXG5cdFx0QGxlZnRIYWxmV3JhcHBlciA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR3aWR0aDogQHdpZHRoIC8gMiwgaGVpZ2h0OiBAd2lkdGhcblx0XHRcdHBhcmVudDogQFxuXHRcdFx0Y2xpcDogeWVzXG5cdFx0XHRmb3JjZTJkOiB5ZXNcblx0XHRAbGVmdEhhbGZDbGlwID0gbmV3IExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdHg6IEB3aWR0aCAvIDJcblx0XHRcdHdpZHRoOiBAd2lkdGggLyAyLCBoZWlnaHQ6IEB3aWR0aFxuXHRcdFx0b3JpZ2luWDogMCwgb3JpZ2luWTogMC41XG5cdFx0XHRwYXJlbnQ6IEBsZWZ0SGFsZldyYXBwZXJcblx0XHRcdGNsaXA6IHllc1xuXHRcdFx0Zm9yY2UyZDogeWVzXG5cdFx0QGxlZnRIYWxmID0gbmV3IExheWVyXG5cdFx0XHRiYWNrZ3JvdW5kQ29sb3I6IG51bGxcblx0XHRcdHg6IC1Ad2lkdGggLyAyXG5cdFx0XHR3aWR0aDogQHdpZHRoLCBoZWlnaHQ6IEB3aWR0aFxuXHRcdFx0Ym9yZGVyUmFkaXVzOiBAd2lkdGggLyAyXG5cdFx0XHRib3JkZXJXaWR0aDogdGhpY2tuZXNzXG5cdFx0XHRib3JkZXJDb2xvcjogY29sb3Jcblx0XHRcdHBhcmVudDogQGxlZnRIYWxmQ2xpcFxuXHRcdFx0Zm9yY2UyZDogeWVzXG5cdFx0XHRcblx0XHQjIFJpZ2h0IGhhbGZcblx0XHRAcmlnaHRIYWxmV3JhcHBlciA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR4OiBAd2lkdGggLyAyXG5cdFx0XHR3aWR0aDogQHdpZHRoIC8gMiwgaGVpZ2h0OiBAd2lkdGhcblx0XHRcdHBhcmVudDogQFxuXHRcdFx0Y2xpcDogeWVzXG5cdFx0XHRmb3JjZTJkOiB5ZXNcblx0XHRAcmlnaHRIYWxmQ2xpcCA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR4OiAtQHdpZHRoIC8gMlxuXHRcdFx0d2lkdGg6IEB3aWR0aCAvIDIsIGhlaWdodDogQHdpZHRoXG5cdFx0XHRvcmlnaW5YOiAxLCBvcmlnaW5ZOiAwLjVcblx0XHRcdHBhcmVudDogQHJpZ2h0SGFsZldyYXBwZXJcblx0XHRcdGNsaXA6IHllc1xuXHRcdFx0Zm9yY2UyZDogeWVzXG5cdFx0QHJpZ2h0SGFsZiA9IG5ldyBMYXllclxuXHRcdFx0YmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0XHR3aWR0aDogQHdpZHRoLCBoZWlnaHQ6IEB3aWR0aFxuXHRcdFx0Ym9yZGVyUmFkaXVzOiBAd2lkdGggLyAyXG5cdFx0XHRib3JkZXJXaWR0aDogdGhpY2tuZXNzXG5cdFx0XHRib3JkZXJDb2xvcjogY29sb3Jcblx0XHRcdHBhcmVudDogQHJpZ2h0SGFsZkNsaXBcblx0XHRcdGZvcmNlMmQ6IHllc1xuXG5cdF92OiAwXHQjIG1pbjogMCwgbWF4OiAxXHRcblx0QGRlZmluZSBcInZhbHVlXCIsXG5cdFx0Z2V0OiAtPiBAX3Zcblx0XHRzZXQ6ICh2KSAtPlxuXHRcdFx0QF92ID0gdlxuXHRcdFx0aWYgdiA8IDAuNVxuXHRcdFx0XHRAcmlnaHRIYWxmQ2xpcC5yb3RhdGlvblogPSAzNjAgKiB2XG5cdFx0XHRcdEBsZWZ0SGFsZkNsaXAucm90YXRpb25aID0gMFxuXHRcdFx0ZWxzZVxuXHRcdFx0XHRAcmlnaHRIYWxmQ2xpcC5yb3RhdGlvblogPSAxODBcblx0XHRcdFx0QGxlZnRIYWxmQ2xpcC5yb3RhdGlvblogPSAzNjAgKiB2IC0gMTgwXG5cbmNsYXNzIGV4cG9ydHMuU3Bpbm5lciBleHRlbmRzIExheWVyXG5cdGNvbG9yczogW1wiI0RCNDQzN1wiLCBcIiM0Mjg1RjRcIiwgXCIjMEY5RDU4XCIsIFwiI0Y0QjQwMFwiXSAjIGRlZmF1bHRcblx0Y29uc3RydWN0b3I6IChAb3B0aW9ucz17fSkgLT5cblx0XHRAb3B0aW9ucy5zaXplID0gNDggdW5sZXNzIEBvcHRpb25zLnNpemVcblx0XHRAb3B0aW9ucy50aGlja25lc3MgPSA0IHVubGVzcyBAb3B0aW9ucy50aGlja25lc3Ncblx0XHRAb3B0aW9ucy5jb2xvciA9IFwiIzQyODVmNFwiIHVubGVzcyBAb3B0aW9ucy5jb2xvclxuXHRcdEBvcHRpb25zLmNoYW5nZUNvbG9yID0geWVzIGlmIHR5cGVvZiBAb3B0aW9ucy5jaGFuZ2VDb2xvciBpcyBcInVuZGVmaW5lZFwiXG5cdFx0XG5cdFx0c3VwZXIgd2lkdGg6IFMoQG9wdGlvbnMuc2l6ZSksIGhlaWdodDogUyhAb3B0aW9ucy5zaXplKSwgYmFja2dyb3VuZENvbG9yOiBudWxsXG5cdFx0QGxpbmUgPSBuZXcgTGluZSBTKEBvcHRpb25zLnNpemUpLCBTKEBvcHRpb25zLnRoaWNrbmVzcyksIEBvcHRpb25zLmNvbG9yXG5cdFx0QGxpbmUucGFyZW50ID0gQFxuXG5cdF9zdGFydGVkOiBmYWxzZVxuXHRzdGFydDogLT5cblx0XHRAcm90YXRpb24gPSBAbGluZS52YWx1ZSA9IDBcblx0XHRAb3BhY2l0eSA9IDFcblx0XHRAX3N0YXJ0ZWQgPSB0cnVlXG5cdFx0QF9hbmltYXRlKClcblx0c3RvcDogLT5cblx0XHRAX3N0YXJ0ZWQgPSBmYWxzZVxuXHRcdEBhbmltYXRlXG5cdFx0XHRwcm9wZXJ0aWVzOiBvcGFjaXR5OiAwXG5cdFx0XHR0aW1lOiAwLjJcblx0XG5cdF9jb3VudGVyOiAwXG5cdF9hbmltYXRlOiAtPlxuXHRcdHJvdGF0ZSA9IG5ldyBBbmltYXRpb25cblx0XHRcdGxheWVyOiBAXG5cdFx0XHRwcm9wZXJ0aWVzOiByb3RhdGlvbjogMzYwXG5cdFx0XHR0aW1lOiAxLjlcblx0XHRcdGN1cnZlOiBcImxpbmVhclwiXG5cdFx0bGluZUluID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6IEBsaW5lXG5cdFx0XHRwcm9wZXJ0aWVzOiB2YWx1ZTogMC43NVxuXHRcdFx0dGltZTogMC42NFxuXHRcdFx0Y3VydmU6IFwiY3ViaWMtYmV6aWVyKDAuNCwgMC4wLCAwLjIsIDEpXCJcblx0XHRsaW5lT3V0ID0gbmV3IEFuaW1hdGlvblxuXHRcdFx0bGF5ZXI6IEBsaW5lXG5cdFx0XHRwcm9wZXJ0aWVzOlxuXHRcdFx0XHR2YWx1ZTogMC4wM1xuXHRcdFx0XHRyb3RhdGlvbjogMzYwXG5cdFx0XHR0aW1lOiAwLjc4XG5cdFx0XHRjdXJ2ZTogXCJjdWJpYy1iZXppZXIoMC40LCAwLjAsIDAuMiwgMSlcIlxuXHRcdFxuXHRcdHJvdGF0ZS5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0QHJvdGF0aW9uID0gMFxuXHRcdFx0cm90YXRlLnN0YXJ0KCkgaWYgQF9zdGFydGVkXG5cdFx0bGluZUluLm9uIEV2ZW50cy5BbmltYXRpb25FbmQsID0+XG5cdFx0XHRsaW5lT3V0LnN0YXJ0KCkgaWYgQF9zdGFydGVkXG5cdFx0bGluZU91dC5vbiBFdmVudHMuQW5pbWF0aW9uRW5kLCA9PlxuXHRcdFx0QGxpbmUucm90YXRpb24gPSAwXG5cdFx0XHRsaW5lSW4uc3RhcnQoKSBpZiBAX3N0YXJ0ZWRcblx0XHRcdFxuXHRcdFx0aWYgQG9wdGlvbnMuY2hhbmdlQ29sb3Jcblx0XHRcdFx0QGxpbmUubGVmdEhhbGYuYW5pbWF0ZVxuXHRcdFx0XHRcdHByb3BlcnRpZXM6IGJvcmRlckNvbG9yOiBAY29sb3JzW0BfY291bnRlcl1cblx0XHRcdFx0XHR0aW1lOiAwLjJcblx0XHRcdFx0XHRjb2xvck1vZGVsOiBcInJnYlwiXG5cdFx0XHRcdEBsaW5lLnJpZ2h0SGFsZi5hbmltYXRlXG5cdFx0XHRcdFx0cHJvcGVydGllczogYm9yZGVyQ29sb3I6IEBjb2xvcnNbQF9jb3VudGVyXVxuXHRcdFx0XHRcdHRpbWU6IDAuMlxuXHRcdFx0XHRcdGNvbG9yTW9kZWw6IFwicmdiXCJcblx0XHRcdFx0QF9jb3VudGVyKytcblx0XHRcdFx0QF9jb3VudGVyID0gMCBpZiBAX2NvdW50ZXIgPj0gQGNvbG9ycy5sZW5ndGhcblx0XHRcblx0XHRyb3RhdGUuc3RhcnQoKVxuXHRcdGxpbmVJbi5zdGFydCgpIiwiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFFQUE7QURBQSxJQUFBLE9BQUE7RUFBQTs7O0FBQUEsQ0FBQSxHQUFJLFNBQUMsQ0FBRDtBQUNILE1BQUE7RUFBQSxLQUFBLEdBQVE7RUFDUixNQUFBLEdBQVMsTUFBTSxDQUFDLE1BQU0sQ0FBQztFQUN2QixJQUFHLE1BQU0sQ0FBQyxLQUFQLENBQWEsQ0FBYixFQUFnQixjQUFjLENBQUMsTUFBL0IsQ0FBQSxLQUEwQyxjQUE3QztJQUNDLEtBQUEsR0FBUSxNQUFNLENBQUMsS0FBUCxHQUFlLElBRHhCO0dBQUEsTUFFSyxJQUFHLE1BQU0sQ0FBQyxLQUFQLENBQWEsQ0FBYixFQUFnQixjQUFjLENBQUMsTUFBL0IsQ0FBQSxLQUEwQyxjQUE3QztJQUNKLEtBQUEsR0FBUSxNQUFNLENBQUMsS0FBUCxHQUFlLElBRG5COztBQUVMLFNBQU8sQ0FBQSxHQUFJO0FBUFI7O0FBU0U7OztFQUNRLGNBQUMsSUFBRCxFQUFPLFNBQVAsRUFBa0IsS0FBbEI7SUFDWixzQ0FB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
