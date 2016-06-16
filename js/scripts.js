//Global Variables
var computerPlayer;
var ai;

//Constructors
Space = function(x, y) {
  this.x = x;
  this.y = y;
  this.isOccupied = false;
  this.occupiedBy = "";
};

Game = function() {
  this.gameStatus = "Player X to move.";
  this.boardArray = [];
  this.isGameActive = true;
  this.turn = 0;
  for (var iX = 0 ; iX < 3; iX++) {
    for (var iY = 0 ; iY < 3; iY++) {
      var gameSpace = new Space(iX,iY);
      this.boardArray.push(gameSpace);
    }
  }
  this.topRow = [this.boardArray[0], this.boardArray[1], this.boardArray[2]];
  this.midRow = [this.boardArray[3], this.boardArray[4], this.boardArray[5]];
  this.botRow = [this.boardArray[6], this.boardArray[7], this.boardArray[8]];
  this.leftCol = [this.boardArray[0], this.boardArray[3], this.boardArray[6]];
  this.midCol = [this.boardArray[1], this.boardArray[4], this.boardArray[7]];
  this.rightCol = [this.boardArray[2], this.boardArray[5], this.boardArray[8]];
  this.rightDiag = [this.boardArray[2], this.boardArray[4], this.boardArray[6]];
  this.leftDiag = [this.boardArray[0], this.boardArray[4], this.boardArray[8]];
  this.allArray = [this.topRow, this.midRow, this.botRow, this.leftCol, this.midCol, this.rightCol, this.leftDiag, this.rightDiag];
};

Game.prototype.checkTurn = function() {
  if (this.turn%2 === 0) return "X";
  else return "O";
};

Game.prototype.getSpace = function (x, y) {
  return  this.boardArray[(x*3)+y];
};

Game.prototype.getPieceAtSpace = function(x,y) {
  return this.getSpace(x,y).occupiedBy;
};
//Game Logic
Game.prototype.placePiece = function(x, y) {
  if (this.isLegal(x,y)) {
    this.getSpace(x,y).isOccupied = true;
    this.getSpace(x,y).occupiedBy = this.checkTurn();
    return true;
  } else {
    return false;
  }
};
//check move legality
Game.prototype.isLegal = function (x, y) {
  if (this.getSpace(x,y).isOccupied) {
    return false;
  } else {
    return true;
  }
};
Game.prototype.checkGameStatus = function () {
  var type = this.checkTurn();
  for (var i=0 ; i < this.allArray.length ; i++){
    if ((this.allArray[i][0].occupiedBy === type ) && (this.allArray[i][1].occupiedBy === type ) && (this.allArray[i][2].occupiedBy === type )) {
      this.gameStatus = "Player "+type+" wins!";
      this.isGameActive=false;
      return this.allArray[i];
    }
  }
  //check for draw
  if (this.turn===8) {
    this.gameStatus = "The game ended in a draw.";
    this.isGameActive=false;
    return [];
  } else {
    this.turn++;
    this.gameStatus = "Player "+this.checkTurn()+" to move";
  }
};
//function to control 'smart' AI piece placement
Game.prototype.smartPlace = function() {
  var placeAttempt;
  //On turn 1, pick center if available. If not, pick corner.
  if (this.turn === 1) {
    placeAttempt = (this.placePiece(1,1));
    if (placeAttempt) {
      return [1,1];
    } else {
      placeAttempt = (this.placePiece(0,0));
      return [0,0];
    }
  }
  if (this.turn === 3) {
    if (this.boardArray[1].occupiedBy === "X" && this.boardArray[5].occupiedBy === "X") {
      placeAttempt = (this.placePiece(0,2));
      return [0,2];
    } else if (this.boardArray[5].occupiedBy === "X" && this.boardArray[7].occupiedBy === "X") {
      placeAttempt = (this.placePiece(2,2));
      return [2,2];
    } else if (this.boardArray[7].occupiedBy === "X" && this.boardArray[3].occupiedBy === "X") {
      placeAttempt = (this.placePiece(2,0));
      return [2,0];
    } else if (this.boardArray[3].occupiedBy === "X" && this.boardArray[1].occupiedBy === "X") {
      placeAttempt = (this.placePiece(0,0));
      return [0,0];
    }
  }
  var placeAttempt = this.checkMove();
  if (placeAttempt) {
    this.placePiece(placeAttempt[0],placeAttempt[1]);
    return placeAttempt;
  }
  if (!this.getSpace(0,2).isOccupied) {
    placeAttempt = [0,2]
    this.placePiece(placeAttempt[0],placeAttempt[1]);
    return placeAttempt;
  }
  return this.randomlyPlace();
};
//checks for possible computer win
Game.prototype.checkMove = function() {
  for (var i=0 ; i < this.allArray.length ; i++){
    var oCounter = 0;
    var xCounter = 0;
    var emptySpace=[];
    for (var j=0 ; j < 3 ; j++) {
      if (this.allArray[i][j].occupiedBy === "X") xCounter++;
      if (this.allArray[i][j].occupiedBy === "O") oCounter++;
      if (!(this.allArray[i][j].isOccupied)) emptySpace.push(this.allArray[i][j].x, this.allArray[i][j].y);
    }
    if ((oCounter === 2) && (xCounter===0)) return emptySpace;
    if ((xCounter === 2) && (oCounter===0)) return emptySpace;
  }
};
//'easy' game AI
Game.prototype.randomlyPlace = function () {
  var x = Math.floor((Math.random() * 3));
  var y = Math.floor((Math.random() * 3));
  if (this.isLegal(x,y)) {
    this.placePiece(x,y);
    return [x,y];
  } else return this.randomlyPlace();
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
  $("#game-board table").fadeIn("slow");
};

var playGame = function() {
  var newGame = new Game();
  var updateStatus = function() {
    $("#game-status h4").text(newGame.gameStatus)
  };
  updateStatus();
  drawBoard();
  $("td").click(function() {
    if (newGame.isGameActive) {
      var xIn = parseInt(this.id[0]);
      var yIn = parseInt(this.id[1]);
      if (newGame.placePiece(xIn,yIn)) {
        $("#"+this.id).text(newGame.getPieceAtSpace(xIn,yIn));
        newGame.checkGameStatus();
        updateStatus();
        if (ai === "easy") {
          if (computerPlayer===newGame.checkTurn()) {
            var compMove = newGame.randomlyPlace();
            $("#"+compMove[0]+compMove[1]).text(newGame.getPieceAtSpace(compMove[0],compMove[1]));
            newGame.checkGameStatus();
            updateStatus();
          }
        } else if (ai === "hard") {
          if (computerPlayer===newGame.checkTurn()) {
            var compMove = newGame.smartPlace();
            $("#"+compMove[0]+compMove[1]).text(newGame.getPieceAtSpace(compMove[0],compMove[1]));
            newGame.checkGameStatus();
            updateStatus();
          }
        }
      }
    }
    if (!newGame.isGameActive) {
      newGame.checkGameStatus().forEach(function(redSquare){
        $("#"+redSquare.x + redSquare.y).addClass("red-square");
      });
    }
  });
};

$(document).ready(function() {
  playGame();
  $("#new-game").click(function() {
    ai = "off";
    computerPlayer = "";
    playGame();
  });
  $("#easy-game").click(function() {
    ai = "easy";
    computerPlayer = "O";
    playGame();
  });
  $("#hard-game").click(function() {
    ai = "hard";
    computerPlayer = "O";
    playGame();
  });
});
