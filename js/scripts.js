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

Game.prototype.isWon = function (x, y,type) {
  //check for diagonal win conditions
  if (x === y) {
    if ((getSpace(0,0).occupiedBy === type) && (getSpace(1,1).occupiedBy === type) && (getSpace(2,2).occupiedBy === type)) {
      alert("Player "+type+" wins!");
      return true;
    }
  } else if (x + y === 2) {
    if ((getSpace(2,0).occupiedBy === type) && (getSpace(1,1).occupiedBy === type) && (getSpace(0,2).occupiedBy === type)) {
      alert("Player "+type+" wins!");
      return true;
    }
  }
  //check for horizontal/vertical win conditions
  if (((getSpace(x,0).occupiedBy===type)&&(getSpace(x,1).occupiedBy===type)&&(getSpace(x,2).occupiedBy===type)) || ((getSpace(0,y).occupiedBy===type)&&(getSpace(1,y).occupiedBy===type)&&(getSpace(2,y).occupiedBy===type))) {
    alert("Player "+type+" wins!");
    return true;
  } else {
    turn++;
    return false;
  }
};
//UI Logic
$(document).ready(function(){
  var newGame = new Game();
  $("td").click(function(){
    var xIn = parseInt(this.id[0]);
    var yIn = parseInt(this.id[1]);
    if (newGame.placePiece(xIn,yIn)) {
      $("#"+this.id).text(getSpace(xIn,yIn).occupiedBy);
      newGame.isWon(xIn,yIn,getSpace(xIn,yIn).occupiedBy);
    }

  });
});
