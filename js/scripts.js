//Global Variables
var boardArray = [];
var isGameActive = false;
var turn;
var getSpace = function (x, y) {
  return  boardArray[(y*3)+x];
};
var getPieceAtSpace = function(x,y) {
  return getSpace(x,y).occupiedBy;
}
var gameStatus = "Player X to move";
//Constructors
Player = function(piece) {
  this.piece = piece;
};

Space = function(x, y) {
  this.x = x;
  this.y = y;
  this.isOccupied = false;
  this.occupiedBy = "";
};

Piece = function(turn) {
  if (turn%2 === 0) this.type = "X";
  else this.type = "O";
};

Game = function() {
  boardArray = [];
  isGameActive = true;
  turn = 0;
  for (var iX = 0 ; iX < 3; iX++){
    for (var iY = 0 ; iY < 3; iY++){
      var gameSpace = new Space(iX,iY);
      boardArray.push(gameSpace);
    }
  }
};
//Game Logic
Game.prototype.placePiece = function(x, y) {
  if (this.isLegal(x,y)) {
    getSpace(x,y).isOccupied = true;
    var piece = new Piece(turn);
    getSpace(x,y).occupiedBy = piece.type;
    return true;
  } else {
    alert("Illegal Move");
    return false;
  }

};

Game.prototype.isLegal = function (x, y) {
  if (getSpace(x,y).isOccupied) {
    return false;
  } else {
    return true;
  }
};

Game.prototype.isOver = function (x, y, type) {
  //check for diagonal win conditions
  if (x === y) {
    if ((getPieceAtSpace(0,0) === type) && (getPieceAtSpace(1,1) === type) && (getPieceAtSpace(2,2) === type)) {
      gameStatus = "Player "+type+" wins!";
      isGameActive=false;
      return true;
    }
  } else if (x + y === 2) {
    if ((getPieceAtSpace(2,0) === type) && (getPieceAtSpace(1,1) === type) && (getPieceAtSpace(0,2) === type)) {
      gameStatus = "Player "+type+" wins!";
      isGameActive=false;
      return true;
    }
  }
  //check for horizontal/vertical win conditions
  if (((getPieceAtSpace(x,0)===type)&&(getPieceAtSpace(x,1)===type)&&(getPieceAtSpace(x,2)===type)) || ((getPieceAtSpace(0,y)===type)&&(getPieceAtSpace(1,y)===type)&&(getPieceAtSpace(2,y)===type))) {
    gameStatus = "Player "+type+" wins!";
    isGameActive=false;
    return true;
  }
  //check for draw
  if (turn===8) {
    gameStatus = "The game ended in a draw.";
    isGameActive=false;
    return true;
  } else {
    turn++;
    if ((turn%2)===0) {
      gameStatus = "Player X to move";
    } else gameStatus = "Player O to move";
    return false;
  }
};


//UI Logic
var drawBoard = function() {
  $("#game-board table").remove();
  $("#game-board").append("<table></table>");
  for (var i = 0; i < 3; i++){
    $("#game-board table").append("<tr id='"+i+"'></tr>");
    for(var j = 0; j < 3; j++) {
      $("#game-board tr#" + i).append("<td id='" + i + j + "'></td>");
    }
  }
};

var updateStatus = function() {
  $("#game-status h4").text(gameStatus)
};

var startNewGame = function() {
  updateStatus();
  var newGame = new Game();
  drawBoard();
  $("td").click(function(){
    if (isGameActive) {
      console.log("click");
      var xIn = parseInt(this.id[0]);
      var yIn = parseInt(this.id[1]);
      if (newGame.placePiece(xIn,yIn)) {
        $("#"+this.id).text(getPieceAtSpace(xIn,yIn));
        newGame.isOver(xIn,yIn,getPieceAtSpace(xIn,yIn));
        updateStatus();
      }
    }
  });
};

$(document).ready(function(){
  startNewGame();

  $("#new-game").click(function() {
    startNewGame();
  });

});
