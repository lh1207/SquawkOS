/**
 * The width of the game window.
 * @type {number}
 */
const windowWidth = 560;

/**
 * The height of the game window.
 * @type {number}
 */
const windowHeight = 320;

/**
 * The game options for the Floppy Bird game.
 * @type {Object}
 */
var gameOptions = {
  birdGravity: 800,
  birdSpeed: 10,
  birdFlapPower: 300,
  minPipeHeight: 50,
  pipeDistance: [400, 280],
  pipeHole: [75, 100],
};

/**
 * The Floppy Bird game class.
 * @extends Phaser.Scene
 */
class FloppyBird extends Phaser.Scene {
  /**
   * The constructor for the Floppy Bird game class.
   */
  constructor() {
    super('floppy');
  }

  /**
   * Preload the game assets.
   */
  preload() {
    this.load.image('bird', 'resources/assets/images/bird.png');
    this.load.image('pipe', 'resources/assets/images/pipe.png');
  }

  /**
   * Create the game scene.
   */
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

  /**
   * Place the pipes in the game scene.
   */
  placePipes() {
    let rightmost = this.getRightmostPipe();
    let pipeHoleHeight = Phaser.Math.Between(gameOptions.pipeHole[0], gameOptions.pipeHole[1]);
    let pipeHolePosition = game.config.height / 2;
    let pipeTop = this.pipePool.pop();
    pipeTop.x = rightmost + pipeTop.getBounds().width + Phaser.Math.Between(gameOptions.pipeDistance[0], gameOptions.pipeDistance[1]);
    pipeTop.y = pipeHolePosition - pipeHoleHeight / 2;
    pipeTop.setOrigin(0, 1);
    let pipeBottom = this.pipePool.pop();
    pipeBottom.x = pipeTop.x;
    pipeBottom.y = pipeHolePosition + pipeHoleHeight / 2;
    pipeBottom.setOrigin(0, 0);
    this.pipeGroup.addMultiple([pipeTop, pipeBottom]);
  }

  /**
   * Make the bird flap its wings.
   */
  flap() {
    this.bird.body.velocity.y = -gameOptions.birdFlapPower;
  }

  /**
   * Update the game scene.
   */
  update() {
    this.physics.world.collide(this.bird, this.pipeGroup, function () {
      this.die();
    }, null, this);

    if (this.bird.y > game.config.height || this.bird.y < 0) {
      this.die();
    }

    this.pipeGroup.getChildren().forEach(function (pipe) {
      pipe.body.immovable = true;
      pipe.x -= 2;
      pipe.setVelocityY(-gameOptions.birdSpeed, 0, 0);

      if (pipe.getBounds().right < 0) {
        this.pipePool.push(pipe);

        if (this.pipePool.length == 2) {
          this.placePipes(true);
        }
      }
    }, this);
  }

  /**
   * Get the rightmost pipe in the game scene.
   * @return {number} The x-coordinate of the rightmost pipe.
   */
  getRightmostPipe() {
    let rightmostPipe = 0;
    this.pipeGroup.getChildren().forEach(function (pipe) {
      rightmostPipe = Math.max(rightmostPipe, pipe.x);
    });
    return rightmostPipe;
  }

  /**
   * End the game.
   */
  die() {
    this.scene.start('floppy');
  }
}