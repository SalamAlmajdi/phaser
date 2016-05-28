var game = new Phaser.Game(
  640,
  512,
  Phaser.AUTO,
  '',
  { preload: preload, create: create, update: update }
);

var levels = [];
var currentLevel;

function createLevelData() {

  var level;
  var enemies;

  // Level 1

  level = {};

  level.tilemapId = 'level1';
  level.tilesetImage = 'tiles';
  level.layerId = 'Tile Layer 1';
  level.collisionIds = [1,3,4];

  level.endTile = {
      x:64*5,
      y:64*3,
      id:'endTile',
  };
  level.playerStart = {
    x:64,
    y:64,
  };

  enemies = [];

  enemies.push({
    type: 'crainer',
    speed: 90,
    direction: 'vertical',
    boundary: {
      top: 64,
      bottom: 64*7,
    },
    start: {
      x: 64*2-16,
      y: 64*3-16,
    },
  });

  enemies.push({
    type: 'crainer',
    speed: 90,
    direction: 'horizontal',
    boundary: {
      left: 64,
      right: 64*9,
    },
    start: {
      x: 64*5-16,
      y: 64*6+16,
    },
  });

  enemies.push({
    type: 'crainer',
    speed: 90,
    direction: 'horizontal',
    boundary: {
      left: 64*7,
      right: 64*9,
    },
    start: {
      x: 64*7,
      y: 64 + 16,
    },
  });

  enemies.push({
    type: 'evil',
    speed: 90,
    direction: 'horizontal',
    boundary: {
      left: 64,
      right: 64*9,
      top:64,
      bottom:64*9,
    },
    start: {
      x: 64*7,
      y: 64*4,
    },
  });

  enemies.push({
    type: 'crainer',
    speed: 90,
    direction: 'horizontal',
    boundary: {
      left: 64*4,
      right: 64*6,
    },
    start: {
      x: 64*4,
      y: 64 + 16,
    },
  });

  level.enemies = enemies;

  levels.push(level);

  // Level 2

  level = {};

  level.tilemapId = 'level2';
  level.tilesetImage = 'tiles';
  level.layerId = 'Tile Layer 1';
  level.collisionIds = [1,3,4];

  level.endTile = {
  x:64*8,
  y:64*1,
  id:'endTile'
  }

  level.playerStart = {
    x:64,
    y:64,
  };

  enemies = [];

  enemies.push({
    type: 'crainer',
    speed: 200,
    direction: 'vertical',
    boundary: {
      top: 64+16,
      bottom: 64*7-16,
    },
    start: {
      x: 64*3+16,
      y: 64*3-16,
    },
  });

  level.enemies = enemies;

  levels.push(level);

}


function startLevel(levelId) {

  game.world.removeAll();

  var level = levels[levelId];

  player = game.add.sprite(level.playerStart.x, level.playerStart.y, 'player');
  game.physics.arcade.enable(player);
  player.body.collideWorldBounds = true;

  level.map = game.add.tilemap(level.tilemapId);
  level.map.addTilesetImage(level.tilesetImage, level.tilesetImage);

  level.layer = level.map.createLayer(level.layerId);
  level.layer.resizeWorld();

  level.map.setCollision(level.collisionIds);

  level.enemies.forEach(
    function(enemy) {
      enemy.sprite = game.add.sprite(enemy.start.x, enemy.start.y, enemy.type);
      game.physics.arcade.enable(enemy.sprite);
      if (enemy.direction === 'horizontal') {
        enemy.sprite.body.velocity.x = enemy.speed;
      }
      if (enemy.direction === 'vertical') {
        enemy.sprite.body.velocity.y = enemy.speed;
      }
    }
  );

  level.endTile.sprite = game.add.sprite(level.endTile.x, level.endTile.y, level.endTile.id);

  game.physics.arcade.enable(level.endTile.sprite);

  currentLevel = level;

}

function preload() {
  game.load.image('player', 'assets/entities/player/derp-ssundee.png');
  game.load.image('crainer','assets/entities/enemies/crainer.png');
  game.load.image('evil','assets/entities/enemies/enemy-evil.jpg');

  game.load.tilemap('level1', 'assets/levels/level1.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.tilemap('level2', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
  game.load.image('tiles', 'assets/tiles/tiles.png');
  game.load.image('endTile', 'assets/entities/tiles/gold.png');

}

var PLAYER_SPEED = 95;

var player;

var gameWidth;
var gameHeight;
var cursors;
var map;
var layer;
var endTile;

function create() {

  gameWidth = game.world.width;
  gameHeight = game.world.height;

  createLevelData();

  startLevel(0);

  cursors = game.input.keyboard.createCursorKeys();

}

function enemyCollisionHandler (player, enemy) {
  console.log('CRASH');
  player.body.x = currentLevel.playerStart.x;
  player.body.y = currentLevel.playerStart.y;
}

function portalCollisionHandler (player, endTile) {
  console.log('(confetti)');
  player.body.x = currentLevel.playerStart.x;
  player.body.y = currentLevel.playerStart.y;
}

function checkCollisions(level) {
  game.physics.arcade.collide(player, level.layer);
  game.physics.arcade.overlap(player, level.endTile.sprite, portalCollisionHandler, null, this);
  level.enemies.forEach(
    function (enemy) {
      game.physics.arcade.overlap(player, enemy.sprite, enemyCollisionHandler, null, this);
    }
  );

}

function updatePlayer() {
  if (cursors.left.isDown) {
    player.body.velocity.x = -PLAYER_SPEED;
  }
  else if (cursors.right.isDown) {
    player.body.velocity.x = PLAYER_SPEED;
  }
  else {
    player.body.velocity.x = 0;
  }

  if (cursors.up.isDown) {
    player.body.velocity.y = -PLAYER_SPEED;
  }
  else if (cursors.down.isDown) {
    player.body.velocity.y = PLAYER_SPEED;
  }
  else {
    player.body.velocity.y = 0;
  }

}

function updateEnemies(level) {

  level.enemies.forEach(
    function (enemy) {
      if (enemy.direction === 'vertical') {
        if (enemy.sprite.body.y >= (enemy.boundary.bottom - enemy.sprite.height)) {
          enemy.sprite.body.velocity.y = -enemy.speed;
        }
        else if (enemy.sprite.body.y <= enemy.boundary.top) {
          enemy.sprite.body.velocity.y = enemy.speed;
        }
      }
      if (enemy.direction === 'horizontal') {
        if (enemy.sprite.body.x >= (enemy.boundary.right - enemy.sprite.width)) {
          enemy.sprite.body.velocity.x = -enemy.speed;
        }
        else if (enemy.sprite.body.x <= enemy.boundary.left) {
          enemy.sprite.body.velocity.x = enemy.speed;
        }
      }
    }
  );
}


function update() {

  updatePlayer();
  updateEnemies(currentLevel);
  checkCollisions(currentLevel);
}
