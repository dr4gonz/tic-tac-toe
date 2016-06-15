//Global Variables
var boardArray = [];
var isGameActive = false;
var turn;
var getSpaceIndex = function (x, y) {
  return  boardArray[(y*3)+x];
}
//Constructors
Player = function(piece) {
  this.piece = piece;
}

Space = function(x, y) {
  this.x = x;
  this.y = y;
  this.isOccupied = false;
  this.occupiedBy = "";
}

Piece = function(turn) {
  if (turn%2 === 0) this.type = "X";
  else this.type = "O";
}

Game = function() {
  isGameActive = true;
  turn = 0;
  for (var iX = 0 ; iX < 3; iX++){
    for (var iY = 0 ; iY < 3; iY++){
      var gameSpace = new Space(iX,iY);
      boardArray.push(gameSpace);
    }
  }

}
//Game Logic
Game.prototype.placePiece = function(x, y) {
  if (this.isLegal(x,y)) {
    getSpaceIndex(x,y).isOccupied = true;
    var piece = new Piece(turn);
    getSpaceIndex(x,y).occupiedBy = piece.type;
    turn++;
  } else {
    alert("Illegal Move");
  }

};

Game.prototype.isLegal = function (x, y) {
  if (getSpaceIndex(x,y).isOccupied) {
    return false;
  } else {
    return true;
  }
}
//UI Logic
