"use strict";

Paletto.RandomPlayer = function (c, e) {
// private attributes
    var _color = c;
    var _engine = e;

// public methods
    this.color = function () {
        return _color;
    };

    this.confirm = function() {
        return false;
    };

    this.is_remote = function () {
        return false;
    };

    this.move = function () {
        // ...
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function () {
    };

    this.set_manager = function () {
    };
};
