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

    var _deltaX;
    var _deltaY;
    var _offsetX;
    var _offsetY;

// public methods
// get color of player used GUI
    this.color = function () {
        return _color;
    };

// draw the graphical view of current state of game in canvas
    this.draw = function () {
        // fond
        _context.lineWidth = 10;
        _context.strokeStyle = "#757D75";
        _context.fillStyle = "#ffffff";
        // cadre
        roundRect(0, 0, _canvas.width, _canvas.height, 17, true, true);
        _context.stroke();
        draw_grid_left();
        draw_grid_right();
        draw_grid_center();
    };
    var roundRect = function (x, y, width, height, radius, fill, stroke) {
        if (typeof stroke === "undefined") {
            stroke = true;
        }
        if (typeof radius === "undefined") {
            radius = 5;
        }
        _context.beginPath();
        _context.moveTo(x + radius, y);
        _context.lineTo(x + width - radius, y);
        _context.quadraticCurveTo(x + width, y, x + width, y + radius);
        _context.lineTo(x + width, y + height - radius);
        _context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        _context.lineTo(x + radius, y + height);
        _context.quadraticCurveTo(x, y + height, x, y + height - radius);
        _context.lineTo(x, y + radius);
        _context.quadraticCurveTo(x, y, x + radius, y);
        _context.closePath();
        if (stroke) {
            _context.stroke();
        }
        if (fill) {
            _context.fill();
        }
    };
    // plateau central
    var draw_grid_center = function () {
        var i, j;
        var tmp_piece_color;
        // case
        for (i = 0; i < 6; ++i) {
            for (j = 0; j < 6; ++j) {
               tmp_piece_color= _engine.get_piece_color_from_x_y(i,j);
                draw_hole(_offsetX + (i + 0.5) * _deltaX, _offsetY + (j -0.2) * _deltaY, _deltaX / 2.5);
                draw_piece_colored(_offsetX + (i + 0.5) * _deltaX, _offsetY + (j -0.2) * _deltaY, _deltaX / 1.8, tmp_piece_color);

            }
        }
    };
    // pièce bas gauche
    var draw_grid_left = function () {
        var i, j, cpt =0;
        var decalage= 0, deca=0;
        // case
        for (i = 0; i < 3; ++i) {
            for (j = 0; j < 2; ++j) {
                if(j == 1) decalage = 0.4;
                else decalage =0;
                if (i ==1) deca = 0.3;
                else deca = 0;
                if (i==2) deca = 0.6;
                draw_piece_colored(_offsetX + (i -0.3+ decalage-deca) * _deltaX, _offsetY + (j +5.8- decalage ) * _deltaY, _deltaX / 1.8, cpt);

                cpt++;
            }
        }


    };
    //piece bas droit
    var draw_grid_right = function () {
        var i, j, cpt =5;
        var decalage= 0, deca= 0, deca2 = 0;
        var x = 0;

        // case
        for (i = 0; i < 3; ++i) {
            for (j = 0; j < 2; ++j) {
                if(j == 0) decalage = 0.4;
                else decalage =0;
                if (j==1) deca2 = 0.4;
                else deca2=0;
                if (i ==1) deca = 0.3;
                else deca = 0;
                if (i==2) deca = 0.6;

                x = cpt;
                if (j==0) x--;
                else x ++;
                draw_piece_colored(_offsetX + (i +4.5+ decalage-deca) * _deltaX, _offsetY + (j +5.8- deca2 ) * _deltaY, _deltaX / 1.8, x);

                cpt--;
            }

        }


    };

    // trou
    var draw_hole = function (x, y, width) {
        var gr = _context.createRadialGradient(x, y, width / 10, x, y, width);

        _context.beginPath();
        gr.addColorStop(1, '#bfbfbf');
        gr.addColorStop(0, '#757D75');
        _context.fillStyle = gr;
        _context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
        _context.closePath();
        _context.fill();
    };
    //piece
    var draw_piece_colored = function (x, y, width, nb_color) {
        var gr = _context.createRadialGradient(x, y, width / 3, x, y, width);
        _context.lineWidth = 1;
        _context.strokeStyle = "#757D75";
        _context.beginPath();
        switch(nb_color){
            case 0:
                gr.addColorStop(1, '#000000');
                gr.addColorStop(1, '#c0c0c0');
                break;
            case 1:
                gr.addColorStop(1, '#ffffff');
                gr.addColorStop(1, '#c0c0c0');
                break;
            case 2:
                gr.addColorStop(1, '#ff0000');
                gr.addColorStop(1, '#c0c0c0');
                break;
            case 3:
                gr.addColorStop(1, '#00ff00');
                gr.addColorStop(1, '#c0c0c0');
                break;
            case 4:
                gr.addColorStop(1, '#0000ff');
                gr.addColorStop(1, '#c0c0c0');
                break;
            default:
                gr.addColorStop(1, '#ffff00');
                gr.addColorStop(1, '#c0c0c0');

        }
        _context.fillStyle = gr;
        _context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
        _context.closePath();
        _context.fill();
        _context.stroke();

    };
    //Engine.get_piece_color_from_x_y();


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
        //manager.play();
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

        _deltaX = (_width * 0.95 - 40) / 7;
        _deltaY = (_height* 0.95 - 40) / 7;
        _offsetX = _width / 2 - _deltaX * 3;
        _offsetY = _height / 2 - _deltaY * 3;

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
          //  _manager.play();
        }
    };

// call init method
    init();
};

// #757D75