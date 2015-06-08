"use strict";

Paletto.RemotePlayer = function (c, e, u, o, g) {
// private attributes
    var _super = new OpenXum.RemotePlayer(c, e, u, o, g);

// public methods
    this.color = _super.color;
    this.confirm = _super.confirm;
    this.finish = _super.finish;
    this.is_ready = _super.is_ready;
    this.is_remote = _super.is_remote;
    this.move = _super.move;
    this.replay_game = _super.replay_game;
    this.set_gui = _super.set_gui;
    this.set_manager = _super.set_manager;

    this.build_move = function () {
        return new Paletto.Move();
    };

    this.get_name = function () {
        return 'paletto';
    };

    _super.that(this);
};