const blessed = require('blessed');
const startF = require('./startFile.js').startFile

const screen = blessed.screen( {
  smartCSR: true
});

const box = blessed.box({
  top: '0',
  left: '0',
  //width: '100%',
  height: '100%',
  content: ' 0 \n  0',
  tags: true,
  border: {
    
      type: 'line'
  },
  style: {
    fg: 'green',
    bg: 'white'
  }
});

screen.append(box);

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
  return process.exit(0);
});



let GameBoard = [];
let currentGame;

let makeGamebox = () => {
 
 for (let x = 0; x < 50; x++) {
   let tempArray = [];
   for (let y = 0; y < 50; y++) {
     if (y === 49) {
       tempArray.push('\n');
     } else {
     tempArray.push(' ');
    }
   }
   GameBoard.push(tempArray);
 }
 setBoard(startF);
};

let setBoard = (pattern) => {
  //Set first cells onto board
  let cells = pattern['Cells'];
  for (let x = 0; x <cells.length; x++) {
    let postX = cells[x][0];
    let postY = cells[x][1];

    GameBoard[postX][postY] = '#';
  }
  currentGame = JSON.parse(JSON.stringify(GameBoard));
  joinArray(currentGame);
}


const changeBoard = (game) => {

  let currentBoard = JSON.parse(JSON.stringify(game));

  for (let x = 1; x < currentBoard.length-1; x++) {
    for ( let y = 1; y < currentBoard.length-1; y++) {
      let total = 0;

      total = total + isAlive(currentBoard[x - 1][y - 1]); 
      total = total + isAlive(currentBoard[x - 1][y]); 
      total = total + isAlive(currentBoard[x - 1][y + 1]); 

      total = total + isAlive(currentBoard[x + 1][y - 1]); 
      total = total + isAlive(currentBoard[x + 1][y]); 
      total = total + isAlive(currentBoard[x + 1][y + 1]); 

      total = total + isAlive(currentBoard[x][y - 1]);
      total = total + isAlive(currentBoard[x][y + 1]); 

      if (currentBoard[x][y] === '#') {
        if (total <= 1 || total >= 4) {
          GameBoard[x][y] = ' '; 
        } else {
          GameBoard[x][y] = '#';
        }
      }

      if (total === 3) {
        game[x][y] = '#';
      }
    }
  }
}

const joinArray = (board) => {
  for (let x = 0; x < board.length; x++) {
    board[x] = board[x].join('');
  }
  currentGame = board.join('');
}

const isAlive = (str) => {
  if (str === '#') {
    return 1;
  } else {
    return 0;
  }
}


const StartGame = () => {
  makeGamebox();
  box.setContent(currentGame);
  screen.render();
  currentGame = GameBoard.slice(0);
  joinArray(currentGame);
}

StartGame();

setInterval(() => {
  changeBoard(GameBoard);
  currentGame = GameBoard.slice(0);
  joinArray(currentGame);
  box.setContent(currentGame);
  screen.render();
},250)
