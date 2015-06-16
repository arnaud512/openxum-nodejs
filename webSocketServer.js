var wss = require('websocket').server;

exports.Server = function (app) {

    this.init = function (app) {
        this.server = new wss({
            httpServer: app.server
        });
        clients = { };
        playingClients = { };
        currentGames = { };
    };

    this.processRequest = function (request) {
        var connection = request.accept(null, request.origin);

        connection.on('message', function (message) {
            onMessage(connection, message);
        });

        connection.on('close', function (connection) {
            onDisconnect(request.socket._peername.port);
        });
    };

    var onConnect = function (connection, msg) {
        clients[msg.user_id] = connection;
        sendConnectedClients();
    };

    var onDisconnect = function (port) {
        var index;
        var found = false;

        for (index in clients) {
            if (clients[index] && clients[index].socket._peername.port === port) {
                found = true;
                break;
            }
        }
        if (found) {
            delete clients[index];
            sendConnectedClients();
        }
        if (!found) {
            for (index in playingClients) {
                if (playingClients[index] && playingClients[index].socket._peername.port === port) {
                    found = true;
                    break;
                }
            }
            if (found) {
                var response = { type: 'disconnect' };

                if (currentGames[index].opponent_id in playingClients) {
                    playingClients[currentGames[index].opponent_id].send(JSON.stringify(response));
                }
                delete playingClients[index];
                delete currentGames[index];
                sendConnectedClients();
            }
        }
    };

    var onConfirm = function (msg) {
        app.db.models.GameHisto.create({ gameId: msg.game_id }, function (err, numAffected) {
            app.db.models.Game.update({ _id: msg.game_id }, { status: 'run', 'opponent.id': msg.opponent_id }, { }, function (err, numAffected) {
                app.db.models.Game.findOne({ _id: msg.game_id }, null,
                    { safe: true }, function (err, game) {
                        app.db.models.User.findOne({ _id: msg.opponent_id }, null,
                            { safe: true }, function (err, user) {
                                var c_opponent = clients[user.username];

                                app.db.models.User.findOne({ _id: msg.owner_id }, null,
                                    { safe: true }, function (err, user2) {
                                        var c_owner = clients[user2.username];
                                        var response = {
                                            type: 'confirm',
                                            game_id: msg.game_id,
                                            owner_id: user2.username,
                                            opponent_id: user.username,
                                            color: game.color,
                                            mode: game.mode,
                                            type_of_game: msg.type_of_game
                                        };
                                        if (msg.type_of_game !== 'offline') {
                                            c_owner.send(JSON.stringify(response));
                                        }
                                        if (c_opponent) {
                                            c_opponent.send(JSON.stringify(response));
                                        }
                                    });
                            });
                    });
            });
        });
    };

    var onFinish = function (msg) {
        if (msg.user_id in currentGames) {
            var game_id = currentGames[msg.user_id].game_id;

            app.db.models.Game.findOne({ _id: game_id }, null,
                { safe: true }, function (err, game) {
                    delete playingClients[msg.user_id];
                    delete currentGames[msg.user_id];
                    if (game) {
                        // on ajoute le jeu à la collection GameHisto - attention le nom n'est pas unique
                        app.db.models.User.findOne({ username: msg.user_id }, null,
                            { safe: true }, function (err, userinfo) {
                                var fieldsToSet = {
                                    name: game.name,
                                    game: game.game,
                                    userCreated: { id: game.userCreated.id },
                                    opponent: { id: game.opponent.id },
                                    winner: { id: userinfo._id },
                                    moves: msg.moves,
                                    status: 'finished'
                                };
                                app.db.models.GameHisto.create(fieldsToSet, function (err, user) {
                                });
                            });
                        game.remove(function (err) {
                        });
                    }
                });
        }
    };

    var onJoin = function (msg) {
        app.db.models.Game.findOne({ _id: msg.game_id }, null,
            { safe: true }, function (err, game) {
                app.db.models.User.findOne({ _id: msg.opponent_id }, null,
                    { safe: true }, function (err, user) {
                        var owner_id = game.userCreated.id;
                        var c_opponent = clients[user.username];

                        if (c_opponent) {
                            app.db.models.User.findOne({ _id: owner_id }, null,
                                { safe: true }, function (err, user2) {
                                    var c_owner = clients[user2.username];
                                    var response = {
                                        type: 'join',
                                        game_id: msg.game_id,
                                        owner_id: owner_id,
                                        owner_name: user2.username,
                                        opponent_id: msg.opponent_id,
                                        opponent_name: user.username
                                    };
                                    if (c_owner) {
                                        c_opponent.send(JSON.stringify(response));
                                        c_owner.send(JSON.stringify(response));
                                    }
                                });
                        }
                    });
            });
    };

    var onMessage = function (connection, message) {
        var msg = JSON.parse(message.utf8Data);

        if (msg.type === 'connect') {
            onConnect(connection, msg);
        } else if (msg.type === 'join') {
            onJoin(msg);
        } else if (msg.type === 'confirm') {
            onConfirm(msg);
        } else if (msg.type === 'play') {
            onPlay(connection, msg);
        } else if (msg.type === 'turn') {
            onTurn(msg);
        } else if (msg.type === 'finish') {
            onFinish(msg);
        } else if (msg.type === 'info') {
            onConnect(connection, msg);
        } else if (msg.type === 'replay') {
            onReplay(connection, msg);
        }
    };

    var onPlay = function (connection, msg) {
        playingClients[msg.user_id] = connection;
        currentGames[msg.user_id] = {
            game_id: msg.game_id,
            game_type: msg.game_type,
            opponent_id: msg.opponent_id
        };

        var response = null;
        if(msg.hasOwnProperty('game_board')){
            response = { type: 'start' , game_board: msg.game_board};
        }
        else{
            response = { type: 'start'};
        }

        if (msg.opponent_id in playingClients) {
            playingClients[msg.user_id].send(JSON.stringify(response));
            playingClients[msg.opponent_id].send(JSON.stringify(response));
        }
        if (msg.type_of_game === 'offline') {
            playingClients[msg.user_id].send(JSON.stringify(response));

        }
    };

    var onTurn = function (msg) {
        var c_opponent = playingClients[currentGames[msg.user_id].opponent_id];
        var response = { };
        var game_type = currentGames[msg.user_id].game_type;

        response = msg;
        app.db.models.GameHisto.findOne({ gameId: msg.game_id }, null, function (err, GH) {
            app.db.models.GameHisto.update({ gameId: msg.game_id }, { moves: GH.moves + ';' + msg.move }, function (err, numAffected) {
                app.db.models.Game.update({ _id: msg.game_id }, { currentColor: msg.next_color }, function (err, numAffected) {
                    if (c_opponent) {
                        c_opponent.send(JSON.stringify(response));
                    }
                });
            });
        });
    };

    var sendConnectedClients = function () {
        if (clients['root']) {
            var users = [ ];

            for (var id in clients) {
                if (clients[id]) {
                    if (currentGames[id] != undefined) {
                        users.push({ id: id, status: 'play' });
                    } else {
                        users.push({ id: id, status: 'wait' });
                    }
                }
            }

            var response = {
                type: 'connected',
                users: users
            };

            clients['root'].send(JSON.stringify(response));
        }
    };

//    var turn_indice = 0;

    var onReplay = function (connection, msg) {
//        var turn_indice = 0;
//        var colors = {0: 'black', 1: 'white'};

        app.db.models.GameHisto.findOne({ gameId: msg.game_id }, null, function (err, turns) {
            var response = {
                type: 'replay',
                moves: turns.moves
            };

            connection.send(JSON.stringify(response));
        });
    };

    var clients;
    var playingClients;
    var currentGames;

    this.init(app);
}