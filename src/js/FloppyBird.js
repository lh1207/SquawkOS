const windowWidth = 560;
const windowHeight = 320;

var gameOptions = {
  birdGravity: 800,
  pipeSpeed: 200,
  birdFlapPower: 300,
  pipeDistance: [220, 280],
  pipeHole: [100, 130],
};

class FloppyBird extends Phaser.Scene {
  constructor() {
    super('floppy');
  }

  preload() {
    this.load.image('bird', 'src/assets/images/bird.png');
    this.load.image('pipe', 'src/assets/images/pipe.png');
  }

  create() {
    // Calculate viewport offset to center the game window
    this.viewportX = (game.config.width - windowWidth) / 2;
    this.viewportY = (game.config.height - windowHeight) / 2;

    this.cameras.main.setViewport(this.viewportX, this.viewportY, windowWidth, windowHeight);

    // The viewport shows world coords from viewportY to viewportY + windowHeight
    // We want the bird centered in the viewport
    const worldCenterY = this.viewportY + windowHeight / 2;

    this.pipeGroup = this.physics.add.group();
    this.pipePool = [];

    // Create initial pipe pool (enough for recycling)
    for (let i = 0; i < 8; i++) {
      let pipe = this.pipeGroup.create(-100, -100, 'pipe');
      pipe.body.allowGravity = false;
      pipe.body.immovable = true;
      this.pipePool.push(pipe);
    }

    // Place initial pipes
    this.nextPipeX = windowWidth + this.viewportX;
    this.placePipes();
    this.placePipes();

    // Create bird at left side of viewport, vertically centered
    this.bird = this.physics.add.sprite(this.viewportX + 80, worldCenterY, 'bird');
    this.bird.body.gravity.y = gameOptions.birdGravity;
    this.bird.setCollideWorldBounds(false);

    // Flap on space
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE).on('down', this.flap, this);

    // Collision with pipes
    this.physics.add.collider(this.bird, this.pipeGroup, this.die, null, this);
  }

  placePipes() {
    if (this.pipePool.length < 2) return;

    let pipeHoleHeight = Phaser.Math.Between(gameOptions.pipeHole[0], gameOptions.pipeHole[1]);

    // Random hole position within the visible viewport area (with padding)
    const padding = 50;
    const minY = this.viewportY + padding + pipeHoleHeight / 2;
    const maxY = this.viewportY + windowHeight - padding - pipeHoleHeight / 2;
    let pipeHolePosition = Phaser.Math.Between(minY, maxY);

    let pipeTop = this.pipePool.pop();

    // Top pipe: bottom edge at top of hole
    pipeTop.x = this.nextPipeX;
    pipeTop.y = pipeHolePosition - pipeHoleHeight / 2;
    pipeTop.setOrigin(0, 1);
    pipeTop.body.velocity.x = -gameOptions.pipeSpeed;
    pipeTop.setActive(true);
    pipeTop.setVisible(true);

    // Bottom pipe: top edge at bottom of hole
    let pipeBottom = this.pipePool.pop();
    pipeBottom.x = this.nextPipeX;
    pipeBottom.y = pipeHolePosition + pipeHoleHeight / 2;
    pipeBottom.setOrigin(0, 0);
    pipeBottom.body.velocity.x = -gameOptions.pipeSpeed;
    pipeBottom.setActive(true);
    pipeBottom.setVisible(true);

    // Schedule next pipe
    this.nextPipeX += Phaser.Math.Between(gameOptions.pipeDistance[0], gameOptions.pipeDistance[1]);
  }

  flap() {
    this.bird.body.velocity.y = -gameOptions.birdFlapPower;
  }

  update() {
    // Check if bird is outside viewport bounds
    const topBound = this.viewportY;
    const bottomBound = this.viewportY + windowHeight;

    if (this.bird.y < topBound || this.bird.y > bottomBound) {
      this.die();
      return;
    }

    // Recycle pipes that have gone off screen
    this.pipeGroup.getChildren().forEach((pipe) => {
      if (pipe.active && pipe.x + pipe.width < this.viewportX) {
        pipe.body.velocity.x = 0;
        pipe.setActive(false);
        pipe.setVisible(false);
        pipe.x = -100;
        this.pipePool.push(pipe);
      }
    });

    // Spawn new pipes when needed
    const rightmostPipe = this.getRightmostPipe();
    if (rightmostPipe < this.viewportX + windowWidth + 100) {
      this.placePipes();
    }
  }

  getRightmostPipe() {
    let rightmost = 0;
    this.pipeGroup.getChildren().forEach((pipe) => {
      if (pipe.active) {
        rightmost = Math.max(rightmost, pipe.x);
      }
    });
    return rightmost;
  }

  die() {
    this.scene.restart();
  }
}
