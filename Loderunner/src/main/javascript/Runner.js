/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2016 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
var log = function(string) {
    console.log(string);
};

var printArray = function (array) {
   var result = [];
   for (var index in array) {
       var element = array[index];
       result.push(element.toString());
   }
   return "[" + result + "]";
};
var util = require('util');

//var hostIp = '127.0.0.1';
var hostIp = 'tetrisj.jvmhost.net';

var userName = 'user@gmail.com';
var protocol = 'WS';

var processBoard = function(boardString) {
    var board = new Board(boardString);
    log("Board: " + board);
    if (!!printBoardOnTextArea) {
        printBoardOnTextArea(board.boardAsString());
    }

    var answer = new DirectionSolver(board).get().toString();
    log("Answer: " + answer);
    log("-----------------------------------");

    return answer;
};

if (protocol == 'HTTP') {
    // unsupported
} else {
    var port = 8080;
    if (hostIp == 'tetrisj.jvmhost.net') {
        port = 12270;
    }
    var server = 'ws://' + hostIp + ':' + port + '/codenjoy-contest/ws';
    var WSocket = require('ws');
    var ws = new WSocket(server + '?user=' + userName);

    ws.on('open', function() {
        log('Opened');
    });

    ws.on('close', function() {
        log('Closed');
    });

    ws.on('message', function(message) {
        log('Received data');

        var pattern = new RegExp(/^board=(.*)$/);
        var parameters = message.match(pattern);
        var boardString = parameters[1];

        var answer = processBoard(boardString);

        ws.send(answer);
    });

    log('Web socket client running at ' + server);
}

var Elements = {
    /// a void
    NONE : ' ',

    /// walls
    BRICK : '#',
    PIT_FILL_1 : '1',
    PIT_FILL_2 : '2',
    PIT_FILL_3 : '3',
    PIT_FILL_4 : '4',
    UNDESTROYABLE_WALL : '☼',

    DRILL_PIT : '*',

    // this is enemy
    ENEMY_LADDER : 'Q',
    ENEMY_LEFT : '«',
    ENEMY_RIGHT : '»',
    ENEMY_PIPE_LEFT : '<',
    ENEMY_PIPE_RIGHT : '>',
    ENEMY_PIT : 'X',

    /// gold ;)
    GOLD : '$',

    /// This is your loderunner
    HERO_DIE : 'Ѡ',
    HERO_DRILL_LEFT : 'Я',
    HERO_DRILL_RIGHT : 'R',
    HERO_LADDER : 'Y',
    HERO_LEFT : '◄',
    HERO_RIGHT : '►',
    HERO_FALL_LEFT : ']',
    HERO_FALL_RIGHT : '[',
    HERO_PIPE_LEFT : '{',
    HERO_PIPE_RIGHT : '}',

    /// this is other players
    OTHER_HERO_DIE : 'Z',
    OTHER_HERO_LEFT : ')',
    OTHER_HERO_RIGHT : ' : ',
    OTHER_HERO_LADDER : 'U',
    OTHER_HERO_PIPE_LEFT : 'Э',
    OTHER_HERO_PIPE_RIGHT : 'Є',

    /// ladder and pipe - you can walk
    LADDER : 'H',
    PIPE : '~'
};

var D = function(index, dx, dy, name){

    var changeX = function(x) {
        return x + dx;
    };

    var changeY = function(y) {
        return y + dy;
    };

    var inverted = function() {
        switch (this) {
            case Direction.UP : return Direction.DOWN;
            case Direction.DOWN : return Direction.UP;
            case Direction.LEFT : return Direction.RIGHT;
            case Direction.RIGHT : return Direction.LEFT;
            default : return Direction.STOP;
        }
    };

    var toString = function() {
        return name;
    };

    return {
        changeX : changeX,

        changeY : changeY,

        inverted : inverted,

        toString : toString,

        getIndex : function() {
            return index;
        }
    };
};

