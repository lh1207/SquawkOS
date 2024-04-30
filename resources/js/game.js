/**
 * Configuration object for the Phaser game instance.
 * @type {Object}
 * @property {Phaser.AUTO} type - The type of the Phaser game, automatically determined by Phaser.
 * @property {number} width - The width of the game canvas.
 * @property {number} height - The height of the game canvas.
 * @property {string} backgroundColor - The background color of the game canvas.
 * @property {Array} scene - The array of game scenes. Includes BootGame, PlayGame, FloppyBird, Paint, CardMatching scenes.
 * @property {Object} physics - The physics configuration for the game.
 * @property {string} physics.default - The default physics system (arcade physics).
 * @property {Object} physics.arcade - The configuration for the arcade physics system.
 * @property {Object} physics.arcade.gravity - The gravity configuration for the arcade physics system.
 * @property {number} physics.arcade.gravity.y - The amount of gravity in the y (vertical) direction.
 * @property {boolean} physics.arcade.debug - Whether to enable debug mode for the arcade physics system.
 * @property {Object} input - The input configuration for the game.
 * @property {Object} input.keyboard - The keyboard input configuration.
 * @property {Window} input.keyboard.target - The target element for keyboard input.
 * @property {boolean} input.keyboard.multiKey - Whether to allow multiple key inputs at the same time.
 * @property {Object} input.mouse - The mouse input configuration.
 * @property {Window} input.mouse.target - The target element for mouse input.
 */
var config = {
  type: Phaser.AUTO,
  width: 800,
  height: 600,
  backgroundColor: '#0078D7',
  scene: [BootGame, PlayGame, FloppyBird, Paint, CardMatching],
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

/**
 * The Phaser game instance.
 * @type {Phaser.Game}
 */
var game = new Phaser.Game(config);