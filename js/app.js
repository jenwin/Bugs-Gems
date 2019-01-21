//score
const numScore = document.querySelector('.number-points');
const gameOver = document.querySelector('.gameover-score');
const score = document.querySelector('.score');
let totalScore = 0;

//lives
const oneLife = document.querySelector('.one-life');
const twoLives = document.querySelector('.two-lives');
const threeLives = document.querySelector('.three-lives');

//sound effects
const movesEffect = new Audio('soundeffects/moves.mp3');
const starsEffect = new Audio('soundeffects/stars.mp3');
const gemsEffect = new Audio('soundeffects/gems.mp3');
const enemyEffect = new Audio('soundeffects/enemy.mp3');
const winEffect = new Audio('soundeffects/win.mp3');
const heartEffect = new Audio('soundeffects/heart.mp3');
const gameOverEffect = new Audio('soundeffects/gameover.mp3');

//modal
const gameModal = document.querySelector('.gameover-container');
const tryAgain = document.getElementById('try-again');

//player at position, number of lives, image
class gamePlayer {
  constructor() {
    this.x = 200;
    this.y = 420;
    this.numLives = 3;
    this.sprite = 'images/char-cat-girl.png';
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  //player and enemy collision
  update() {
    for (const oneEnemy of allEnemies) {
      if (this.x < oneEnemy.x + 80 &&
        oneEnemy.x < this.x + 80 &&
        this.y < oneEnemy.y + 33 &&
        oneEnemy.y < this.y + 80) {
          enemyEffect.play();
          this.hideHearts();
          this.playerReset();
      }
          this.playerWins();
    }
  }

  /*when player collides with enemy, hide a heart
   *modal opens when player loses*/
  hideHearts() {
    this.numLives--;
    switch (this.numLives) {
      case 2:
        threeLives.style.visibility = 'hidden';
        break;
      case 1:
        twoLives.style.visibility = 'hidden';
        break;
      case 0:
        oneLife.style.visibility = 'hidden';
        gameOverEffect.play();
        modal();
        break;
    }
  }

  /*add 10 points per star collected
   *remove star when collected*/
  collectStars() {
    for (const oneStar of allStars) {
      if (this.x < oneStar.x + 70 &&
        oneStar.x < this.x + 70 &&
        this.y < oneStar.y + 70 &&
        oneStar.y < this.y + 70) {
          starsEffect.play();
          this.starPoints();
            if (oneStar === allStars[0]) {
                allStars.splice(0,1);
            } if (oneStar === allStars[1]) {
                allStars.splice(1,1);
            } if (oneStar === allStars[2]) {
                allStars.splice(2,1);
            } if (allStars.length === 0) {
                allStars = [
                  new Star(450, 300),
                  new Star(450, 300),
                  new Star(450, 300)
                ];
              }
      }
    }
  }

  /*add 50 points per purple gem collected
   *remove gem when collected*/
  collectPurpleGems() {
    for (const onePurpleGem of allPurpleGems) {
      if (this.x < onePurpleGem.x + 80 &&
        onePurpleGem.x < this.x + 80 &&
        this.y < onePurpleGem.y + 90 &&
        onePurpleGem.y < this.y + 90) {
          gemsEffect.play();
          this.purplePoints();
            if (onePurpleGem === allPurpleGems[0]) {
              allPurpleGems.splice(0,1);
            } if (onePurpleGem === allPurpleGems[1]) {
                allPurpleGems.splice(1,1);
            } if (onePurpleGem === allPurpleGems[2]) {
                allPurpleGems.splice(2,1);
            } if (allPurpleGems.length === 0) {
                allPurpleGems = [
                  new Purple(445, 300),
                  new Purple(445, 300),
                  new Purple(445, 300)
                ];
              }
      }
    }
  }

  //player collects a star, add 10 points
  starPoints() {
    totalScore = totalScore + 10;
    numScore.innerHTML = totalScore;
  }

  //player collects a purple gem, add 50 points
  purplePoints() {
    totalScore = totalScore + 50;
    numScore.innerHTML = totalScore;
  }

  /*player wins, add 100 points
   *resets game when player collides with enemy*/
  playerWins() {
    if (this.y <= 0) {
      winEffect.play();
      totalScore = totalScore + 100;
      numScore.innerHTML = totalScore;
      this.playerReset();
    }
      this.collectStars();
      this.collectPurpleGems();
  }

  //resets player position
  playerReset() {
    this.x = 200;
    this.y = 420;
  }

  /*player moves
   *prevents player from moving up when game is over*/
  handleInput(moves) {
    movesEffect.play();
    if (moves === 'left' && this.x >= 20) {
      this.x -= 46;
    } if (moves === 'up' && this.y >= 0) {
      this.y -= 46;
    } if (moves === 'right' && this.x <= 350) {
      this.x += 46;
    } if (moves === 'down' && this.y <= 400) {
      this.y += 46;
    }

    if (this.numLives === 0 &&
        this.y <= 400) {
        this.playerReset();
    }
  }
}

//enemy, image, min sets enemy at 0 on the x-axis
class Enemy {
  constructor(x,y) {
    this.x = x;
    this.y = y;
    this.min = 0;
    this.sprite = 'images/enemy-bug.png';
    this.enemySpeed = Math.floor(Math.random() * 200) + 100;
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }

  /*enemy position
   *dt parameter, a time delta between ticks
   *speed of enemy x dt parameter*/
  update(dt) {
    if (this.x < 505) {
      this.x += this.enemySpeed * dt;
    } else {
      this.x = this.min;
    }
  }
}

//stars
class Star {
  constructor(x,y) {
    this.x = Math.floor(Math.random() * x);
    this.y = Math.floor(Math.random() * y);
    this.sprite = 'images/star.png';
  }

  render() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
  }
}

//purple gems
class Purple extends Star {
  constructor(x,y) {
    super(x,y);
    this.sprite = 'images/purple-gem.png';
  }

  render() {
    super.render();
  }
}

//new player object
const player = new gamePlayer();

//new enemy object
let allEnemies = [
  new Enemy(250, 60),
  new Enemy(150, 225),
  new Enemy(100, 141)
];

//new stars object
let allStars = [
  new Star(440, 300),
  new Star(440, 300),
  new Star(440, 300)
];

//new purple gems object
let allPurpleGems = [
  new Purple(445, 300),
  new Purple(445, 300),
  new Purple(445, 300)
];

//key presses
document.addEventListener('keyup', (e) => {
  let allowedKeys = {
    37: 'left',
    38: 'up',
    39: 'right',
    40: 'down'
  }
  player.handleInput(allowedKeys[e.keyCode]);
});

//gameover modal
function modal() {
  gameModal.classList.toggle('hide-modal');
  gameOver.innerHTML = 'Score: ' + numScore.textContent;
}
modal();

/*play again button
 *resets score, life, stars, purple gems*/
const listOfHearts = document.querySelectorAll('.hearts-list i');
tryAgain.addEventListener('click', () => {
  for (let i = 0; i < listOfHearts.length; i++) {
    listOfHearts[i].style.visibility = 'visible';
  }
  player.numLives = 3;
  totalScore = 0;
  numScore.innerHTML = totalScore;
  allStars = [
    new Star(450, 300),
    new Star(450, 300),
    new Star(450, 300)
  ];
  allPurpleGems = [
    new Purple(445, 300),
    new Purple(445, 300),
    new Purple(445, 300)
  ];
  modal();
});