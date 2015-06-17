"use strict";

OpenXum.RemotePlayer = function (c, e, u, o, g) {
// private attributes
    var _that;
    var _color = c;
    var _uid = u;
    var _gameID = g;
    var _opponentID = o;
    var _manager;
    var _connection;

// private methods
    var init = function () {
        _connection = new WebSocket('ws://127.0.0.1:3000');

        _connection.onopen = function () {
        };
        _connection.onerror = function (error) {
        };
        _connection.onmessage = function (message) {
            var msg = JSON.parse(message.data);
            var move;
            if (msg.type === 'start') {
                if(msg.hasOwnProperty('game_board')) _manager.engine().board_parse(msg.game_board);
                _manager.ready(true);
            } else if (msg.type === 'disconnect') {
                _manager.ready(false);
            } else if (msg.type === 'turn') {
                move = _that.build_move();
                move.parse(msg.move);
                _manager.play_remote(move);
            } else if (msg.type === 'replay') {
                _manager.replay(msg.moves);
            }
        };

        var loop = setInterval(function () {
            if (_connection.readyState !== 1) {
                console.log('error connection');
            } else {
                console.log('connecting ' + _uid + ' ...');
                var msg = null;
                if(_that.get_name() == 'paletto'){
                    msg = {
                        type: 'play',
                        user_id: _uid,
                        opponent_id: _opponentID,
                        game_id: _gameID,
                        game_type: _that.get_name(),
                        game_board: _manager.engine().board_to_string()
                    };
                }
                else{
                    msg = {
                        type: 'play',
                        user_id: _uid,
                        opponent_id: _opponentID,
                        game_id: _gameID,
                        game_type: _that.get_name()
                    };
                }


                _connection.send(JSON.stringify(msg));
                clearInterval(loop);
            }
        }, 1000);
    };

// public methods
    this.color = function () {
        return _color;
    };

    this.confirm = function () {
        return false;
    };

    this.finish = function (moves) {
        var msg = {
            type: 'finish',
            user_id: _uid,
            moves: moves
        };
        _connection.send(JSON.stringify(msg));
    };

    this.is_ready = function () {
        return true;
    };

    this.is_remote = function () {
        return true;
    };

    this.move = function (move) {
        if (move) {
            var msg = {
                game_id: _gameID,
                type: 'turn',
                user_id: _uid,
                move: move.get(),
                next_color: _manager.engine().current_color_string()
            };
            _connection.send(JSON.stringify(msg));
        }
    };

    this.replay_game = function () {
        var send_replay = setInterval(function () {
            if (_connection.readyState === 1) {
                var msg = {
                    type: 'replay',
                    game_id: _gameID,
                    user_id: _uid
                };

                _connection.send(JSON.stringify(msg));
                clearInterval(send_replay);
            }
        }, 100);
    };

    this.set_gui = function () {
    };

    this.set_manager = function (m) {
        _manager = m;
    };

    this.that = function (t) {
        _that = t;
    };

    init();
};
