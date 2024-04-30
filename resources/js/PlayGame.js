/**
 * PlayGame class extends Phaser.Scene to create a game scene.
 * @class
 * @extends Phaser.Scene
 */
class PlayGame extends Phaser.Scene {
  /**
   * Constructor for PlayGame class.
   * @constructor
   */
  constructor() {
    super("playGame");
  }

  /**
   * Preload function to load all necessary assets.
   */
  preload() {
    // Load icon images
    this.load.image('x', 'resources/assets/icons/x.png')
    this.load.image('floppy', 'resources/assets/icons/floppy.png');
    this.load.image('paint', 'resources/assets/icons/paint.png');
    this.load.image('cards', 'resources/assets/icons/cards.png');
    this.load.image('taskbar', 'resources/assets/images/taskbar.png')
    this.load.image('startButton', 'resources/assets/images/startButton.png')
    this.load.image('startButtonPressed', 'resources/assets/images/startButtonPressed.png')
    this.load.image('startMenu', 'resources/assets/images/startMenu.png')
    this.load.image('shutdown', 'resources/assets/icons/shutdown.png')
    this.load.audio('startup', 'resources/assets/sounds/startup.mp3')
    this.load.audio('squawk', 'resources/assets/sounds/squawk.ogg')
  }

  /**
   * Create function to initialize the game scene.
   */
  create() {
    this.sound.play('startup');

    // Set Windows desktop background color
    this.cameras.main.setBackgroundColor('#3b6ea5'); // Windows 2000 color

    // Define centerX and centerY
    const { width, height } = this.scale;
    const centerX = width * 0.5;
    const centerY = height * 0.5;

    // Add desktop shell
    let taskbarImage = this.add.image(this.scale.width, this.scale.height, 'taskbar')
    taskbarImage.setOrigin(1, 1);

    let startButton = this.add.image(0, this.scale.height, 'startButton').setOrigin(0, 1);
    startButton.setInteractive();

    startButton.on('pointerdown', function () {
      startButton.setTexture('startButtonPressed');
      this.sound.play('squawk');
    });
  }
}