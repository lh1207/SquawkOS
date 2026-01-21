const windowWidthCards = 560;
const windowHeightCards = 320;

class CardMatching extends Phaser.Scene {
  constructor() {
    super('cards');
  }

  preload() {
    this.load.image("cardBack", "src/assets/images/cardBack.png");
    this.load.image("sparrow", "src/assets/images/sparrow.png");
    this.load.image("eagle", "src/assets/images/eagle.png");
    this.load.image("penguin", "src/assets/images/penguin.png");
    this.load.image("owl", "src/assets/images/owl.png");
  }

  create() {
    // Reset all state on scene create
    this.allCards = [];
    this.cardOne = null;
    this.cardTwo = null;
    this.matches = 0;
    this.canFlip = true;

    this.cameras.main.setViewport(
      (game.config.width - windowWidthCards) / 2,
      (game.config.height - windowHeightCards) / 2,
      windowWidthCards,
      windowHeightCards
    );

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
        var card = this.add.sprite(
          xOffset + i * (cardWidth + xSpacing),
          yOffset + j * (cardHeight + ySpacing),
          "cardBack"
        ).setInteractive();
        card.name = cardImages[i * 2 + j];
        card.matched = false;
        this.allCards.push(card);

        card.on("pointerdown", () => {
          this.flipCard(card);
        });
      }
    }
  }

  flipCard(card) {
    // Ignore clicks if we're waiting for a mismatch to flip back
    if (!this.canFlip) return;

    // Ignore clicks on already matched or already flipped cards
    if (card.matched) return;
    if (card === this.cardOne) return;

    card.setTexture(card.name);

    if (!this.cardOne) {
      this.cardOne = card;
      return;
    }

    this.cardTwo = card;
    this.checkMatch();
  }

  checkMatch() {
    this.canFlip = false;

    if (this.cardOne.name === this.cardTwo.name) {
      // Cards match - mark them as matched
      this.cardOne.matched = true;
      this.cardTwo.matched = true;
      this.cardOne.disableInteractive();
      this.cardTwo.disableInteractive();

      this.matches++;
      this.cardOne = null;
      this.cardTwo = null;
      this.canFlip = true;

      if (this.matches === 4) {
        const winnerText = this.add.text(
          windowWidthCards / 2,
          windowHeightCards / 2,
          "Congratulations!",
          { font: "bold 24px Arial", fill: "#000" }
        ).setOrigin(0.5, 0.5);

        this.time.delayedCall(3000, () => {
          winnerText.destroy();
          this.scene.restart();
        });
      }
    } else {
      // Cards don't match - show X and flip back
      const xText = this.add.text(
        this.cardTwo.x,
        this.cardTwo.y,
        "X",
        { font: "bold 48px Arial", fill: "#f00" }
      ).setOrigin(0.5, 0.5);

      this.time.delayedCall(1000, () => {
        xText.destroy();
        this.cardOne.setTexture("cardBack");
        this.cardTwo.setTexture("cardBack");
        this.cardOne = null;
        this.cardTwo = null;
        this.canFlip = true;
      });
    }
  }
}
