//Global Variables
var boardArray = [];
var topRow, midRow, botRow, leftCol, midCol, rightCol, leftDiag, rightDiag;
var allArray;
var isGameActive = false;
var turn;
var computerPlayer="O";
var getSpace = function (x, y) {
  return  boardArray[(x*3)+y];
};
var getPieceAtSpace = function(x,y) {
  return getSpace(x,y).occupiedBy;
}
var gameStatus = "Player X to move";

var checkTurn = function() {
  if (turn%2 === 0) return "X";
  else return "O";
}
//Constructors

Space = function(x, y) {
  this.x = x;
  this.y = y;
  this.isOccupied = false;
  this.occupiedBy = "";
};

Piece = function(turn) {
  this.type=checkTurn();
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
  topRow = [boardArray[0], boardArray[1], boardArray[2]];
  midRow = [boardArray[3], boardArray[4], boardArray[5]];
  botRow = [boardArray[6], boardArray[7], boardArray[8]];
  leftCol = [boardArray[0], boardArray[3], boardArray[6]];
  midCol = [boardArray[1], boardArray[4], boardArray[7]];
  rightCol = [boardArray[2], boardArray[5], boardArray[8]];
  rightDiag = [boardArray[2], boardArray[4], boardArray[6]];
  leftDiag = [boardArray[0], boardArray[4], boardArray[8]];
  allArray = [topRow, midRow, botRow, leftCol, midCol, rightCol, leftDiag, rightDiag];
};

//Game Logic
Game.prototype.placePiece = function(x, y) {
  if (this.isLegal(x,y)) {
    getSpace(x,y).isOccupied = true;
    var piece = new Piece(turn);
    getSpace(x,y).occupiedBy = piece.type;
    return true;
  } else {
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

Game.prototype.checkGameStatus = function (type) {
  for (var i=0 ; i < allArray.length ; i++){
    if ((allArray[i][0].occupiedBy === type ) && (allArray[i][1].occupiedBy === type ) && (allArray[i][2].occupiedBy === type )) {
      gameStatus = "Player "+type+" wins!";
      isGameActive=false;
      return true;
    }
  }
  //check for draw
  if (turn===8) {
    gameStatus = "The game ended in a draw.";
    isGameActive=false;
    return true;
  } else {
    turn++;
    gameStatus = "Player "+checkTurn()+" to move";
    return false;
  }
};

Game.prototype.smartPlace = function() {
  var placeAttempt;
  //On turn 1, pick center if available. If not, pick corner.
  if (turn === 1) {
    placeAttempt = (this.placePiece(1,1));
    if (placeAttempt) {
      return [1,1];
    } else {
      placeAttempt = (this.placePiece(0,0));
      return [0,0];
    }
  }
  var placeAttempt = this.checkMove();
  if (placeAttempt) {
    // debugger;
    this.placePiece(placeAttempt[0],placeAttempt[1]);
    return placeAttempt;
  }
  // var placeAttempt = this.checkForBlock();
  // if (placeAttempt) {
  //   // debugger;
  //   this.placePiece(placeAttempt[0],placeAttempt[1]);
  //   return placeAttempt;
  // }
  return this.randomlyPlace();
};
//checks for possible computer win
Game.prototype.checkMove = function() {
  for (var i=0 ; i < allArray.length ; i++){
    // debugger;
    var oCounter = 0;
    var xCounter = 0;
    var emptySpace=[];
    for (var j=0 ; j < 3 ; j++) {
      if (allArray[i][j].occupiedBy === "X") xCounter++;
      if (allArray[i][j].occupiedBy === "O") oCounter++;
      if (!(allArray[i][j].isOccupied)) emptySpace.push(allArray[i][j].x, allArray[i][j].y);
    }
    if ((oCounter === 2) && (xCounter===0)) return emptySpace;
    if ((xCounter === 2) && (oCounter===0)) return emptySpace;
  }
};

Game.prototype.randomlyPlace = function () {
  var x = Math.floor((Math.random() * 3));
  var y = Math.floor((Math.random() * 3));
  if (this.isLegal(x,y)) {
    this.placePiece(x,y);
    console.log(x+","+y);
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
};

var updateStatus = function() {
  $("#game-status h4").text(gameStatus)
};

var playGame = function() {
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
        newGame.checkGameStatus(getPieceAtSpace(xIn,yIn));
        updateStatus();
        if (computerPlayer===checkTurn()) {
          var compMove = newGame.smartPlace();
          $("#"+compMove[0]+compMove[1]).text(getPieceAtSpace(compMove[0],compMove[1]));
          newGame.checkGameStatus(getPieceAtSpace(compMove[0],compMove[1]));
          updateStatus();
        }
      }
    }
  });
};

$(document).ready(function(){
  playGame();

  $("#new-game").click(function() {
    var opponent = $("#choose-opponent").val();
    if (opponent === "Computer") {
      computerPlayer = "O";
    } else {
      computerPlayer = undefined;
    }
    playGame();

  });

});
