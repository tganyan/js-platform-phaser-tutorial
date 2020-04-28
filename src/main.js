let ball;
let paddle;

// game functions
const preload = () => {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.PageAlignVertically = true;
	game.stage.backgroundColor = '#eee';
	game.load.image('ball', '../img/ball.png');
	game.load.image('paddle', '../img/paddle.png');
};

const create = () => {
	game.physics.startSystem(Phaser.Physics.ARCADE);
	ball = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'ball');
	ball.anchor.set(0.5);
	paddle = game.add.sprite(game.world.width * 0.5, game.world.height - 5, 'paddle');
	paddle.anchor.set(0.5, 1);
	game.physics.enable(ball, Phaser.Physics.ARCADE);
	ball.body.collideWorldBounds = true;
	ball.body.bounce.set(1);
	ball.body.velocity.set(150, -150);
	game.physics.arcade.checkCollision.down = false;
	ball.checkWorldBounds = true;
	ball.events.onOutOfBounds.add(() => {
		alert('Game over!');
		location.reload();
	}, this);
	game.physics.enable(paddle, Phaser.Physics.ARCADE);
	paddle.body.immovable = true;
};

const update = () => {
	game.physics.arcade.collide(ball, paddle);
	paddle.x = game.input.x || game.world.width * 0.5;
};

const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
	preload: preload, create: create, update: update
});