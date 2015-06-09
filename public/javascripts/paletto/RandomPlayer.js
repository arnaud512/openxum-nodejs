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
        //var move = null;
        if(_engine.phase() === Paletto.Phase.TAKE_PIECES){
            var list = _engine.get_possible_taken_list();

            var alea = Math.floor(Math.random() * list.length);
            _engine.select_move(list,alea);
        }
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function () {
    };

    this.set_manager = function () {
    };
};
