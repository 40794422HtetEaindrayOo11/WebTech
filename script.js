/*HOME PAGE FUNCTIONS */
//welcome page section to direct the index.html page 
function goToGames() {
  window.location.href = "gameChoice.html";
}
function goToHome() {
  window.location.href = "index.html";
}

// START GAME (CATEGORY + LEVEL)
function startGame(category, level) {
  localStorage.setItem("selectedCategory", category);
  localStorage.setItem("selectedLevel", level);
  window.location.href = "game.html";
}

/*HOW TO PLAY MODAL*/

//open instruction modal
function openHowToPlay() {
  document.getElementById("howToPlayModal").style.display = "flex";
}

//close instruction modal
function closeHowToPlay() {
  document.getElementById("howToPlayModal").style.display = "none";
}


/*SETTINGS MODAL*/
function openSettings() {
  document.getElementById("settingsModal").style.display = "flex";
}

function closeSettings() {
  document.getElementById("settingsModal").style.display = "none";
}


/*THEME SETTINGS*/
function toggleThemeOptions() {
  const options = document.getElementById("themeOptions");
  options.style.display = options.style.display === "block" ? "none" : "block";
}

function setTheme(mode) {
  document.body.classList.toggle("dark", mode === "dark");
  localStorage.setItem("theme", mode);
}


/*BACKGROUND MUSIC*/
const bgMusic = document.getElementById("bgMusic");
const musicBtn = document.getElementById("musicBtn");
let musicPlaying = false;

//toggle background music on/off
function toggleMusic() {
  if (!bgMusic) return;

  if (!musicPlaying) {
    bgMusic.volume = 0.4;
    bgMusic.play().then(() => {
      musicPlaying = true;
      if (musicBtn) musicBtn.textContent = "🔈 Music Off";
    }).catch(() => {});
  } else {
    bgMusic.pause();
    musicPlaying = false;
    if (musicBtn) musicBtn.textContent = "🔊 Music On";
  }
}


/*load save setting*/
//apply saved theme when page loads
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
});


/* Game Page Logic */

const grid = document.getElementById("gameGrid");

if (grid) {
  const category = localStorage.getItem("selectedCategory");
  const level = localStorage.getItem("selectedLevel") || "easy";

  const cardsData = {
    fruits: ["🍎","🍌","🍓","🍇","🍍","🍉","🥝","🍒","🍑","🍋","🍐","🥭"],
    animals: ["🐶","🐱","🐼","🦁","🐸","🐵","🐯","🦊","🐮","🐷","🐰","🐔"],
    colors: ["🔴","🟡","🟢","🔵","🟣","🟠","⚫","⚪","🟤","🟥","🟦","🟩"],
    vehicles: ["🚗","🚕","🚙","🚌","🚎","🏎️","🚓","🚑","🚒","🚜","✈️","🚀"],
    shapes: ["🔺","🔵","⬛","⬜","⭐","🔶","🔷","🟠","🟣","🟢","🟥","🟦"],
    emojis: ["😀","😂","😍","😎","🥳","🤩","😇","😜","🤓","😡","😭","😴"],
    symbols: ["➕","➖","✖️","➗","√","π","∞","≈","≠","≤","≥","∑"],
    numbers: ["0️⃣","1️⃣","2️⃣","3️⃣","4️⃣","5️⃣","6️⃣","7️⃣","8️⃣","9️⃣","🔟","💯"]
  };

  /* card count and time BY level */
  let cardCount = 8;  
  let timeLimit = 120;      // EASY
  if (level === "medium") {
    cardCount = 12;
    timeLimit = 90;
  }
  if (level === "hard") {
    cardCount = 16;
    timeLimit = 60;
  }

  /* grid layout */
  if (cardCount === 8) {
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (cardCount === 16) {
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else {
    grid.style.gridTemplateColumns = "repeat(4, 1fr)"; // 24 cards
  }

  /* Select category and shuffle cards */
  const symbols = cardsData[category].slice(0, cardCount / 2);
  let cards = [...symbols, ...symbols];
  cards.sort(() => Math.random() - 0.5);

  //game state variables
  let firstCard = null;
  let lockBoard = false;
  let moves = 0;
  let matchedPairs = 0;
  let remainingTime = timeLimit;

  /* Create cards */
  grid.innerHTML = "";
  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = symbol;
    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });

  /* Timer counting logic*/
  const timeInterval = setInterval(()=>{
    remainingTime--;
    const min = String(Math.floor(remainingTime/60)).padStart(2,"0");
    const sec = String (remainingTime% 60 ).padStart(2, "0");
    document.getElementById("time").textContent = `${min}:${sec}`;

    if (remainingTime<=0){
      clearInterval(timeInterval);
      gameOver();
    }
  }, 1000);

  //card flip and matching logic
  function flipCard(card) {
    if (lockBoard || card.classList.contains("flipped")) return;

    card.classList.add("flipped");

    if (!firstCard) {
      firstCard = card;
      return;
    }

    moves++;
    document.getElementById("moves").textContent = moves;

    if (firstCard.textContent === card.textContent) {
      firstCard.classList.add("matched");
      card.classList.add("matched");
      matchedPairs++;

      if (matchedPairs === cards.length / 2) endGame();
      firstCard = null;
    } else {
      lockBoard = true;
      setTimeout(() => {
        firstCard.classList.remove("flipped");
        card.classList.remove("flipped");
        firstCard = null;
        lockBoard = false;
      }, 800);
    }
  }


  /* game end handles*/ 
let finalTimeGlobal = 0;
let movesGlobal = 0;

function endGame() {
  const finalTimeText = document.getElementById("time").textContent;

  const parts = finalTimeText.split(":");
  finalTimeGlobal = parseInt(parts[0]) * 60 + parseInt(parts[1]);
  movesGlobal = moves;

  const min = String(Math.floor(finalTimeGlobal / 60)).padStart(2, "0");
  const sec = String(finalTimeGlobal % 60).padStart(2, "0");

  document.getElementById("finalTime").textContent = `${min}:${sec}`;
  // show name modal only
  document.getElementById("resultModal").style.display = "flex";
}

/* save score and show confirmation*/
function savePlayerScore() {
  const input = document.getElementById("playerNameInput");
  const playerName = input.value.trim() || "Player";

  const level = localStorage.getItem("selectedLevel");

  //correct values
  saveScore(playerName, movesGlobal, finalTimeGlobal, level);

  // close name modal
  document.getElementById("resultModal").style.display = "none";

  // show SUCCESS modal 
  document.getElementById("savedModal").style.display = "flex";
}

  function gameOver() {
    document.getElementById("gameOverMoves").textContent = moves;
    document.getElementById("gameOverModal").style.display = "flex";
  }
}

