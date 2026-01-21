var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0078D7',
  scene: [Index, PlayGame, FloppyBird, Paint, CardMatching],
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