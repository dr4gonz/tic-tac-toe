//Global Variables
var boardArray = [];
var isGameActive = false;
var turn;
var computerPlayer = "O";
var getSpace = function (x, y) {
  return  boardArray[(y*3)+x];
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
  // this.xHuman = true;
  // this.oHuman = true;
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

Game.prototype.checkGameStatus = function (x, y, type) {
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
    gameStatus = "Player "+checkTurn()+" to move";
    return false;
  }
};


//random 'easy' AI logic
Game.prototype.randomlyPlace = function () {
  // debugger;
  var x = Math.floor((Math.random() * 3));
  var y = Math.floor((Math.random() * 3));
  if (this.isLegal(x,y)) {
    this.placePiece(x,y);
    return [x,y];
  } else return this.randomlyPlace();
}
//harder AI Logic
Game.prototype.smartPlace = function () {
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
 var tryToWin = this.checkForWin();
 if (tryToWin) {
   this.placePiece(tryToWin[0],tryToWin[1]);
   return tryToWin;
 }
 var tryToBlock = this.checkForBlock();
 if (tryToBlock) {
   this.placePiece(tryToBlock[0],tryToBlock[1]);
   return tryToBlock;
 }
 return this.randomlyPlace();
}
//this function currently only checks for horizontal/vertical wins
Game.prototype.checkForWin = function() {
  var oCounter;
  var xCounter;
  var winCoordinates = [];
  //check for horizontal win conditions
  for (var i = 0 ; i < 3 ; i++) {
    oCounter = 0;
    xCounter = 0;
    winCoordinates = [];
    for (var j = 0 ; j < 3 ; j++){
      if (getPieceAtSpace(i,j) === "O") oCounter++;
      if (getPieceAtSpace(i,j) === "X") xCounter++;
      if (!getPieceAtSpace(i,j)) {
        winCoordinates.push(i);
        winCoordinates.push(j);
      }
    }
    //places piece at win coordinates
    if (oCounter===2 && xCounter===0) {
      return winCoordinates;
    }
  }

  //check for vertical win conditions
  for (var i = 0 ; i < 3 ; i++) {
    oCounter = 0;
    xCounter = 0;
    winCoordinates = [];
    for (var j = 0 ; j < 3 ; j++){
      if (getPieceAtSpace(j,i) === "O") oCounter++;
      if (getPieceAtSpace(j,i) === "X") xCounter++;
      if (!getPieceAtSpace(j,i)) {
        winCoordinates.push(j);
        winCoordinates.push(i);
      }
    }
    //places piece at win coordinates
    if (oCounter===2 && xCounter===0) {
      return winCoordinates;
    }
  }

  //checks for right-to-left diagonal win condition

  oCounter = 0;
  xCounter = 0;
  winCoordinates = [];
  for (var i = 2 ; i >= 0; i--) {
    for (var j = 0 ; j < 3 ; j++) {
      if (i + j === 2) {
        if (getPieceAtSpace(i,j) === "O") oCounter++;
        if (getPieceAtSpace(i,j) === "X") xCounter++;
        if (!getPieceAtSpace(i,j)) {
          winCoordinates.push(i);
          winCoordinates.push(j);
        }
      }
    }
    //places piece at win coordinates
    if (oCounter===2 && xCounter===0) {
      return winCoordinates;
    }
  }

  //checks for left-to-right diagonal win condition
  oCounter = 0;
  xCounter = 0;
  for (var i = 0; i < 3; i++) {
    if (getPieceAtSpace(i,i) === "O") oCounter++;
    if (getPieceAtSpace(i,i) === "X") xCounter++;
    if (!getPieceAtSpace(i,i)) {
      winCoordinates = [];
      winCoordinates.push(i);
      winCoordinates.push(i);
    }
  }
  if (oCounter===2 && xCounter===0) {
    return winCoordinates;
  }

  return false;
}
//this function will check for a possible X win and block it
Game.prototype.checkForBlock = function () {
  var oCounter;
  var xCounter;
  var blockCoordinates;
  //check for x horizontal win conditions
  for (var i = 0 ; i < 3 ; i++) {
    oCounter = 0;
    xCounter = 0;
    blockCoordinates = [];
    for (var j = 0 ; j < 3 ; j++){
      if (getPieceAtSpace(i,j) === "O") oCounter++;
      if (getPieceAtSpace(i,j) === "X") xCounter++;
      if (!getPieceAtSpace(i,j)) {
        blockCoordinates.push(i);
        blockCoordinates.push(j);
      }
    }
    //places piece at blocking coordinates
    if (oCounter===0 && xCounter===2) {
      return blockCoordinates;
    }
  }

  //check for X vertical win conditions
  for (var i = 0 ; i < 3 ; i++) {
    oCounter = 0;
    xCounter = 0;
    blockCoordinates = [];
    for (var j = 0 ; j < 3 ; j++){
      if (getPieceAtSpace(j,i) === "O") oCounter++;
      if (getPieceAtSpace(j,i) === "X") xCounter++;
      if (!getPieceAtSpace(j,i)) {
        blockCoordinates.push(j);
        blockCoordinates.push(i);
      }
    }
    //places piece at blocking coordinates
    if (oCounter===0 && xCounter===2) {
      return blockCoordinates;
    }
  }

  // //checks for right-to-left diagonal X win condition
  debugger;
  oCounter = 0;
  xCounter = 0;
  blockCoordinates = [];
  for (var i = 2 ; i >= 0; i--) {
    for (var j = 0 ; j < 3 ; j++) {
      if (i + j === 2) {
        if (getPieceAtSpace(i,j) === "O") oCounter++;
        if (getPieceAtSpace(i,j) === "X") xCounter++;
        if (!getPieceAtSpace(i,j)) {
          blockCoordinates.push(i);
          blockCoordinates.push(j);
        }
      }
    }
    //places piece at blocking coordinates
    if (oCounter===0 && xCounter===2) {
      return blockCoordinates;
    }
  }

  //checks for left-to-right diagonal X win condition
  oCounter = 0;
  xCounter = 0;
  for (var i = 0; i < 3; i++) {
    if (getPieceAtSpace(i,i) === "O") oCounter++;
    if (getPieceAtSpace(i,i) === "X") xCounter++;
    if (!getPieceAtSpace(i,i)) {
      blockCoordinates = [];
      blockCoordinates.push(i);
      blockCoordinates.push(i);
    }
  }
  if (oCounter===0 && xCounter===2) {
    return blockCoordinates;
  }

  return false;
}


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
  $("#game-status h4").text(gameStatus);
};

var playGame = function() {
  updateStatus();
  var newGame = new Game();
  drawBoard();
  $("td").click(function(){
    if (isGameActive) {
      var xIn = parseInt(this.id[0]);
      var yIn = parseInt(this.id[1]);
      if (newGame.placePiece(xIn,yIn)) {
        $("#"+this.id).text(getPieceAtSpace(xIn,yIn));
        newGame.checkGameStatus(xIn,yIn,getPieceAtSpace(xIn,yIn));
        updateStatus();
        if (computerPlayer===checkTurn()) {
          var compMove = newGame.smartPlace();
          $("#"+compMove[0]+compMove[1]).text(getPieceAtSpace(compMove[0],compMove[1]));
          newGame.checkGameStatus(compMove[0],compMove[1],getPieceAtSpace(compMove[0],compMove[1]));
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

var addMarker = function(x,y) {
  $("#"+x+y).append("!");
}
