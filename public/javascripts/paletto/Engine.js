'use strict';

Paletto.Color = { JOUEUR_1: 0, JOUEUR_2: 1 };
Paletto.PieceColor = {black : 0, white : 1, red : 2, green : 3, blue : 4, yellow : 5};
Paletto.Phase = { TAKE_PIECES: 0, FINISH: 1 };
// TODO : if player want to end turn after take a less 1 pieces => Phase = FINISH


Paletto.Move = function (c) {

    // private attributes
    var _color; // player
    var _from_x; // where player take piece
    var _from_y;
    var _piece_color; // color player take

    // private methods
    // init method is called when an instance is created
    var init = function (color, from_x, from_y, piece_color) {
        _color = color;
        _from_x = from_x;
        _from_y = from_y;
        _piece_color = piece_color;
    };

    // public methods
    // methods to access of private attributes
    this.color = function (){
        return _color;
    };

    this.from_x = function(){
        return _from_x;
    };

    this.from_y = function(){
        return _from_y;
    };

    this.piece_color = function(){
        return _piece_color;
    };


    // methods to build (or parse) the textual representation of a move
    this.get = function () {
        return (_color === Paletto.Color.JOUEUR_1 ? 'P1' : 'P2') + _piece_color +  _from_x + _from_y ;
    };

    this.parse = function (str) {
        _color = str.charAt(0) === 'B' ? Paletto.Color.JOUEUR_1 : Paletto.Color.JOUEUR_2;
        _piece_color = str.charAt(1);
        _from_x = str.charAt(2);
        _from_y = str.charAt(3);

    };

    // build an object representation with all public attributes
    this.to_object = function () {
        return { color: _color, from_x: _from_x, from_y : _from_y , piece_color: _piece_color};
    };

    // build a string with a sentence describe the move
    this.to_string = function () {
        return _color + ' take color ' + _piece_color + 'from (' + _from_x + ',' + _from_y + ')';
    };

    // call init method
    init(c,f,p);
};




Paletto.Engine = function (t, c) {

//***************
// private attributes
// the variable phase indicated the phase of game : PUT_PIECE, REMOVE_ROW, by example
// this variable is used by manager
    var _phase;
// all attributes of game
    var type;
    var color;

    var game_board;
    var player_1_pieces;
    var player_2_pieces;

//private method
    var initialize_board = function (){
        //initialize player piece
        player_1_pieces = new Array(6);
        player_2_pieces = new Array(6);
        for(var i = 0; i < 6; i++){
            player_1_pieces[i]=0;
            player_2_pieces[i]=0;
        }

        // initialize game_board with random color (for now)
        // TODO : initialize with paletto rules
        game_board = new Array(6);
        for(var x = 0; x < 6; x++){
            game_board[x]= new Array(6);
            for(var y = 0; y < 6 ; y++){
                game_board[x][y] = Math.floor(Math.random() * 7);
            }
        }
    };



//***************
// public methods
// play a move (the move is an instance of XXX.Move class)
    this.move = function (move) {
        this.put_piece_to_player(move.from_x(),move.from_y(),move.piece_color(),move.color());
    };

    this.put_piece_to_player = function(from_x,from_y,piece_color,color){
        game_board[from_x][from_y]= -1;
        if(color === Paletto.Color.JOUEUR_1){
            player_1_pieces[piece_color]++;
        }
    };

// get the color of current player
    this.current_color = function () {
        return color;
    };

// get the phase of game
    this.phase = function() {
        return _phase;
    };

// verify if game is finished
    this.is_finished = function () {
        // if last piece
        var cpt = 0;
        for(var x = 0; x < 6; x++){
            for(var y = 0; y < 6 ; y++){
                if(game_board[x][y]!=-1) cpt++;
            }
        }
        if(cpt == 0) return true;

        // if one player have the set of color
        for(var i = 0; i < 6; i++){
            if(player_1_pieces[i]==6) return true;
            if(player_2_pieces[i]==6) return true;
        }

    };

// return the color of winner if game is finished
    this.winner_is = function () {
        if(this.is_finished()){
            return color;
        }
    };

//***************
// two methods to clone an engine
// mainly method: create a new object and set all attributes (values are passed as parameters)
    this.clone = function () {
        var o = new Paletto.Engine(type, color);

        o.set(_phase,game_board,player_1_pieces,player_2_pieces);
        return o;
    };

// set all attributes using parameter values
// warning to attributes of object or array type
    this.set = function (p,gb,p1p,p2p) {
        _phase = p;

        // clone game_board
        for(var x = 0; x < 6; x++){
            for(var y = 0; y < 6 ; y++){
                game_board[x][y]=gb[x][y];
            }
        }

        // clone player pieces
        for(var i = 0; i < 6; i++){
            player_1_pieces[i]=p1p[i];
            player_2_pieces[i]=p2p[i];
        }

    };

//***************
// methods for MCTS Artificial Intelligence
// return the list of possible moves
    this.get_possible_move_list = function () {
    };

// get the number of possible moves in current list
    this.get_possible_move_number = function(list) {
    };

// remove first move in possible move list
    this.remove_first_possible_move = function(list) {
    };

// select a move in list with specified index
    this.select_move = function (list, index) {
    };

//***************
// init method is called when an instance is created
    var init = function(t, c) {
        type  = t;
        color = c;

        initialize_board();

    };

// call init method with two parameters: t, the type of game and c, the color of first player
    init(t, c);
};