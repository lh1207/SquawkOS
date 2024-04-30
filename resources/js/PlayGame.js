/**
 * This class represents the PlayGame scene in the game.
 * @extends Phaser.Scene
 */
class PlayGame extends Phaser.Scene {
  /**
   * The constructor for the PlayGame class.
   */
  constructor() {
    super("playGame");
  }

  /**
   * Preload function to load the game assets.
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
    this.load.image('shutdown', 'resources/assets/icons/shutdown.png')
    this.load.audio('startup', 'resources/assets/sounds/startup.mp3')
    this.load.audio('squawk', 'resources/assets/sounds/squawk.ogg')
  }

  /**
   * Create function to create the game objects.
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
      {
        setTimeout(() => {
          startButton.setTexture('startButton');
        }, 1000);
      }
    }.bind(this));

    // Add desktop icons
    const iconPadding = 10;
    const iconWidth = 80;
    const iconHeight = 80;
    let iconStartX = 30;
    let iconStartY = 15;

    let floppyIcon = this.add.image(iconStartX, iconStartY, 'floppy').setOrigin(0);
    floppyIcon.setScale(iconWidth / floppyIcon.width, iconHeight / floppyIcon.height);
    iconStartY += iconHeight + iconPadding;

    let floppyText = this.add.text(iconStartX + iconWidth / 2, iconStartY, 'Floppy Bird', { font: '18px Arial', fill: '#FFFFFF' });
    floppyText.setOrigin(0.5);
    iconStartY += floppyText.height + iconPadding;

    let paintIcon = this.add.image(iconStartX, iconStartY, 'paint').setOrigin(0);
    paintIcon.setScale(iconWidth / paintIcon.width, iconHeight / paintIcon.height);
    iconStartY += iconHeight + iconPadding;

    let paintText = this.add.text(iconStartX + iconWidth / 2, iconStartY, 'Paint', { font: '18px Arial', fill: '#FFFFFF' });
    paintText.setOrigin(0.5);
    iconStartY += paintText.height + iconPadding;

    let cardsIcon = this.add.image(iconStartX, iconStartY, 'cards').setOrigin(0);
    cardsIcon.setScale(iconWidth / cardsIcon.width, iconHeight / cardsIcon.height);
    iconStartY += iconHeight + iconPadding;

    let cardsText = this.add.text(iconStartX + iconWidth / 2, iconStartY, 'Card Matching', { font: '18px Arial', fill: '#FFFFFF' });
    cardsText.setOrigin(0.5);

    const self = this;

    // Add event listener to icons
    [floppyIcon, paintIcon, cardsIcon].forEach(icon => {
      icon.setInteractive();

      // Use flag to track if icon has been single clicked
      let singleClicked = false;

      icon.on('pointerdown', function (pointer) {
        // Double click
        if (singleClicked) {
          singleClicked = false;
          icon.clearTint();
          const gameKey = this.texture.key; // scene id in all scene js file must console.log below for their respective icons.
          const gameName = gameKey.charAt(0).toUpperCase() + gameKey.slice(1); // gameKey but UPPERCASE
          const windowWidth = 600;
          const windowHeight = 400;
          const centerX = self.cameras.main.centerX;
          const centerY = self.cameras.main.centerY;

          // Window for game to run in
          const gameWindow = self.add.container(centerX, centerY, [
            self.add.rectangle(0, 0, windowWidth, windowHeight, 0xFD6A01),
            self.add.text(-windowWidth / 2 + 10, -windowHeight / 2 + 10, gameName, { font: '28px Arial', fill: '#000000' }).setOrigin(0, 0),
            self.add.image(windowWidth / 2 - 30, -windowHeight / 2 + 30, 'x').setScale(0.5).setInteractive().on('pointerdown', function () {
              gameWindow.destroy();
              rectangle.destroy();
              self.scene.stop(gameKey);
            })
          ]);

          const gameScene = self.scene.launch(gameKey, { x: 100, y: 100, width: 300, height: 400 });
          const rectangle = self.add.rectangle(0, 0, windowWidth - 40, windowHeight - 80, 0xFFFFFF).setOrigin(0.5).setPosition(gameWindow.x, gameWindow.y);

          if (gameScene && gameScene.events) {
            gameScene.events.on('create', () => {
              const centerX = rectangle.getCenter().x;
              const centerY = rectangle.getCenter().y;
              gameScene.scene.get(gameKey).cameras.main.setPosition(centerX, centerY);
            });
          }

          // Single click
        } else {
          singleClicked = true;
          icon.setTint(0x0000ff);
          // EventListner for resetting icon tint
          document.addEventListener('click', function (event) {
            // Check if event happened outside of tinted icon
            if (!icon.getBounds().contains(event.clientX, event.clientY)) {
              // reset tint
              icon.clearTint();
              singleClicked = false;
            }
          })
        }
      });
    });
  }
}