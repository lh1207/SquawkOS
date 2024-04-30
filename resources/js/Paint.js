/**
 * Paint class extends Phaser.Scene to create a paint application scene.
 * @class
 * @extends Phaser.Scene
 */
class Paint extends Phaser.Scene {
  /**
   * Constructor for Paint class.
   * @constructor
   */
  constructor() {
    super({ key: "paint" });
    this.brushSize = 10;
    this.currentColor = 0x000000;
    this.isDrawing = false;
  }

  /**
   * Create function to initialize the paint application scene.
   */
  create() {
    // Create the canvas
    const rectWidth = 560;
    const rectHeight = 320;
    const rectX = this.cameras.main.centerX - rectWidth / 2;
    const rectY = this.cameras.main.centerY - rectHeight / 2;

    const canvasGraphic = this.add.graphics();

    // Add hit area to canvas
    const hitAreaCanvas = new Phaser.Geom.Rectangle(rectX, rectY, rectWidth, rectHeight);
    canvasGraphic.setInteractive(hitAreaCanvas, Phaser.Geom.Rectangle.Contains);

    canvasGraphic.setDepth(1);
    canvasGraphic.fillStyle(0xffffff, 1);
    canvasGraphic.fillRect(rectX, rectY, rectWidth, rectHeight);

    canvasGraphic.on('pointerdown', (pointer) => {
      this.isDrawing = true; // set isDrawing to true when pointer is down
      this.drawBrush(pointer.x, pointer.y, canvasGraphic);
    });

    canvasGraphic.on('pointermove', (pointer) => {
      if (this.isDrawing) {
        this.drawBrush(pointer.x, pointer.y, canvasGraphic);
      }
    });

    canvasGraphic.on('pointerup', (pointer) => {
      this.isDrawing = false;
    });

    // Add color swatches
    this.colorSwatches = [];
    const swatchWidth = 30;
    const swatchHeight = 30;
    const swatchPadding = 5;
    const swatchesPerRow = 12;
    const swatchXStart = 130;
    const swatchYStart = 140;
    const colors = [
      0x000000, // black
      0xff0000, // red
      0x00ff00, // green
      0x0000ff, // blue
      0xffff00, // yellow
      0xff00ff, // magenta
      0x00ffff, // cyan
      0x800000, // maroon
      0x008000, // dark green
      0x000080, // navy
      0x808000, // olive
      0xFFFFFF, // white (eraser)
    ];

    /**
     * Loop to create color swatches.
     */
    for (let i = 0; i < colors.length; i++) {
      const swatchX = swatchXStart + (i % swatchesPerRow) * (swatchWidth + swatchPadding);
      const swatchY = swatchYStart + Math.floor(i / swatchesPerRow) * (swatchHeight + swatchPadding);
      const swatch = this.add.graphics();
      swatch.setDepth(2);

      // Add hit area to swatch
      const hitAreaSwatch = new Phaser.Geom.Rectangle(swatchX, swatchY, swatchWidth, swatchHeight);
      swatch.setInteractive(hitAreaSwatch, Phaser.Geom.Rectangle.Contains);

      // Draw swatch color
      swatch.lineStyle(3, 0x000000)
        .strokeRect(swatchX, swatchY, swatchWidth, swatchHeight)
        .fillStyle(colors[i], 1)
        .fillRect(swatchX, swatchY, swatchWidth, swatchHeight)
        .on('pointerdown', (pointer, event) => {
          this.currentColor = colors[i];
        });

      this.colorSwatches.push(swatch);
    }

    // Add brush size buttons
    const brushButtonXStart = 150;
    const brushButtonYStart = 440;
    const brushButtonPadding = 10;
    const brushButtonWidth = 50;
    const brushSizes = [5, 10, 20];

    /**
     * Loop to create brush size buttons.
     */
    for (let i = 0; i < brushSizes.length; i++) {
      const brushSize = brushSizes[i];
      const brushButtonX = brushButtonXStart + i * (brushButtonWidth + brushButtonPadding);

      const brushButton = this.add.rectangle(brushButtonX, brushButtonYStart, brushButtonWidth, brushSize, 0xffffff, 1)
        .setDepth(3)
        .setStrokeStyle(1, 0x000000)
        .setInteractive({ useHandCursor: true });

      brushButton.on('pointerdown', () => {
        this.brushSize = brushSize;
        brushButton.setStrokeStyle(2, 0x000000);

        /**
         * Loop to reset the stroke style of other buttons when a button is clicked.
         */
        for (let j = 0; j < brushSizes.length; j++) {
          if (j !== i) {
            const otherButton = this.children.list.find(child => child instanceof Phaser.GameObjects.Rectangle && child !== brushButton && child.x === brushButtonXStart + j * (brushButtonWidth + brushButtonPadding) && child.y === brushButtonYStart);
            if (otherButton) {
              otherButton.setStrokeStyle(1, 0x000000);
            }
          }
        }
      });
    }
  }

  /**
   * drawBrush function to draw on the canvas.
   * @param {number} x - The x-coordinate of the pointer.
   * @param {number} y - The y-coordinate of the pointer.
   * @param {Phaser.GameObjects.Graphics} canvasGraphic - The canvas graphic to draw on.
   */
  drawBrush(x, y, canvasGraphic) {
    canvasGraphic.lineStyle(this.brushSize, this.currentColor, 1);

    if (this.lastPointerPosition) {
      canvasGraphic.beginPath();
      canvasGraphic.moveTo(this.lastPointerPosition.x, this.lastPointerPosition.y);
      canvasGraphic.lineTo(x, y);
      canvasGraphic.strokePath();
    }

    this.lastPointerPosition = new Phaser.Math.Vector2(x, y);
    canvasGraphic.moveTo(x, y);

    // Reset lastPointerPosition when the pointer is released
    canvasGraphic.on('pointerup', (pointer) => {
      this.isDrawing = false;
      this.lastPointerPosition = null;
    });
  }
}