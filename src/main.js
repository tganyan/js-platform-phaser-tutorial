let ball;
let paddle;
let bricks;
let newBrick;
let brickInfo;
let scoreText;
let score = 0;
let lives = 3;
let livesText;
let lifeLostText;
const textStyle = { font: '18px Arial', fill: '#0095dd' };

// game functions
const initBricks = () => {
	brickInfo = {
		width: 50,
		height: 20,
		count: {
			row: 3,
			 col: 7
		},
		offset: {
			top: 50,
			left: 60
		},
		padding: 10
	};

	bricks = game.add.group();

	for (col = 0; col < brickInfo.count.col; col++) {
		for (row = 0; row < brickInfo.count.row; row++) {
			const brickX = (col * (brickInfo.width + brickInfo.padding)) + brickInfo.offset.top;
			const brickY = (row * (brickInfo.height + brickInfo.padding)) + brickInfo.offset.left;
			newBrick = game.add.sprite(brickX, brickY, 'brick');
			game.physics.enable(newBrick, Phaser.Physics.ARCADE);
			newBrick.body.immovable = true;
			newBrick.anchor.set(0.5);
			bricks.add(newBrick);
		}
	}
}

const ballHitBrick = (ball, brick) => {
	brick.kill();
	score += 10;
	scoreText.setText(`Points: ${score}`);

	let countAlive = 0;

	for(i = 0; i < bricks.children.length; i++) {
		if (bricks.children[i].alive === true) {
			countAlive++;
		}
	}

	if (countAlive === 0) {
		alert('You win, congrats!');
		location.reload();
	}
}

const ballLeaveScreen = () => {
	lives--;

	if (lives) {
		livesText.setText(`Lives: ${lives}`);
		lifeLostText.visible = true;
		ball.reset(game.world.width * 0.5, game.world.height - 25);
		paddle.reset(game.world.width * 0.5, game.world.height - 5);
		game.input.onDown.addOnce(() => {
			lifeLostText.visible = false;
			ball.body.velocity.set(150, -150);
		}, this);
	} else {
		alert('You lost, game over!');
		location.reload();
	}
}

const preload = () => {
	game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
	game.scale.pageAlignHorizontally = true;
	game.scale.PageAlignVertically = true;
	game.stage.backgroundColor = '#eee';
	game.load.image('ball', '../img/ball.png');
	game.load.image('paddle', '../img/paddle.png');
	game.load.image('brick', '../img/brick.png');
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
	ball.events.onOutOfBounds.add(ballLeaveScreen, this);

	game.physics.enable(paddle, Phaser.Physics.ARCADE);
	paddle.body.immovable = true;
	initBricks();

	scoreText = game.add.text(5, 5, 'Points: 0', textStyle);

	livesText = game.add.text(game.world.width - 5, 5, `Lives: ${lives}`, textStyle);
	livesText.acnhor.set(1, 0);
	lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, click to continue', textStyle);
	lifeLostText.anchor.set(0.5);
	lifeLostText.visible = false;
};

const update = () => {
	game.physics.arcade.collide(ball, paddle);
	game.physics.arcade.collide(ball, bricks, ballHitBrick);
	paddle.x = game.input.x || game.world.width * 0.5;
};

const game = new Phaser.Game(480, 320, Phaser.CANVAS, null, {
	preload: preload, create: create, update: update
});