var Direction = {
    UP : D(2, 0, -1, 'up'),                 // you can move
    DOWN : D(3, 0, 1, 'down'),
    LEFT : D(0, -1, 0, 'left'),
    RIGHT : D(1, 1, 0, 'right'),
    DRILL_LEFT : D(4, 0, 0, 'act,left'),    // drill ground
    DRILL_RIGHT : D(5, 0, 0, 'act,right'),
    STOP : D(6, 0, 0, '')                   // stay
};

Direction.values = function() {
   return [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT, Direction.DRILL_LEFT, Direction.DRILL_RIGHT, Direction.STOP];
};

Direction.valueOf = function(index) {
    var directions = Direction.values();
    for (var i in directions) {
        var direction = directions[i];
        if (direction.getIndex() == index) {
             return direction;
        }
    }
    return Direction.STOP;
};

var Point = function (x, y) {
    return {
        equals : function (o) {
            return o.getX() == x && o.getY() == y;
        },

        toString : function() {
            return '[' + x + ',' + y + ']';
        },

        isBad : function(boardSize) {
            return x >= boardSize || y >= boardSize || x < 0 || y < 0;
        },

        getX : function() {
            return x;
        },

        getY : function() {
            return y;
        }
    }
};

var pt = function(x, y) {
    return new Point(x, y);
};

var LengthToXY = function(boardSize) {
    return {
        getXY : function(length) {
            if (length == -1) {
                return null;
            }
            return new Point(length % boardSize, Math.ceil(length / boardSize));
        },

        getLength : function(x, y) {
            return y*boardSize + x;
        }
    };
};

