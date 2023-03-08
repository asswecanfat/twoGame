// player对象生成器
function getPlayer(id, score, nowScore, win) {
  return {
    playerID: id,
    score: score,
    haveScore: 0,
    nowScore: nowScore,
    haveNowScore: 0,
    win: win,

    activeSwitch: function () {
      this.playerID.classList.toggle("player-active");
    },

    addScore: function (haveNowScore) {
      this.haveScore += haveNowScore;
      this.score.textContent = this.haveScore;
    },
    resetScore: function () {
      this.addScore(-1 * this.haveScore);
    },

    addNowScore: function (nowScore) {
      this.haveNowScore += nowScore;
      this.nowScore.textContent = this.haveNowScore;
    },

    resetNowScore: function () {
      this.addNowScore(-1 * this.haveNowScore);
    },

    winShow: function () {
      this.win.style.animation = "winAnimeta 0.3s linear forwards";
    },

    winReset: function () {
      this.win.style.animation = "";
    },
  };
}

const startNew = document.querySelector(".startNew");
const rollDice = document.querySelector(".rollDice");
const hole = document.querySelector(".hole");
const dice = document.querySelector(".diceBox");
const diceFace = document.querySelectorAll(".diceBox > div");

const player1 = getPlayer(
  document.querySelector(".player1"),
  document.getElementById("score1"),
  document.getElementById("nowScore1"),
  document.querySelector(".win1")
);

const player2 = getPlayer(
  document.querySelector(".player2"),
  document.getElementById("score2"),
  document.getElementById("nowScore2"),
  document.querySelector(".win2")
);
const playGround = {
  player: [player1, player2],
  activeIndex: 0,
  maxScore: 5,

  exchangeActive: function () {
    this.getActivePlayer().activeSwitch();
    // 为0时不清除
    if (this.player[this.activeIndex].haveNowScore)
      this.player[this.activeIndex].resetNowScore();
    this.activeIndex = 1 - this.activeIndex;
    this.getActivePlayer().activeSwitch();
  },
  getActivePlayer: function () {
    return this.player[this.activeIndex];
  },
  resetPlayerData: function () {
    for (let i = 0; i < this.player.length; i++) {
      // this.player[i].haveScore = this.player[i].haveNowScore = 0;
      this.player[i].resetNowScore();
      this.player[i].resetScore();
      this.player[i].winReset();
    }

    if (this.activeIndex === 1) {
      // 当其为0为player1
      this.exchangeActive();
    }
  },
  whoWin: function () {
    const overflow = (player) => {
      if (player.haveScore > this.maxScore) {
        player.winShow();
        return true;
      }
      return false;
    };
    console.log(overflow(this.player[0]) || overflow(this.player[1]));
    return overflow(this.player[0]) || overflow(this.player[1]);
  },
};

const reNewGame = () => {
  playGround.resetPlayerData();
  if (!dice.classList.contains("hidden")) dice.classList.add("hidden");
};

const getDice = () => {
  const randDice = () => {
    return Math.ceil(Math.random() * 6);
  };

  const cleanZIndex = () => {
    for (let i = 0; i < diceFace.length; i++) {
      diceFace[i].style.zIndex = "1";
    }
  };

  cleanZIndex();
  const player = playGround.getActivePlayer();
  const tempS = randDice();

  if (dice.classList.contains("hidden")) dice.classList.remove("hidden");
  diceFace[tempS - 1].style.zIndex = "2";
  if (tempS === 1) {
    playGround.exchangeActive();
  } else player.addNowScore(tempS);
};

const addS = () => {
  const player = playGround.getActivePlayer();
  player.addScore(player.haveNowScore);
  if (!playGround.whoWin()) playGround.exchangeActive();
};

startNew.addEventListener("click", reNewGame);
rollDice.addEventListener("click", getDice);
hole.addEventListener("click", addS);
