'use strict';

exports.init = function (req, res) {
    if (req.user) {
        if (req.param('game_id') !== '-1') {
            res.render('games/play/paletto/index',
                { game_id: req.param('game_id'),
                    owner_id: req.param('owner_id'),
                    opponent_id: req.param('opponent_id'),
                    color: req.param('color') === 'player_1' ? 0 : 1,
                    mode: req.param('mode') === 'standard' ? 0 : 1,
                    game_type: req.param('game_type'),
                    opponent_color: req.param('color') === 'player_1' ? 1 : 0,
                    replay: req.param('replay') ? req.param('replay') : false
                });
        } else {
            res.render('games/play/paletto/index',
                { game_id: -1,
                    owner_id: -1,
                    opponent_id: -1,
                    color: req.param('color') === 'player_1' ? 0 : 1,
                    mode: req.param('mode') === 'standard' ? 0 : 1,
                    game_type: req.param('game_type'),
                    opponent_color: req.param('color') === 'player_1' ? 1 : 0,
                    replay: false
                });
        }
    } else {
        res.redirect('/');
    }
};