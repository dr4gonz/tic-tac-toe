//Global Variables
var boardArray = [];
var isGameActive = false;
var turn;
var getSpace = function (x, y) {
  return  boardArray[(y*3)+x];
};
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
    if ((getSpace(0,0).occupiedBy === type) && (getSpace(1,1).occupiedBy === type) && (getSpace(2,2).occupiedBy === type)) {
      alert("Player "+type+" wins!");
      isGameActive=false;
      return true;
    }
  } else if (x + y === 2) {
    if ((getSpace(2,0).occupiedBy === type) && (getSpace(1,1).occupiedBy === type) && (getSpace(0,2).occupiedBy === type)) {
      alert("Player "+type+" wins!");
      isGameActive=false;
      return true;
    }
  }
  //check for horizontal/vertical win conditions
  if (((getSpace(x,0).occupiedBy===type)&&(getSpace(x,1).occupiedBy===type)&&(getSpace(x,2).occupiedBy===type)) || ((getSpace(0,y).occupiedBy===type)&&(getSpace(1,y).occupiedBy===type)&&(getSpace(2,y).occupiedBy===type))) {
    alert("Player "+type+" wins!");
    isGameActive=false;
    return true;
  }
  //check for draw
  if (turn===8) {
    alert("The game ended in a draw.");
    isGameActive=false;
    return true;
  }
  else {
    turn++;
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

var startNewGame = function() {
  var newGame = new Game();
  drawBoard();
  $("td").click(function(){
    if (isGameActive) {
      console.log("click");
      var xIn = parseInt(this.id[0]);
      var yIn = parseInt(this.id[1]);
      if (newGame.placePiece(xIn,yIn)) {
        $("#"+this.id).text(getSpace(xIn,yIn).occupiedBy);
        newGame.isOver(xIn,yIn,getSpace(xIn,yIn).occupiedBy);
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
