var game = new Phaser.Game(
  800,
  400,
  Phaser.AUTO,
  '',
  { preload: preload, create: create, update: update }
);

function preload() {
  game.load.image('start', 'assets/images/start.jpg');
  game.load.image('background', 'assets/images/background.jpg');
  game.load.image('doorLeftClosed', 'assets/images/door-left-closed.jpg');
  game.load.image('doorLeftOpen', 'assets/images/door-left-open.jpg');
  game.load.image('doorRightClosed', 'assets/images/door-right-closed.jpg');
  game.load.image('doorRightOpen', 'assets/images/door-right-open.jpg');
  game.load.image('win', 'assets/images/win.jpg');
  game.load.image('bars', 'assets/images/bars.png');

  game.load.image('q1', 'assets/questions/q1.png');
  game.load.image('q2', 'assets/questions/q2.png');
  game.load.image('q3', 'assets/questions/q3.png');
  game.load.image('q4', 'assets/questions/q4.png');
  game.load.image('q5', 'assets/questions/q5.png');
  game.load.image('q6', 'assets/questions/q6.png');
  game.load.image('q7', 'assets/questions/q7.png');
  game.load.image('q8', 'assets/questions/q8.png');
  game.load.image('q9', 'assets/questions/q9.png');
  game.load.image('q10', 'assets/questions/q10.png');

  game.load.audio('play', 'assets/sounds/Robot_blip-Marianne_Gagnon-120342607.wav');
  game.load.audio('doorOpen', 'assets/sounds/Metal-Bang-SoundBible.com-672025076.wav');
  game.load.audio('gameFail', 'assets/sounds/Close-Vault-Or-Jail-Door-SoundBible.com-1221913084.wav');
  game.load.audio('gameWin', 'assets/sounds/One-Piece-Franky-Theme-EXTENDED-Long-Version.mp3');

}

var DOOR_LEFT_X = 148;
var DOOR_LEFT_Y = 71;
var DOOR_RIGHT_X = 544;
var DOOR_RIGHT_Y = 71;
var DOOR_WIDTH = 108;
var DOOR_HEIGHT = 220;

function isPointInRectangle(px,py,rx1,ry1,rx2,ry2){
  return px>=rx1 && px<=rx2 && py>=ry1 && py<=ry2;
}

var doorLeftClosed;
var doorLeftOpen;
var doorRightOpen;
var doorRightClosed;
var bars;
var win;
var start;

var YES = true;
var NO = false;

var questions = [];
var currentQuestionIndex = 0;

function addQuestion(image, answer) {

  var question = {};
  question.sprite = game.add.sprite(0, 0, image);
  question.answer = answer;

  question.sprite.visible = false;

  questions.push(question);

}

var gameWon = false;
var gameLost = false;

function goToNextQuestion() {
  currentQuestionIndex = currentQuestionIndex + 1;
  if (currentQuestionIndex === questions.length) {
    gameWon = true;
  }
}

// Left Door = YES
function doorLeftClicked() {
  var currentQuestion = questions[currentQuestionIndex];
  if (currentQuestion.answer === YES) {
    goToNextQuestion();
  }
  else {
    gameLost = true;
  }
}

// Right Door = NO
function doorRightClicked() {
  var currentQuestion = questions[currentQuestionIndex];
  if (currentQuestion.answer === NO) {
    goToNextQuestion();
  }
  else {
    gameLost = true;
  }
}

function startGameClicked() {
  start.visible = false;
  game.sound.play('play');
}

function create() {

  var gameWidth = game.world.width;
  var gameHeight = game.world.height;

  game.add.sprite(0, 0, 'background');

  doorLeftClosed = game.add.sprite(DOOR_LEFT_X, DOOR_LEFT_Y, 'doorLeftClosed');
  doorRightClosed = game.add.sprite(DOOR_RIGHT_X, DOOR_RIGHT_Y, 'doorRightClosed');

  doorLeftOpen = game.add.button(DOOR_LEFT_X, DOOR_LEFT_Y, 'doorLeftOpen', doorLeftClicked);
  doorRightOpen = game.add.button(DOOR_RIGHT_X, DOOR_RIGHT_Y, 'doorRightOpen', doorRightClicked);

  addQuestion('q1', NO);
  addQuestion('q2', YES);
  addQuestion('q3', NO);
  addQuestion('q4', YES);
  addQuestion('q5', YES);
  addQuestion('q6', NO);
  addQuestion('q7', YES);
  addQuestion('q8', YES);
  addQuestion('q9', NO);
  addQuestion('q10', YES);

  win = game.add.sprite(0, 0, 'win');
  bars = game.add.sprite(0, 0, 'bars');
  start = game.add.button(0, 0, 'start', startGameClicked);

  win.visible = false;
  bars.visible = false;

}

function showQuestion(index){
  for (var i = 0; i < questions.length; i++) {
    questions[i].sprite.visible = false;
  }
  var currentQuestion = questions[index];
  currentQuestion.sprite.visible = true;
}

function gameEnded() {
  doorLeftOpen.visible = false;
  doorRightOpen.visible = false;
}

function showGameWon() {
  win.visible = true;
  gameEnded();
}

function showGameLost() {
  bars.visible = true;
  gameEnded();
}

var allowLeftDoorOpenSound = true;
var allowRightDoorOpenSound = true;
var allowGameFailSound = true;
var allowGameWinSound = true;

function update() {

  if (gameWon) {
    if (allowGameWinSound) {
      game.sound.play('gameWin');
      allowGameWinSound = false;
    }
    showGameWon();
    return;
  }

  if (gameLost) {
    if (allowGameFailSound) {
      game.sound.play('gameFail');
      allowGameFailSound = false;
    }
    showGameLost();
    return;
  }

  showQuestion(currentQuestionIndex);

  var mousex = game.input.activePointer.x;
  var mousey = game.input.activePointer.y;

  var rx1Left = DOOR_LEFT_X;
  var rx2Left = DOOR_LEFT_X + DOOR_WIDTH;
  var ry1Left = DOOR_LEFT_Y;
  var ry2Left = DOOR_LEFT_Y + DOOR_HEIGHT;

  var isMouseOverLeftDoor = isPointInRectangle(mousex, mousey, rx1Left, ry1Left, rx2Left, ry2Left);

  if (isMouseOverLeftDoor) {
    if (allowLeftDoorOpenSound && start.visible === false) {
      game.sound.play('doorOpen');
      allowLeftDoorOpenSound = false;
    }
  }
  else {
    allowLeftDoorOpenSound = true;
  }

  doorLeftOpen.visible = isMouseOverLeftDoor;

  var rx1Right = DOOR_RIGHT_X;
  var rx2Right = DOOR_RIGHT_X + DOOR_WIDTH;
  var ry1Right = DOOR_RIGHT_Y;
  var ry2Right = DOOR_RIGHT_Y + DOOR_HEIGHT;

  var isMouseOverRightDoor = isPointInRectangle(mousex, mousey, rx1Right, ry1Right, rx2Right, ry2Right);

  if (isMouseOverRightDoor) {
    if (allowRightDoorOpenSound && start.visible === false) {
      game.sound.play('doorOpen');
      allowRightDoorOpenSound = false;
    }
  }
  else {
    allowRightDoorOpenSound = true;
  }

  doorRightOpen.visible = isMouseOverRightDoor;

}
