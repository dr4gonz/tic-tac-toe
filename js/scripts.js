//Global Variables
var boardArray = [];
var isGameActive = false;

//Constructors
Player = function(piece) {
  this.piece = piece;
}

Space = function(x, y) {
  this.x = x;
  this.y = y;
  this.isOccupied = false;
}

Piece = function(turn) {
  if (turn%2 === 0) this.type = "X";
  else this.type = "O";
}

Game = function() {
  isGameActive = true;
  for (var iX = 0 ; iX < 3; iX++){
    for (var iY = 0 ; iY < 3; iY++){
      var gameSpace = new Space(iX,iY);
      boardArray.push(gameSpace);
    }
  }
}
//Game Logic

//UI Logic