var Board = function(board){
    var contains  = function(a, obj) {
        var i = a.length;
        while (i--) {
           if (a[i].equals(obj)) {
               return true;
           }
        }
        return false;
    };

    var removeDuplicates = function(all) {
        var result = [];
        for (var index in all) {
            var point = all[index];
            if (!contains(result, point)) {
                result.push(point);
            }
        }
        return result;
    };

    var boardSize = function() {
        return Math.sqrt(board.length);
    };

    var size = boardSize();
    var xyl = new LengthToXY(size);

    var getMe = function() {
        var result = [];
        result = result.concat(findAll(Elements.HERO_DIE));
        result = result.concat(findAll(Elements.HERO_DRILL_LEFT));
        result = result.concat(findAll(Elements.HERO_DRILL_RIGHT));
        result = result.concat(findAll(Elements.HERO_FALL_RIGHT));
        result = result.concat(findAll(Elements.HERO_FALL_LEFT));
        result = result.concat(findAll(Elements.HERO_LADDER));
        result = result.concat(findAll(Elements.HERO_LEFT));
        result = result.concat(findAll(Elements.HERO_RIGHT));
        result = result.concat(findAll(Elements.HERO_PIPE_LEFT));
        result = result.concat(findAll(Elements.HERO_PIPE_RIGHT));
        return result[0];
    };

    var getOtherHeroes = function() {
        var result = [];
        result = result.concat(findAll(Elements.OTHER_HERO_LEFT));
        result = result.concat(findAll(Elements.OTHER_HERO_RIGHT));
        result = result.concat(findAll(Elements.OTHER_HERO_LADDER));
        result = result.concat(findAll(Elements.OTHER_HERO_PIPE_LEFT));
        result = result.concat(findAll(Elements.OTHER_HERO_PIPE_RIGHT));
        return result;
    };

    var getEnemies = function() {
        var result = [];
        result = result.concat(findAll(Elements.ENEMY_LADDER));
        result = result.concat(findAll(Elements.ENEMY_LADDER));
        result = result.concat(findAll(Elements.ENEMY_LEFT));
        result = result.concat(findAll(Elements.ENEMY_PIPE_LEFT));
        result = result.concat(findAll(Elements.ENEMY_PIPE_RIGHT));
        result = result.concat(findAll(Elements.ENEMY_RIGHT));
        result = result.concat(findAll(Elements.ENEMY_PIT));
        return result;
    };

    var getGold = function() {
        return findAll(Elements.GOLD);
    };

    var getWalls = function() {
        var result = [];
        result = result.concat(findAll(Elements.BRICK));
        result = result.concat(findAll(Elements.UNDESTROYABLE_WALL));
        return result;
    };

    var getLadder = function() {
        var result = [];
        result = result.concat(findAll(Elements.LADDER));
        result = result.concat(findAll(Elements.HERO_LADDER));
        result = result.concat(findAll(Elements.ENEMY_LADDER));
        return result;
    };

    var getPipe = function() {
        var result = [];
        result = result.concat(findAll(Elements.PIPE));
        result = result.concat(findAll(Elements.HERO_PIPE_LEFT));
        result = result.concat(findAll(Elements.HERO_PIPE_RIGHT));
        result = result.concat(findAll(Elements.OTHER_HERO_PIPE_LEFT));
        result = result.concat(findAll(Elements.OTHER_HERO_PIPE_RIGHT));
        return result;
    };

    var isGameOver = function() {
        return board.indexOf(Elements.HERO_DIE) != -1;
    };

    var isAt = function(x, y, element) {
       if (pt(x, y).isBad(size)) {
           return false;
       }
       return getAt(x, y) == element;
    };

    var getAt = function(x, y) {
        return board.charAt(xyl.getLength(x, y));
    };

    var boardAsString = function() {
        var result = "";
        for (var i = 0; i <= size - 1; i++) {
            result += board.substring(i * size, (i + 1) * size);
            result += "\n";
        }
        return result;
    };

    var getBarriers = function() {
        var all = getWalls();
        all = all.concat(getEnemies());
        all = all.concat(getOtherHeroes());
        all = all.concat(getWalls());
        return removeDuplicates(all);
    };

    var toString = function() {
        return util.format("Board:\n%s\n" +
            "Me at: %s\n" +
            "Other heroes at: %s\n" +
            "Enemies at: %s\n" +
            "Gold at: %s\n",
                boardAsString(),
                getMe(),
                printArray(getOtherHeroes()),
                printArray(getEnemies()),
                printArray(getGold())
            );
    };

    var findAll = function(element) {
       var result = [];
       for (var i = 0; i < size*size; i++) {
           var point = xyl.getXY(i);
           if (isAt(point.getX(), point.getY(), element)) {
               result.push(point);
           }
       }
       return result;
   };

   var isAnyOfAt = function(x, y, elements) {
       for (var index in elements) {
           var element = elements[index];
           if (isAt(x, y,element)) {
               return true;
           }
       }
       return false;
   };

   var isNear = function(x, y, element) {
       if (pt(x, y).isBad(size)) {
           return false;
       }
       return isAt(x + 1, y, element) || isAt(x - 1, y, element) || isAt(x, y + 1, element) || isAt(x, y - 1, element);
   };

   var isBarrierAt = function(x, y) {
       return contains(getBarriers(), pt(x, y));
   };

   var countNear = function(x, y, element) {
       if (pt(x, y).isBad(size)) {
           return 0;
       }
       var count = 0;
       if (isAt(x - 1, y    , element)) count ++;
       if (isAt(x + 1, y    , element)) count ++;
       if (isAt(x    , y - 1, element)) count ++;
       if (isAt(x    , y + 1, element)) count ++;
       return count;
   };

   return {
        size : boardSize,
        getMe : getMe,
        getOtherHeroes : getOtherHeroes,
        isGameOver : isGameOver,
        isAt : isAt,
        boardAsString : boardAsString,
        getBarriers : getBarriers,
        toString : toString,
        findAll : findAll,
        getWalls : getWalls,
        getGold : getGold,
        isAnyOfAt : isAnyOfAt,
        isNear : isNear,
        isBarrierAt : isBarrierAt,
        countNear : countNear,
        getAt : getAt
   };
};

var random = function(n){
    return Math.floor(Math.random()*n);
};

var direction;

var DirectionSolver = function(board){

    return {
        get : function() {
            var me = board.getMe();

            return Direction.DRILL_LEFT;
        }
    };
};

