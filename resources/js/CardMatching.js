const windowWidthCards = 560;
const windowHeightCards = 320;
var allCards = [];
var cardOne;
var cardTwo;
var matches = 0;

class CardMatching extends Phaser.Scene {
  constructor() {
    super('cards');
    this.cardFlipped = false;
    this.xText = null;
  }

  preload() {
    this.load.image("cardBack", "resources/assets/images/cardBack.png");
    this.load.image("sparrow", "resources/assets/images/sparrow.png");
    this.load.image("eagle", "resources/assets/images/eagle.png");
    this.load.image("penguin", "resources/assets/images/penguin.png");
    this.load.image("owl", "resources/assets/images/owl.png");
  }

  create() {
    this.cameras.main.setViewport((game.config.width - windowWidthCards) / 2, (game.config.height - windowHeightCards) / 2, windowWidthCards, windowHeightCards);
    // Shuffle the cards
    var cardImages = ["sparrow", "eagle", "penguin", "owl"];
    cardImages = Phaser.Utils.Array.Shuffle(cardImages.concat(cardImages));

    // Create the cards
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

    // Add event listener for card click
    allCards.forEach((card) => {
      card.on("pointerdown", () => {
        this.flipCard(card);
      });
    });
  }

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

  checkMatch() {
    if (!cardOne || !cardTwo) {
      // Not enough cards flipped yet, do nothing
      return;
    }

    // Disable interactivity of all cards
    allCards.forEach((card) => {
      card.disableInteractive();
    });

    if (cardOne.name === cardTwo.name) {
      // Cards match
      matches++;
      console.log(matches);
      if (matches === 4) {
        const winnerText = this.add.text(windowWidthCards / 2, windowHeightCards / 2, "Congratulations! You matched all the cards.", { font: "bold 24px Arial", fill: "#000" }).setOrigin(0.5, 0.5);
        setTimeout(() => {
          winnerText.destroy();
          this.restart();
          matches = 0;
        }, 3000);
      }
      // Reset state
      cardOne = null;
      cardTwo = null;
    } else {
      // Cards don't match
      // Show X and flip cards back after a delay
      const xText = this.add.text(cardTwo.x, cardTwo.y, "X", { font: "bold 48px Arial", fill: "#000" });
      xText.setOrigin(0.5, 0.5);
      setTimeout(() => {
        xText.destroy();
        cardOne.setTexture("cardBack");
        cardTwo.setTexture("cardBack");
        // Reset state
        cardOne = null;
        cardTwo = null;
      }, 1000);
    }

    // Re-enable interactivity of all cards
    setTimeout(() => {
      allCards.forEach((card) => {
        card.setInteractive();
      });
    }, 1000);

    this.cardFlipped = false;
  }

  restart() {
    this.scene.restart('cards')
  }
}