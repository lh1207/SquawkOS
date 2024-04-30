/**
 * Width of the window for cards.
 * @type {number}
 */
const windowWidthCards = 560;

/**
 * Height of the window for cards.
 * @type {number}
 */
const windowHeightCards = 320;

/**
 * Array to store all cards.
 * @type {Array}
 */
var allCards = [];

/**
 * First selected card.
 * @type {Object}
 */
var cardOne;

/**
 * Second selected card.
 * @type {Object}
 */
var cardTwo;

/**
 * Number of matches made.
 * @type {number}
 */
var matches = 0;

/**
 * Class representing a card matching game.
 * @extends Phaser.Scene
 */
class CardMatching extends Phaser.Scene {
  /**
   * Create a CardMatching.
   */
  constructor() {
    super('cards');
    this.cardFlipped = false;
    this.xText = null;
  }

  /**
   * Preload the images for the game.
   */
  preload() {
    this.load.image("cardBack", "resources/assets/images/cardBack.png");
    this.load.image("sparrow", "resources/assets/images/sparrow.png");
    this.load.image("eagle", "resources/assets/images/eagle.png");
    this.load.image("penguin", "resources/assets/images/penguin.png");
    this.load.image("owl", "resources/assets/images/owl.png");
  }

  /**
   * Create the game scene, shuffle and create the cards.
   */
  create() {
    this.cameras.main.setViewport((game.config.width - windowWidthCards) / 2, (game.config.height - windowHeightCards) / 2, windowWidthCards, windowHeightCards);
    var cardImages = ["sparrow", "eagle", "penguin", "owl"];
    cardImages = Phaser.Utils.Array.Shuffle(cardImages.concat(cardImages));

    const cardWidth = 120;
    const cardHeight = 150;
    const xSpacing = 10;
    const ySpacing = 10;
    const xOffset = 80;
    const yOffset = 80;

    for (var i = 0; i < 4; i++) {
      for (var j = 0; j < 2; j++) {
        var card = this.add.sprite(xOffset + i * (cardWidth + xSpacing), yOffset + j * (cardHeight + ySpacing), "cardBack").setInteractive();
        card.name = cardImages[i * 2 + j];
        allCards.push(card);
      }
    }

    allCards.forEach((card) => {
      card.on("pointerdown", () => {
        this.flipCard(card);
      });
    });
  }

  /**
   * Flip the card and check for a match if two cards are flipped.
   * @param {Object} card - The card to flip.
   */
  flipCard(card) {
    card.setTexture(card.name);

    if (!this.cardFlipped) {
      this.cardFlipped = true;
      cardOne = card;
      return;
    }

    cardTwo = card;
    this.checkMatch();
  }

  /**
   * Check if the two selected cards match.
   */
  checkMatch() {
    if (!cardOne || !cardTwo) {
      return;
    }

    allCards.forEach((card) => {
      card.disableInteractive();
    });

    if (cardOne.name === cardTwo.name) {
      matches++;
      if (matches === 4) {
        const winnerText = this.add.text(windowWidthCards / 2, windowHeightCards / 2, "Congratulations! You matched all the cards.", { font: "bold 24px Arial", fill: "#000" }).setOrigin(0.5, 0.5);
        setTimeout(() => {
          winnerText.destroy();
          this.restart();
          matches = 0;
        }, 3000);
      }
      cardOne = null;
      cardTwo = null;
    } else {
      const xText = this.add.text(cardTwo.x, cardTwo.y, "X", { font: "bold 48px Arial", fill: "#000" });
      xText.setOrigin(0.5, 0.5);
      setTimeout(() => {
        xText.destroy();
        cardOne.setTexture("cardBack");
        cardTwo.setTexture("cardBack");
        cardOne = null;
        cardTwo = null;
      }, 1000);
    }

    setTimeout(() => {
      allCards.forEach((card) => {
        card.setInteractive();
      });
    }, 1000);

    this.cardFlipped = false;
  }

  /**
   * Restart the game.
   */
  restart() {
    this.scene.restart('cards')
  }
}
