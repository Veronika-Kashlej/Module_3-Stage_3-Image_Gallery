export class DragDropHandler {
  constructor(gallery) {
    this.gallery = gallery;
    this.isDragging = false;
    this.draggedCard = null;
    this.draggedImage = null;

    this.init();
  }

  init() {
    this.createCoordinatesDisplay();
    this.setupDropZone();
  }

  createCoordinatesDisplay() {
    this.coordinatesDisplay = document.createElement("div");
    this.coordinatesDisplay.className = "coordinates-display";
    document.body.appendChild(this.coordinatesDisplay);
  }

  setupDropZone() {
    const previewSection = document.querySelector(".preview-section");
    previewSection.addEventListener("dragover", this.handleDragOver.bind(this));
    previewSection.addEventListener("drop", this.handleDrop.bind(this));
  }

  updateCoordinatesDisplay(x, y) {
    this.coordinatesDisplay.textContent = `X: ${x}, Y: ${y}`;
    this.coordinatesDisplay.classList.add("visible");
  }

  hideCoordinatesDisplay() {
    this.coordinatesDisplay.classList.remove("visible");
  }

  handleDragStart(e, imageCard, image) {
    this.isDragging = true;
    this.draggedCard = imageCard;
    this.draggedImage = image;

    // Set drag data
    e.dataTransfer.setData("text/plain", image.id);
    e.dataTransfer.effectAllowed = "move";

    imageCard.classList.add("dragging");

    document.addEventListener("dragover", this.trackMousePosition.bind(this));
  }

  trackMousePosition(e) {
    if (this.isDragging) {
      this.updateCoordinatesDisplay(e.clientX, e.clientY);
    }
  }

  handleDragOver(e) {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }

  handleDrop(e) {
    e.preventDefault();

    if (this.draggedCard && this.draggedImage) {
      // Card was dropped in preview area - activate it
      this.gallery.setActiveCard(this.draggedCard);
      this.gallery.previewHandler.showPreview(this.draggedImage);
    }

    this.cleanupDrag();
  }

  handleDragEnd() {
    this.cleanupDrag();
  }

  cleanupDrag() {
    this.isDragging = false;
    this.hideCoordinatesDisplay();

    if (this.draggedCard) {
      this.draggedCard.classList.remove("dragging");
    }

    this.draggedCard = null;
    this.draggedImage = null;

    document.removeEventListener("dragover", this.trackMousePosition);
  }
}
