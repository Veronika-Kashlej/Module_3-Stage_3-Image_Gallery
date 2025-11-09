import { images } from "./imageData.js";
export class PreviewHandler {
  constructor(gallery) {
    this.gallery = gallery;
    this.currentImageIndex = -1;

    this.closePreview = this.closePreview.bind(this);
    this.navigateImage = this.navigateImage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);
  }

  showPreview(image) {
    this.currentImageIndex = images.findIndex((img) => img.id === image.id);
    this.renderPreview(image);
  }

  renderPreview(image) {
    const previewContainer = document.querySelector(".preview-container");

    previewContainer.innerHTML = `
      <button class="close-btn">╳</button>
      <img src="${image.url}" alt="${image.title}">
      <div class="preview-navigation">
        <button class="previous-arrow">←</button>
        <h2 class="preview-title">${image.title}</h2>
        <button class="next-arrow">→</button>
      </div>
    `;

    previewContainer
      .querySelector(".close-btn")
      .addEventListener("click", this.closePreview);
    previewContainer
      .querySelector(".previous-arrow")
      .addEventListener("click", () => this.navigateImage("prev"));
    previewContainer
      .querySelector(".next-arrow")
      .addEventListener("click", () => this.navigateImage("next"));

    this.updateNavigationButtons();
    document.addEventListener("keydown", this.handleKeyPress);
  }

  closePreview() {
    if (this.activeCard) {
      this.activeCard.classList.remove("active");
      this.activeCard = null;
    }

    const previewContainer = document.querySelector(".preview-container");
    previewContainer.innerHTML = `<p>Choose image...</p>`;
    this.currentImageIndex = -1;

    document.removeEventListener("keydown", this.handleKeyPress);
  }

  navigateImage(direction) {
    if (direction === "prev" && this.currentImageIndex > 0) {
      this.currentImageIndex--;
    } else if (
      direction === "next" &&
      this.currentImageIndex < images.length - 1
    ) {
      this.currentImageIndex++;
    } else {
      return;
    }

    const nextImage = images[this.currentImageIndex];
    this.updatePreview(nextImage);
    this.updateActiveCard(nextImage.id);
    this.updateNavigationButtons();
  }

  updatePreview(image) {
    const previewContainer = document.querySelector(".preview-container");
    const imgElement = previewContainer.querySelector("img");
    const titleElement = previewContainer.querySelector(".preview-title");

    imgElement.src = image.url;
    imgElement.alt = image.title;
    titleElement.textContent = image.title;
  }

  updateActiveCard(imageId) {
    document.querySelectorAll(".image-card.active").forEach((card) => {
      card.classList.remove("active");
    });

    const targetCard = document.querySelector(`[data-image-id="${imageId}"]`);
    if (targetCard) {
      targetCard.classList.add("active");
      this.activeCard = targetCard;
    }
  }

  updateNavigationButtons() {
    const previousArrow = document.querySelector(".previous-arrow");
    const nextArrow = document.querySelector(".next-arrow");

    if (previousArrow && nextArrow) {
      previousArrow.disabled = this.currentImageIndex <= 0;
      nextArrow.disabled = this.currentImageIndex >= images.length - 1;
    }
  }

  handleKeyPress(event) {
    // Works only when preview section is open
    if (this.currentImageIndex === -1) return;

    switch (event.key) {
      case "ArrowLeft":
        this.navigateImage("prev");
        break;
      case "ArrowRight":
        this.navigateImage("next");
        break;
      case "Escape":
        this.closePreview();
        break;
    }
  }
}
