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

// HOW TO PLAY MODAL
function openHowToPlay() {
  document.getElementById("howToPlayModal").style.display = "flex";
}

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


/*LOAD SAVED SETTINGS*/
window.addEventListener("DOMContentLoaded", () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") document.body.classList.add("dark");
});


/* GAME PAGE LOGIC */

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

  /* CARD COUNT and Time BY LEVEL */
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

  /* GRID LAYOUT */
  if (cardCount === 8) {
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else if (cardCount === 16) {
    grid.style.gridTemplateColumns = "repeat(4, 1fr)";
  } else {
    grid.style.gridTemplateColumns = "repeat(4, 1fr)"; // 24 cards
  }

  /* SELECT SYMBOLS */
  const symbols = cardsData[category].slice(0, cardCount / 2);
  let cards = [...symbols, ...symbols];
  cards.sort(() => Math.random() - 0.5);

  let firstCard = null;
  let lockBoard = false;
  let moves = 0;
  let matchedPairs = 0;
  let remainingTime = timeLimit;

  /* CREATE CARDS */
  grid.innerHTML = "";
  cards.forEach(symbol => {
    const card = document.createElement("div");
    card.className = "card";
    card.textContent = symbol;
    card.addEventListener("click", () => flipCard(card));
    grid.appendChild(card);
  });

  /* Timer Counting section */
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
function endGame() {
    document.getElementById("finalMoves").textContent = moves;
    document.getElementById("finalTime").textContent =
      document.getElementById("time").textContent;

    document.getElementById("resultModal").style.display = "flex";

    if (winSound) {
      winSound.currentTime = 0;
      winSound.volume = 0.6;
      winSound.play();
    }
  }

  function gameOver() {
    document.getElementById("gameOverMoves").textContent = moves;
    document.getElementById("gameOverModal").style.display = "flex";
  }
}

/* NAVIGATION */
function restartGame() {
  location.reload();
}

function goHome() {
  window.location.href = "index.html";
}


/*SOUND EFFECTS*/
const winSound = document.getElementById("winSound");
const clickSound = document.getElementById("clickSound");
const loseSound = document.getElementById("loseSound");

function playClick() {
  if (!clickSound) return;
  clickSound.currentTime = 0;
  clickSound.volume = 0.5;
  clickSound.play();
}


/* BROWSER AUDIO UNLOCK */
document.addEventListener("click", () => {
  if (bgMusic && !musicPlaying) {
    bgMusic.volume = 0.4;
    bgMusic.play().then(() => {
      musicPlaying = true;
      if (musicBtn) musicBtn.textContent = "🔈 Music Off";
    }).catch(() => {});
  }
}, { once: true });