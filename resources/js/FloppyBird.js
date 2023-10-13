const windowWidth = 560;
const windowHeight = 320;

var gameOptions = {
  birdGravity: 800,
  birdSpeed: 10,
  birdFlapPower: 300,
  minPipeHeight: 50,
  pipeDistance: [400, 280],
  pipeHole: [75, 100],
};

class FloppyBird extends Phaser.Scene {
  constructor() {
    super('floppy');
  }
  preload() {
    this.load.image('bird', 'resources/assets/images/bird.png');
    this.load.image('pipe', 'resources/assets/images/pipe.png');
  }
  create() {
    this.cameras.main.setViewport((game.config.width - windowWidth) / 2, (game.config.height - windowHeight) / 2, windowWidth, windowHeight);
    this.pipeGroup = this.physics.add.group();
    this.pipePool = [];
    for (let i = 0; i < 64; i++) {
      this.pipeGroup.y = -50;
      this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'));
      this.pipePool.push(this.pipeGroup.create(0, 0, 'pipe'));
      this.placePipes(false);
    }
    this.pipeGroup.setVelocityX(-gameOptions.birdSpeed);
    this.bird = this.physics.add.sprite(80, game.config.height / 2, 'bird');
    this.bird.body.gravity.y = gameOptions.birdGravity;
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', this.flap, this);
  }

  placePipes() {
    // Get the rightmost pipe in the group
    let rightmost = this.getRightmostPipe();

    // Choose a random pipe hole height and position
    let pipeHoleHeight = Phaser.Math.Between(gameOptions.pipeHole[0], gameOptions.pipeHole[1]);
    let pipeHolePosition = game.config.height / 2;
    // Remove pipes from the pool and position them
    let pipeTop = this.pipePool.pop();
    pipeTop.x = rightmost + pipeTop.getBounds().width + Phaser.Math.Between(gameOptions.pipeDistance[0], gameOptions.pipeDistance[1]);
    pipeTop.y = pipeHolePosition - pipeHoleHeight / 2;
    pipeTop.setOrigin(0, 1);

    let pipeBottom = this.pipePool.pop();
    pipeBottom.x = pipeTop.x;
    pipeBottom.y = pipeHolePosition + pipeHoleHeight / 2;
    pipeBottom.setOrigin(0, 0);

    // Add pipes back to the group
    this.pipeGroup.addMultiple([pipeTop, pipeBottom]);
  }

  flap() {
    this.bird.body.velocity.y = -gameOptions.birdFlapPower;
  }


  update() {
    this.physics.world.collide(this.bird, this.pipeGroup, function () {
      this.die();
    }, null, this);

    if (this.bird.y > game.config.height || this.bird.y < 0) {
      this.die();
    }

    this.pipeGroup.getChildren().forEach(function (pipe) {
      // Set the y position of the pipe to its current y position to prevent it from moving up or down
      pipe.body.immovable = true;

      // Move the pipe to the left on the x-axis
      pipe.x -= 2;
      pipe.setVelocityY(-gameOptions.birdSpeed, 0, 0);

      if (pipe.getBounds().right < 0) {
        // If the pipe has moved off the screen, add it back to the pool
        this.pipePool.push(pipe);

        // If the pipe pool has two pipes, place them on the screen
        if (this.pipePool.length == 2) {
          this.placePipes(true);
        }
      }
    }, this);
  }


  getRightmostPipe() {
    let rightmostPipe = 0;
    this.pipeGroup.getChildren().forEach(function (pipe) {
      rightmostPipe = Math.max(rightmostPipe, pipe.x);
    });
    return rightmostPipe;
  }

  die() {
    this.scene.start('floppy');
  }
}