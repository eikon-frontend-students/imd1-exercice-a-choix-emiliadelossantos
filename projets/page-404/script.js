const board = document.getElementById("board");
const statusText = document.getElementById("status");
const resetBtn = document.getElementById("reset");

let currentPlayer = "X";
let grid = Array(9).fill(null);
let isServerThinking = false;

const winningCombinations = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

// Fonction pour retourner l'emoji correspondant au joueur
function getPlayerSymbol(player) {
  if (player === "X") return "✨"; // étoile pour X
  if (player === "O") return "🪩"; // boule disco pour O
  return "";
}

function checkWinner() {
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    if (grid[a] && grid[a] === grid[b] && grid[a] === grid[c]) {
      return grid[a];
    }
  }
  if (!grid.includes(null)) return "Egalité";
  return null;
}

function handleClick(e) {
  const index = e.target.dataset.index;
  if (grid[index] || checkWinner() || isServerThinking || currentPlayer !== "X")
    return;

  grid[index] = currentPlayer;
  e.target.textContent = getPlayerSymbol(currentPlayer);
  e.target.classList.add("taken", currentPlayer.toLowerCase());

  const winner = checkWinner();
  if (!statusText) return;
  if (winner) {
    statusText.textContent =
      winner === "Equality"
        ? "Draw!"
        : `Player ${getPlayerSymbol(winner)} won!`;
  } else {
    currentPlayer = "O";
    statusText.textContent = "Hmm… my turn ✨";
    isServerThinking = true;
    setTimeout(serverMove, 3000);
  }
}

function serverMove() {
  const bestMove = findBestMove();
  if (bestMove !== null) {
    grid[bestMove] = "O";
    const cell = board.querySelector(`[data-index="${bestMove}"]`);
    if (cell) {
      cell.textContent = getPlayerSymbol("O");
      cell.classList.add("taken", "o");
    }
  }

  const winner = checkWinner();
  if (!statusText) return;

  if (winner) {
    statusText.textContent =
      winner === "Equality"
        ? "Draw!"
        : `PLayer ${getPlayerSymbol(winner)} won!`;
  } else {
    currentPlayer = "X";
    statusText.textContent = "À toi de jouer, X ! 🪩";
  }

  isServerThinking = false;
}

function findBestMove() {
  // 1. Cherche à gagner
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    const values = [grid[a], grid[b], grid[c]];
    if (values.filter((v) => v === "O").length === 2 && values.includes(null)) {
      return combo[values.indexOf(null)];
    }
  }

  // 2. Bloque le joueur X
  for (const combo of winningCombinations) {
    const [a, b, c] = combo;
    const values = [grid[a], grid[b], grid[c]];
    if (values.filter((v) => v === "X").length === 2 && values.includes(null)) {
      return combo[values.indexOf(null)];
    }
  }

  // 3. Sinon, joue aléatoirement
  const emptyIndices = grid
    .map((val, i) => (val === null ? i : null))
    .filter((val) => val !== null);

  if (emptyIndices.length === 0) return null;

  return emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
}

function resetGame() {
  grid = Array(9).fill(null);
  currentPlayer = "X";
  isServerThinking = false;
  if (!statusText) return;
  statusText.textContent = "Joueur X commence";
  board.querySelectorAll(".cell").forEach((cell) => {
    cell.textContent = "";
    cell.classList.remove("taken", "x", "o");
  });
}

function createBoard() {
  board.innerHTML = "";
  for (let i = 0; i < 9; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    cell.dataset.index = i;
    cell.addEventListener("click", handleClick);
    board.appendChild(cell);
  }
}

resetBtn.addEventListener("click", resetGame);

createBoard();
