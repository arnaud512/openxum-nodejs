"use strict";

OpenXum.GamePage = function (namespace, n, fc, c, oc, gt, gi, m, u, oi, opi, r) {
// private attributes
    var canvas;
    var canvas_div;
    var engine;
    var gui;
    var manager;
    var opponent;

    var generated_board = null;

// private methods
    var build_buttons = function () {
        var row = $('<div/>', { class: 'row' });
        var col = $('<div/>', { class: 'col-md-6 col-md-offset-3' });

        $('<a/>', { class: 'btn btn-success btn-md active', id: 'status', href: '#', html: 'Ready!' }).appendTo(col);
        $('<a/>', { class: 'btn btn-warning btn-md active', id: 'replay', href: '#', html: 'Replay' }).appendTo(col);
        $('<a/>', { class: 'btn btn-danger btn-md active', id: 'list', href: '#', html: 'Move list',
            'data-toggle': 'modal', 'data-target': '#moveListModal' }).appendTo(col);
        col.appendTo(row);
        row.appendTo($('#main'));
    };

    var build_canvas = function () {
        var row = $('<div/>', { class: 'row' });
        var col = $('<div>', { class: 'col-md-12', id: 'boardDiv' });

        $('<canvas/>', {
            id: 'board',
            style: 'width: 600px; height: 600px; padding-left: 0; padding-right: 0; margin-left: auto; margin-right: auto; display: block; border-radius: 15px; -moz-border-radius: 15px; box-shadow: 8px 8px 2px #aaa;'
        }).appendTo(col);
        col.appendTo(row);
        row.appendTo($('#main'));
    };

    var build_engine = function (namespace, mode, color,name,game_type,color_player) {
        if(name == 'paletto') {
            if(generated_board == null){
                var tmp_engine = new namespace.Engine(mode, color , game_type, null);
                generated_board = tmp_engine.board_to_string();
            }
            engine = new namespace.Engine(mode, color , game_type, generated_board);
        }
        else engine = new namespace.Engine(mode, color);
    };

    var build_gui = function (namespace, color, game_id,game_type) {
        gui = new namespace.Gui(color, engine, game_id === '-1', game_type == 'gui' );
    };

    var build_move_list_modal = function () {
        var modal = $('<div/>', {
            class: 'modal fade',
            id: 'moveListModal',
            tabindex: '-1',
            role: 'dialog',
            'aria-labelledby': 'moveListModal',
            'aria-hidden': 'true'
        });
        var modalDialog = $('<div/>', { class: 'modal-dialog'});
        var modalContent = $('<div/>', { class: 'modal-content'});
        var modalHeader = $('<div/>', { class: 'modal-header'});
        var button = $('<button/>', { class: 'close', 'data-dismiss': 'modal' });
        var modalBody = $('<div/>', { class: 'modal-body', id: 'moveListBody' });

        $('<span/>', { 'aria-hidden': true, html: '&times;' }).appendTo(button);
        $('<span/>', { class: 'sr-only', html: 'Close' }).appendTo(button);
        button.appendTo(modalHeader);
        $('<h4/>', { class: 'modal-title', id: 'moveListModalLabel', html: 'Move list' }).appendTo(modalHeader);
        modalHeader.appendTo(modalContent);
        modalBody.appendTo(modalContent);
        modalContent.appendTo(modalDialog);
        modalDialog.appendTo(modal);
        modal.appendTo($('#main'));
    };

    var build_opponent = function (namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id) {
        if (game_type === 'remote_ai') {
            opponent = new namespace.RestWebServicePlayer(opponent_color, engine, username);
            opponent.set_url('http://127.0.0.1/openxum-ws-php/index.php/');
        } else if (game_type === 'gui') {
            opponent = gui;
        } else if (game_type === 'ai') {
            if (engine.get_possible_move_list) {
                opponent = new OpenXum.MCTSPlayer(opponent_color, engine);
            } else {
                opponent = new namespace.RandomPlayer(opponent_color, engine);
            }
        } else {
            if (username === owner_id) {
                opponent = new namespace.RemotePlayer(opponent_color, engine, owner_id, opponent_id, game_id);
            } else {
                opponent = new namespace.RemotePlayer(color, engine, owner_id, opponent_id, game_id);
            }
        }
    };

    var build_manager = function (namespace) {
        manager = new namespace.Manager(engine, gui, opponent, new OpenXum.Status(document.getElementById("status")));
    };

    var build_winner_modal = function () {
        var modal = $('<div/>', {
            class: 'modal fade',
            id: 'winnerModal',
            tabindex: '-1',
            role: 'dialog',
            'aria-labelledby': 'winnerModalLabel',
            'aria-hidden': 'true'
        });
        var modalDialog = $('<div/>', { class: 'modal-dialog'});
        var modalContent = $('<div/>', { class: 'modal-content'});
        var button = $('<button/>', { class: 'close', 'data-dismiss': 'modal' });
        var modalBody = $('<div/>', { class: 'modal-body', id: 'winnerBodyText' });
        var modalFooter = $('<div/>', { class: 'modal-footer'});

        $('<a/>', {
            class: 'btn btn-primary new-game-button',
            href: '#',
            html: 'New game'}).appendTo($('<div/>', { class: 'btn-group' }).appendTo(modalFooter));
        modalBody.appendTo(modalContent);
        modalFooter.appendTo(modalContent);
        modalContent.appendTo(modalDialog);
        modalDialog.appendTo(modal);
        modal.appendTo($('#main'));
    };

    var set_gui = function () {
        canvas = document.getElementById("board");
        canvas_div = document.getElementById("boardDiv");
        if (canvas_div.clientHeight < canvas_div.clientWidth) {
            canvas.height = canvas_div.clientHeight * 0.95;
            canvas.width = canvas_div.clientHeight * 0.95;
        } else {
            canvas.height = canvas_div.clientWidth * 0.95;
            canvas.width = canvas_div.clientWidth * 0.95;
        }
        gui.set_canvas(canvas);
        gui.set_manager(manager);
    };

    var set_opponent = function (game_id) {
        if (game_id !== '-1') {
            opponent.set_manager(manager);
            opponent.set_gui(gui);
        } else {
            if (opponent !== gui) {
                opponent.set_level(manager.load_level())
            }
            if (opponent.is_remote()) {
                opponent.set_manager(manager);
            }
        }
    };

    var init = function (namespace, name, first_color, color, opponent_color, game_type, game_id, mode, username, owner_id, opponent_id, replay) {
        build_winner_modal();
        build_move_list_modal();
        $('<br/>').appendTo($('#main'));
        build_buttons();
        build_canvas();

        $('#winnerModal .new-game-button').click(function () {
            $('#winnerModal').modal('hide');
            window.location.href = '/games/play/?game=' + name;
        });

        build_engine(namespace, mode, first_color, name,game_type,color);
        build_gui(namespace, color, game_id,game_type);
        build_opponent(namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id);
        build_manager(namespace);
        set_gui();
        set_opponent(game_id);

        if (opponent !== gui && engine.current_color() === opponent.color() && !opponent.is_remote()) {
            manager.play_other(true);
        }
        if (replay === true) {
            opponent.replay_game();
        }
        $("#replay").click(function () {
            var moves = manager.get_moves();
            build_engine(namespace, mode, first_color,name,game_type);
            build_gui(namespace, color, game_id);
            build_opponent(namespace, color, game_type, game_id, opponent_color, username, owner_id, opponent_id);
            build_manager(namespace);
            set_gui();
            set_opponent(game_id);
            manager.replay(moves, true);
        });
        $("#list").click(function () {
            var body = $('#moveListBody');
            var moves = manager.get_moves();
            var list = $('<ol>');

            body.empty();
            moves.split(";").forEach(function (str) {
                if (str !== '') {
                    var item = $('<li>');
                    var move = manager.build_move();

                    move.parse(str);
                    item.html(move.to_string());
                    item.appendTo(list);
                }
            });
            list.appendTo(body);
        });
    };

    init(namespace, n, fc, c, oc, gt, gi, m, u, oi, opi, r);
};