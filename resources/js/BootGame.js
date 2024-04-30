/**
 * This scene is the boot sequence for Windows Squawk.
 * Once the system gets through the login screen, 
 * the player will be transferred to PlayGame.js
 * @class
 * @extends Phaser.Scene
 */
class BootGame extends Phaser.Scene {
  /**
   * Constructor for BootGame class.
   * @constructor
   */
  constructor() {
    super({ key: "bootGame" });
  }

  /**
   * Preload function to load all necessary assets.
   */
  preload() {
    // Load the game assets here
  }

  /**
   * Create function to initialize the boot sequence scene.
   */
  create() {
    // Create the game objects here

    // Change from base blue background in game.js to black
    this.cameras.main.setBackgroundColor('#000000');

    // Create BIOS and BOOT text, boot timer below, text in advanceBootSequence()
    this.biosText = this.add.text(50, 50, '', { font: '32px Arial', fill: '#00ff00' });
    this.bootText = this.add.text(50, 100, '', { font: '32px Arial', fill: '#00ff00' });

    // Start the boot timer
    this.bootTimer = this.time.addEvent({
      delay: 1000,
      callback: this.advanceBootSequence,
      callbackScope: this,
      loop: true
    });

    // Create splashScreen() elements
    // Positioning via x and y axis declarations
    const centerX = this.cameras.main.centerX;
    const bottomY = this.cameras.main.height - 50;
    // Text elements with positioning declarations called
    this.splashScreen = this.add.text(centerX, bottomY - 50, '', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);
    this.trademark = this.add.text(centerX, bottomY, '', { font: '12px Arial', fill: '#fff' }).setOrigin(0.5);
  }
}