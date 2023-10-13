// This scene is the boot sequence for Windows Squawk
// Once the system gets through the login screen, 
// the player will be transferred to Scene2

class BootGame extends Phaser.Scene {
  constructor() {
    super({ key: "bootGame" });
  }

  preload() {
    // Load the game assets here
  }

  create() {
    // Create the game objects here

    this.cameras.main.setBackgroundColor('#000000'); // change from base blue bkg in game.js to black

    // create BIOS and BOOT text, boot timer below, text in advanceBootSequence()
    this.biosText = this.add.text(50, 50, '', { font: '32px Arial', fill: '#00ff00' });
    this.bootText = this.add.text(50, 100, '', { font: '32px Arial', fill: '#00ff00' });

    // Start the boot timer
    this.bootTimer = this.time.addEvent({
      delay: 1000,
      callback: this.advanceBootSequence,
      callbackScope: this,
      loop: true
    });

    // create splashScreen() elements
    // positioning via x and y axis declarations
    const centerX = this.cameras.main.centerX;
    const bottomY = this.cameras.main.height - 50;
    // text elements with positioning declarations called
    this.splashScreen = this.add.text(centerX, bottomY - 50, '', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);
    this.trademark = this.add.text(centerX, bottomY, '', { font: '12px Arial', fill: '#fff' }).setOrigin(0.5);

    // create loginScreen() elements
    const centerY = this.cameras.main.centerY;
    this.loginText = this.add.text(centerX, centerY, '', { font: '32px Arial', fill: '#fff' }).setOrigin(0.5);

    // Define variables for the scene
    this.bootSequence = 0;
  }

  update() {
    // update the game objects here
  }

  // Advance the boot sequence and update the text
  advanceBootSequence() {
    switch (this.bootSequence) {
      case 0:
        this.biosText.setText('BIOS Version 1.0');
        this.bootText.setText('Detecting hardware...');
        break;
      case 1:
        this.bootText.setText('Initializing CPU...');
        break;
      case 2:
        this.bootText.setText('Initializing memory...');
        break;
      case 3:
        this.bootText.setText('Initializing storage...');
        break;
      case 4:
        this.bootText.setText('Loading operating system...');
        break;
      case 5:
        this.biosText.setText('');
        this.bootText.setText('');
        break;
      case 6:
        this.showSplashScreen();
        break;
      case 7:
        this.showLoginScreen();
        break;
      case 8:
        this.scene.start("playGame");
        this.bootTimer.remove();
        break;
    }

    this.bootSequence++;
  }

  showSplashScreen() {
    this.splashScreen.setText('Starting Windows...')
    this.trademark.setText('Windows Squawk®')
  }

  showLoginScreen() {
    this.splashScreen.setText('')
    //changeBackgroundColor('#0078D7');
    this.loginText.setText('Welcome!')
  }
}