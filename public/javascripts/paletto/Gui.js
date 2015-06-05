'use strict';

Paletto.Gui = function (c, e, l) {

// private attributes
    var _engine = e;
    var _color = c;
    var _local = l;

    var _canvas;
    var _context;
    var _manager;

    var _height;
    var _width;
    var _scaleX;
    var _scaleY;

// public methods
// get color of player used GUI
    this.color = function () {
        return _color;
    };

// draw the graphical view of current state of game in canvas
    this.draw = function () {

    };

// return the move that the player has made
    this.get_move = function () {

    };

// return true if when a move is apply, an animation works
    this.is_animate = function () {
        return false;
    };

// the gui is not remote, return always false
    this.is_remote = function () {
        return false;
    };

// apply a move and animate
// if no animation, call manager.play
    this.move = function (move, color) {
        manager.play();
    };

// ready is called when opponent is present (online case)
    this.ready = function (r) {
        opponentPresent = r;
        if (manager) {
            manager.redraw();
        }
    };

// set the canvas, the event listener and scales
    this.set_canvas = function (c) {
        _canvas = c;
        _context = c.getContext("2d");
        _height = _canvas.height;
        _width = _canvas.width;
        _scaleX = _height / _canvas.offsetHeight;
        _scaleY = _width / _canvas.offsetWidth;
        _canvas.addEventListener("click", onClick);
        this.draw();
    };

// set the manager
    this.set_manager = function (m) {
        _manager = m;
    };

// reset the informations of previous move
    this.unselect = function () {

    };

// private methods
// compute the coordinates in canvas coordinates system
    var getClickPosition = function (e) {
        var rect = _canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * _scaleX, y: (e.clientY - rect.top) * _scaleY };
    };

// initialize the state of game
    var init = function () {

    };

// if interaction is click action, verify if the phase of engine is equal to YYYY (a phase of game)
// and differents interactions are realized
    var onClick = function (event) {
        var pos = getClickPosition(event);


        if (_engine.phase() === Paletto.Phase.TAKE_PIECES) {
            _manager.play();
        }
    };

// call init method
    init();
};