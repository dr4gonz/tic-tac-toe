//Global Variables
var boardArray = [];
var isGameActive = false;
var turn;
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
  boardArray[(y*3)+x].isOccupied = true;
  var piece = new Piece(turn);
  boardArray[(y*3)+x].occupiedBy = piece.type;
  turn++;
}

//UI Logic
