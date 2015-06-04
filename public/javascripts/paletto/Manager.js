"use strict";

Paletto.Manager = function (e, g, o, s) {
// private attributes
    var _super = new OpenXum.Manager(e, g, o, s);

// public methods
    this.engine = _super.engine;
    this.get_moves = _super.get_moves;
    this.load_level = _super.load_level;
    this.next = _super.next;
    this.play = _super.play;
    this.play_other = _super.play_other;
    this.play_remote = _super.play_remote;
    this.ready = _super.ready;
    this.redraw = _super.redraw;
    this.replay = _super.replay;

    this.build_move = function () {
        return new Paletto.Move();
    };

    this.get_current_color = function () {
        return _super.engine().current_color() === Paletto.Color.JOUEUR_1 ? 'Joueur 1' : 'Joueur 2';
    };

    this.get_name = function () {
        return 'paletto';
    };

    this.get_winner_color = function () {
        return _super.engine().winner_is() === Paletto.Color.JOUEUR_1 ? 'Joueur 1' : 'Joueur 2';
    };

    this.process_move = function () {
    };

    _super.that(this);
};