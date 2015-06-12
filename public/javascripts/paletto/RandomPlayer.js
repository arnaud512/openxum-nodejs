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
        var move = null;
        var list = null;
        var x,y;
        if(_engine.phase() === Paletto.Phase.FIRST_TAKE){
            list = _engine.get_possible_taken_list(false);
            var alea = Math.floor(Math.random() * list.length);
            //_engine.select_move(list,alea);


            x = list[alea].x;
            y = list[alea].y;
            move = new Paletto.Move(_engine.current_color(),x,y,_engine.get_piece_color_from_x_y(x,y),0);
        }
        if(_engine.phase()== Paletto.Phase.CONTINUE_TAKING){
            list = _engine.get_possible_taken_list(true);
            if(list.length != 0){
                x = list[0].x;
                y = list[0].y;
                move = new Paletto.Move(_engine.current_color(),x,y,_engine.get_piece_color_from_x_y(x,y),0);
            }
            else{
                move = new Paletto.Move(_engine.current_color(),0,0,0,1);
            }
        }

        return move;
    };

    this.reinit = function (e) {
        _engine = e;
    };

    this.set_level = function () {
    };

    this.set_manager = function () {
    };
};
