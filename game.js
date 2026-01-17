const gameboard = (function () {
  const board = new Array(9).fill(null);

  const clearBoard = () => board.fill(null);

  const getGameboard = () => board;

  const setMarker = (index, marker) => {
    if (getMarker()) throw new Error("there is already marker in this cell");
    board[index] = marker;
  };

  const getMarker = (index) => board[index];

  const checkTie = () => {
    return !checkWinner() && board.every((cell) => getMarker() !== null);
  };

  const checkWinner = () => {
    let isWinner = false;

    const winConditions = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    for (const winCondition of winConditions) {
      const [index1, index2, index3] = winCondition;

      if (
        board[index1].getMarker() &&
        board[index1] === board[index2] &&
        board[index1] === board[index3]
      ) {
        isWinner = true;
        break;
      }
    }
    return isWinner;
  };

  return {
    getGameboard,
    checkWinner,
    checkTie,
    clearBoard,
    setMarker,
    getMarker,
  };
})();

function createPlayer(name, marker) {
  const getName = () => name;
  const setName = (newName) => (name = newName);

  const getMarker = () => marker;
  return { getName, setName, getMarker };
}

// GameController
const gameController = (function () {
  const player1 = createPlayer("player1", "X");
  const player2 = createPlayer("player2", "O");
  let activePlayer = player1;
  let gameOver = false;

  const playRound = (index) => {
    try {
      gameboard.setMarker(index, activePlayer.getMarker());
      displayController.placeMarker(index, activePlayer.getMarker());

      if (gameboard.checkWinner()) {
        console.log("the winner is", activePlayer.getMarker());
        gameOver = true;
      } else if (gameboard.checkTie()) {
        console.log("the game was tie");
        gameOver = true;
      }

      changeActivePlayer();
      displayController.drawBoard();
    } catch (error) {
      console.log(error);
    }
  };

  const changeActivePlayer = () => {
    activePlayer = activePlayer === player1 ? player2 : player1;
  };

  const playAgain = () => {
    gameboard.clearBoard();
    gameOver = false;
    changeActivePlayer();
  };

  return { playRound, playAgain };
})();

displayController = (function () {
  const drawBoard = () => {
    const gameboardElement = document.querySelector(".gameboard");
    gameboardElement.innerHTML = "";

    for (const [i, cell] of gameboard.getGameboard().entries()) {
      const cellElement = document.createElement("div");
      cellElement.classList.add("cell");
      cellElement.textContent = cell;
      cellElement.addEventListener("click", () => {
        gameController.playRound(i);
      });
      gameboardElement.appendChild(cellElement);
    }
  };

  const placeMarker = (index, marker) => {
    const cells = Array.from(document.querySelectorAll(".cell"));
    cells[index].textContent = marker;
    console.log(cells[index].textContent);
    console.log(gameboard.getGameboard());
    drawBoard();
  };

  drawBoard();

  return { drawBoard, placeMarker };
})();