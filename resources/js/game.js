var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0078D7', // set background color here
  scene: [BootGame, PlayGame, FloppyBird, Paint, CardMatching], // use the correct class names here
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false,
    },
  },
  input: {
    keyboard: {
      target: window,
      multiKey: true
    },
    mouse: {
      target: window
    }
  }
};

var game = new Phaser.Game(config);