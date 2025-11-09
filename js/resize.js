export class ResizeHandler {
  constructor(gallery) {
    this.gallery = gallery;
    this.isResizing = false;
  }

  init() {
    this.resizer = document.querySelector(".resizer");
    this.resizer.addEventListener(
      "mousedown",
      this.handleResizerMouseDown.bind(this)
    );
  }

  handleResizerMouseDown(e) {
    e.preventDefault();
    this.isResizing = true;

    // Store initial positions and sizes
    this.startX = e.clientX;
    this.startGalleryWidth =
      this.gallery.gallerySection.getBoundingClientRect().width;
    this.startPreviewWidth =
      this.gallery.previewSection.getBoundingClientRect().width;

    document.addEventListener(
      "mousemove",
      this.handleResizerMouseMove.bind(this)
    );
    document.addEventListener("mouseup", this.handleResizerMouseUp.bind(this));
  }

  handleResizerMouseMove(e) {
    if (!this.isResizing) return;

    const deltaX = e.clientX - this.startX;
    const mainElement = document.querySelector("main");
    const totalWidth = mainElement.getBoundingClientRect().width;

    // Calculate new widths as percentages
    const newGalleryWidth =
      ((this.startGalleryWidth + deltaX) / totalWidth) * 100;
    const newPreviewWidth =
      ((this.startPreviewWidth - deltaX) / totalWidth) * 100;

    // Apply constraints (min 30% for gallery, min 20% for preview)
    if (newGalleryWidth >= 30 && newPreviewWidth >= 20) {
      this.gallery.gallerySection.style.flexBasis = `${newGalleryWidth}%`;
      this.gallery.previewSection.style.flexBasis = `${newPreviewWidth}%`;
    }
  }

  handleResizerMouseUp() {
    this.isResizing = false;
    document.removeEventListener(
      "mousemove",
      this.handleResizerMouseMove.bind(this)
    );
    document.removeEventListener(
      "mouseup",
      this.handleResizerMouseUp.bind(this)
    );
  }
}
