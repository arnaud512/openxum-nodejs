'use strict';

Paletto.Gui = function (c, e, l, g) {

    // private attributes
    var _engine;
    var _color;
    var _local;
    var _gui;

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

    var _x_pos = null;
    var _y_pos = null;
    var _color_pos = null;
    var _button_hover=false;
    var _button_clicked = false;
    var _color_piece_played = null;

    // public methods
    // get color of player used GUI
    this.color = function () {
        return _color;
    };

    // draw the graphical view of current state of game in canvas
    this.draw = function () {
        // fond
        _context.clearRect(0,0,_canvas.width,_canvas.height);

        _context.lineWidth = 10;
        //cadre
        //draw_rec();
        _context.strokeStyle = "#757D75";
        roundRect(0, 0, _canvas.width, _canvas.height, 17, false, true);

        draw_grid_left();
        draw_grid_right();
        draw_grid_center();
        draw_button();

        //console.log("x: " + _x_pos + "y: " + _y_pos);

        //draw_possible_piece();

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
        if (fill) {
            _context.fill();
        }
        if (stroke) {
            _context.stroke();
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
                draw_hole(_offsetX + (i + 0.5) * _deltaX, _offsetY + (j -0.2) * _deltaY-9, _deltaX / 2.5);
                draw_piece_colored(_offsetX + (i + 0.5) * _deltaX, _offsetY + (j -0.2) * _deltaY-9, _deltaX / 1.8, tmp_piece_color);
            }
        }
        // Ligne
        _context.lineWidth = 5;
        _context.strokeStyle = "#757D75";
        _context.beginPath();
        _context.moveTo(_offsetX - 67, _offsetY +380);
        _context.lineTo(_offsetX + 6 * _deltaX + 67, _offsetY +380);
        _context.moveTo(_offsetX - 67, _offsetY +380);
        _context.closePath();
        _context.fill();
        _context.stroke();
    };
    // piece bas gauche
    var draw_grid_left = function () {
        var i, j, cpt = 0;
        var decalage = 0, deca = 0, decalage2;
        // case
        for (i = 0; i < 3; ++i) {
            for (j = 0; j < 2; ++j) {
                if (j == 1) decalage = 0.34;
                else decalage = 0;
                if (j == 1) decalage2 = 0.4;
                else decalage2 = 0;
                if (i == 1) deca = 0.3;
                else deca = 0;
                if (i == 2) deca = 0.6;
                draw_piece_colored(_offsetX + (i - 0.4 + decalage - deca) * _deltaX, _offsetY + (j + 5.82 - decalage2 ) * _deltaY, _deltaX / 1.8, cpt);

                // Aficher le nb de piece
                var tmp = _engine.get_taken_color(Paletto.Color.JOUEUR_1, cpt);
                _context.fillStyle = "#989898";
                _context.font="26px Verdana";
                _context.lineWidth = 3.2;
                _context.strokeStyle = "#757D75";
                _context.beginPath();
                _context.strokeText(tmp,_offsetX + (i -0.484+ decalage-deca) * _deltaX,_offsetY + (j +5.93- decalage2 ) * _deltaY);
                _context.closePath();
                _context.fill();
                _context.stroke();

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
                if(j == 0) decalage = 0.34;
                else decalage =0;
                if (j==1) deca2 = 0.4;
                else deca2=0;
                if (i ==1) deca = 0.3;
                else deca = 0;
                if (i==2) deca = 0.6;

                x = cpt;
                if (j==0) x--;
                else x ++;
                draw_piece_colored(_offsetX + (i +4.67+ decalage-deca) * _deltaX, _offsetY + (j +5.82- deca2 ) * _deltaY, _deltaX / 1.8, x);


                // Aficher le nb de piece
                var tmp = _engine.get_taken_color(Paletto.Color.JOUEUR_2, x);
                _context.fillStyle = "#989898";
                _context.font="26px Verdana";
                _context.lineWidth = 3.2;
                _context.strokeStyle = "#757D75";
                _context.beginPath();
                _context.strokeText(tmp,_offsetX + (i +4.58+ decalage-deca) * _deltaX, _offsetY + (j +5.925- deca2 ) * _deltaY, _deltaX / 1.8);
                _context.closePath();
                _context.fill();
                _context.stroke();


                cpt--;
            }

        }


    };
    // design gris en bas
    var draw_rec = function () {
        var position_1 =-68 ;
        var position_2 =498 ;
        _context.lineWidth = 1;
        _context.fillStyle = "#dfdfdf";
        _context.strokeStyle = "#757D75";
        _context.fill();

        _context.beginPath();
        _context.moveTo(_offsetX + position_1, _offsetY +380);
        _context.lineTo(_offsetX + position_2, _offsetY +380);

        _context.lineTo(_offsetX + position_2, _offsetY +498);

        _context.lineTo(_offsetX + position_1, _offsetY +498);

        _context.lineTo(_offsetX + position_1, _offsetY +380);


        _context.moveTo(_offsetX + position_1, _offsetY +380);

        _context.closePath();
        _context.fill();
        _context.stroke();

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

    // piece selectionne
    var draw_piece_selected = function (x, y, width){
        var gr = _context.createRadialGradient(x, y, width / 10, x, y, width);
        _context.beginPath();
        _context.fillStyle = "#ffffff";
        _context.strokeStyle = "#757D75";
        _context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
        _context.closePath();
        _context.fill();
        _context.stroke();
    };

    //piece
    var draw_piece_colored = function (x, y, width, nb_color) {
        var gr = _context.createRadialGradient(x, y, width / 3, x, y, width);
        if (nb_color != -1) {
            _context.lineWidth = 1;
            _context.strokeStyle = "#757D75";
            _context.beginPath();
            switch (nb_color) {
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
                case 5:
                    gr.addColorStop(1, '#ffff00');
                    gr.addColorStop(1, '#c0c0c0');
                    break;
                default:
                    break;

            }
            _context.stroke();
        }
        _context.fillStyle = gr;
        _context.arc(x, y, width / 2, 0.0, 2 * Math.PI, false);
        _context.closePath();
        _context.fill();
        if (nb_color != -1)_context.stroke();

    };
    // bouton
    var draw_button= function () {
        var position_1 =94 ;
        var position_2 =336 ;
        _context.lineWidth = 1;
        _context.strokeStyle = "#757D75";
        _context.fillStyle = "#757D75";

        _context.beginPath();
        _context.moveTo(_offsetX + position_1, _offsetY +380);
        _context.lineTo(_offsetX + position_2, _offsetY +380);

        _context.lineTo(_offsetX + position_2 - 70, _offsetY +498);

        _context.lineTo(_offsetX + position_1 + 70, _offsetY +498);

        _context.lineTo(_offsetX + position_1, _offsetY +380);


        _context.moveTo(_offsetX + position_1, _offsetY +380);

        _context.closePath();
        _context.fill();
        _context.stroke();

        if (_engine.phase() == Paletto.Phase.CONTINUE_TAKING) {
            if (_button_hover)_context.fillStyle = "#F7FF3C";
            else _context.fillStyle = "#989898";
            _context.font = "30px Verdana";
            _context.beginPath();
            _context.fillText("Next", 255, 510);
            _context.closePath();
            _context.fill();
        }
    };



    var get_pieces_position = function(x,y){
        if(point_in_rectangle(x, y, _offsetX + 94, _offsetY +380, _offsetX + 336, _offsetY +380, _offsetX + 336 - 70,_offsetY +498, _offsetX + 94 + 70,_offsetY +498 ) == true){
            return {x:-1, y:-1};
        }
        for (var i = 0; i < 6; ++i) {
            for (var j = 0; j < 6; ++j) {
                var tmp = point_in_circle(x, y, _offsetX + (i + 0.5) * _deltaX, _offsetY + (j - 0.2) * _deltaY - 9, (_deltaX / 1.8) / 2);
                if(tmp) return {x:i,y:j};
            }
        }
        return null;
    };


    var onMove = function (event) {
        if (_engine.current_color()=== _color || _gui){
            var pos = getClickPosition(event);
            var xy = get_pieces_position(pos.x,pos.y);
            if(xy) {
                if(xy.x == -1 && xy.y == -1){
                    _button_hover = true;
                    _manager.redraw();
                }
                else if (_engine.get_piece_color_from_x_y(xy.x, xy.y) != -1) {
                        draw_piece_selected(_offsetX + (xy.x + 0.5) * _deltaX, _offsetY + (xy.y - 0.2) * _deltaY - 9, _deltaX / 5);
                }


            }
            else {
                _button_hover = false;
                _manager.redraw();
            }
        }
    };

    // x,y is the point to test
    // cx, cy is circle center, and radius is circle radius
    var point_in_circle = function(x, y, cx, cy, radius) {
        var distancesquared = (x - cx) * (x - cx) + (y - cy) * (y - cy);
        return distancesquared <= radius * radius;
    };

    // souris dans rectangle
    var point_in_rectangle = function(x, y, x1, y1, x2, y2, x3, y3, x4, y4) {
        var rectangle = false, triangle_left = false, triangle_right = false;

        var b1 = calc_tri_rea(x, y, x1, y1, x4, y1)<0;
        var b2 = calc_tri_rea(x, y, x4, y1, x4, y4)<0;
        var b3 = calc_tri_rea(x, y, x4, y4, x1, y1)<0;

        var a1 = calc_tri_rea(x, y, x3, y2, x2, y2)<0;
        var a2 = calc_tri_rea(x, y, x2, y2, x3, y3)<0;
        var a3 = calc_tri_rea(x, y, x3, y3, x3, y2)<0;

        if ((x> x4 && x<x3) && (y>y1 &&y<y3)) rectangle = true;

        if ((a1 == a2) && (a2 == a3)) triangle_right = true;
        if ((b1 == b2) && (b2 == b3)) triangle_left = true;
        return (triangle_left|| rectangle || triangle_right);
    };

    var calc_tri_rea = function(x1, y1, x2, y2, x3, y3){
        return ((x1 - x3) * (y2 - y3)) - ((x2 - x3) * (y1 - y3));
    }

    // _offsetX + 6 * _deltaX -10
    // return the move that the player has made
    this.get_move = function () {
        if(_button_clicked){
            _button_clicked = false;
            return new Paletto.Move(_engine.current_color(),0,0,0,true);
        }
        console.log('ee');
        return new Paletto.Move(_engine.current_color(),_x_pos,_y_pos, _color_pos,false);
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
        //_manager.play();
    };

    // ready is called when opponent is present (online case)
    this.ready = function (r) {
        var opponentPresent = r;
        if (_manager) {
            _manager.redraw();
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
        _canvas.addEventListener('mousemove', onMove, false);
        this.draw();
    };

    // set the manager
    this.set_manager = function (m) {
        _manager = m;
    };

    // reset the informations of previous move
    this.unselect = function () {
        _x_pos = null;
        _y_pos = null;
        _color_pos = null;
    };

    // private methods
    // compute the coordinates in canvas coordinates system
    var getClickPosition = function (e) {
        var rect = _canvas.getBoundingClientRect();

        return { x: (e.clientX - rect.left) * _scaleX, y: (e.clientY - rect.top) * _scaleY };
    };

    // initialize the state of game
    var init = function (c, e, l, g) {
        _engine = e;
        _color = c;
        _local = l;
        _gui = g;
    };

    // if interaction is click action, verify if the phase of engine is equal to YYYY (a phase of game)
    // and differents interactions are realized
    var onClick = function (event) {
        if (_engine.current_color()=== _color || _gui){
            var pos = getClickPosition(event);
            var xy = get_pieces_position(pos.x,pos.y);
            if(xy){
                if (xy.x ==-1 && xy.y ==-1){
                    if(_engine.phase()==Paletto.Phase.CONTINUE_TAKING){
                        console.log("Bouton clic");
                        _button_clicked = true;
                        _color_piece_played = null;
                        _manager.play();
                    }
                }
                else {
                    var tmp_color_piece = _engine.get_piece_color_from_x_y(xy.x, xy.y);
                    if (tmp_color_piece != -1) {
                        if(_color_piece_played == null || _color_piece_played == tmp_color_piece){

                            var list = _engine.get_possible_taken_list();
                            for (var k = 0; k < list.length; k++) {
                                if (xy.x == list[k].x && xy.y == list[k].y) {
                                    _color_piece_played = tmp_color_piece;
                                    _x_pos = xy.x;
                                    _y_pos = xy.y;
                                    _color_pos = tmp_color_piece;
                                    _manager.play();
                                }
                            }
                        }
                    }
                }
            }
        }
    };


    // call init method
    init(c, e, l, g);
};

