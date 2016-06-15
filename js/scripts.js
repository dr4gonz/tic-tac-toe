//Global Variables
var boardArray = [];
var isGameActive = false;
var turn;
var getSpace = function (x, y) {
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
    getSpace(x,y).isOccupied = true;
    var piece = new Piece(turn);
    getSpace(x,y).occupiedBy = piece.type;
    this.isWon(x,y,piece.type);
  } else {
    alert("Illegal Move");
  }

};

Game.prototype.isLegal = function (x, y) {
  if (getSpace(x,y).isOccupied) {
    return false;
  } else {
    return true;
  }
};

Game.prototype.isWon = function (x, y,type) {
  debugger;
  if (((getSpace(x,0).occupiedBy===type)&&(getSpace(x,1).occupiedBy===type)&&(getSpace(x,2).occupiedBy===type)) || ((getSpace(0,y).occupiedBy===type)&&(getSpace(1,y).occupiedBy===type)&&(getSpace(2,y).occupiedBy===type))) {
    alert("Player "+type+" wins!");
    return true;
  } else {
    turn++;
    return false;
  }
};
//UI Logic