//save level with scores(Local storage)
function saveScore(name, moves, timeLeft, level) {
  let leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  const score = (timeLeft * 10) - (moves * 2);

  leaderboard.push({
    name: name || "Player",
    score: score,
    moves: moves,
    time: timeLeft,
    level: level   
  });

  leaderboard.sort((a, b) => b.score - a.score);

  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
}

/*Learderboard FuNction*/
function loadLeaderboard(selectedLevel = "easy") {
  const list = document.getElementById("leaderboardList");
  if (!list) return;

  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];

  const filtered = leaderboard.filter(p => p.level === selectedLevel);

  list.innerHTML = "";

 filtered.slice(0, 10).forEach((player, index) => {
  const li = document.createElement("li");

  if (index === 0) {
    li.classList.add("first-place");
  } //first place user in leaderboard

  const min = String(Math.floor(player.time / 60)).padStart(2, "0");
  const sec = String(player.time % 60).padStart(2, "0");

  li.innerHTML = `
    <span>${index + 1}</span>
    <span class="player">${player.name}</span>
    <span>${min}:${sec}</span>
    <span>${player.moves}</span>
    <span>${player.score}</span>
  `;

  list.appendChild(li);
});
}

function changeLevel(level) {
  document.querySelectorAll(".level-tab").forEach(btn => {
    btn.classList.remove("active");
  });

  event.target.classList.add("active");

  loadLeaderboard(level);
}

function switchLevel(level) {
  loadLeaderboard(level);
}
window.addEventListener("DOMContentLoaded", () => {
  loadLeaderboard("easy");
});


/* navigation funcitons */
function restartGame() {
  location.reload();
}

function goHome() {
  window.location.href = "index.html";
}

function playAgain() {
  window.location.href = "gameChoice.html"; 
}


/*SOUND EFFECTS*/
const winSound = document.getElementById("winSound");
const clickSound = document.getElementById("clickSound");
const loseSound = document.getElementById("loseSound");
//play click sounds
function playClick() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.volume = 0.5;
  clickSound.play();
}


/* Browser audio unlock */
document.addEventListener("click", () => {
  if (bgMusic && !musicPlaying) {
    bgMusic.volume = 0.4;
    bgMusic.play().then(() => {
      musicPlaying = true;
      if (musicBtn) musicBtn.textContent = "🔈 Music Off";
    }).catch(() => {});
  }
}, { once: true });


