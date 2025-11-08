import { images } from "./imageData.js";

export class Gallery {
  constructor() {
    this.galleryContainer = document.querySelector(".gallery-container");
    this.loadingIndicator = document.getElementById("loading-indicator");
    this.scrollToTopBtn = document.querySelector(".scroll-to-top-btn");

    // Bind event handlers
    this.scrollToTopBtn.addEventListener("click", this.scrollToTop);
    this.handleScroll = this.handleScroll.bind(this);
    this.closePreview = this.closePreview.bind(this);
    this.navigateImage = this.navigateImage.bind(this);
    this.handleKeyPress = this.handleKeyPress.bind(this);

    this.currentChunk = 0;
    this.itemsPerChunk = 9;
    this.activeCard = null;
    this.currentImageIndex = -1;

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.loadImages();
    window.addEventListener("scroll", this.handleScroll);
  }

  /**
   * Loads next chunk of images when loading indicator becomes visible
   */
  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !this.hasLoadedAllImages()) {
            this.loadImages();
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(this.loadingIndicator);
  }

  /**
   * Checks if all images have been loaded
   */
  hasLoadedAllImages() {
    return this.currentChunk * this.itemsPerChunk >= images.length;
  }

  /**
   * Loads and renders next batch of images
   */
  loadImages() {
    const startIndex = this.currentChunk * this.itemsPerChunk;
    const endIndex = startIndex + this.itemsPerChunk;
    const imagesToLoad = images.slice(startIndex, endIndex);

    imagesToLoad.forEach((image) => {
      this.createImageCard(image);
    });

    this.currentChunk++;

    // Hide loading indicator when all images are loaded
    if (this.hasLoadedAllImages()) {
      this.loadingIndicator.style.display = "none";
    }
  }

  /**
   * Handles scroll events to show/hide scroll-to-top button
   */
  handleScroll() {
    const scrollPosition = window.pageYOffset;
    const screenHeight = window.innerHeight;

    // Show button when scrolled beyond 150px from bottom
    const shouldShowButton = scrollPosition > screenHeight * 0.5;

    if (shouldShowButton) {
      this.scrollToTopBtn.classList.add("visible");
    } else {
      this.scrollToTopBtn.classList.remove("visible");
    }
  }

  scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
    this.scrollToTopBtn.classList.remove("visible");
  }

  /**
   * Creates and appends image card to gallery
   */
  createImageCard(image) {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";
    imageCard.setAttribute("data-image-id", image.id);
    imageCard.innerHTML = `
      <img src="${image.url}" alt="${image.title}" loading="lazy">
      <p>${image.title}</p>
    `;

    imageCard.addEventListener("click", () => {
      this.setActiveCard(imageCard);
      this.showPreview(image);
    });

    this.galleryContainer.append(imageCard);
  }

  /**
   * Sets active card and removes active state from previous card
   */
  setActiveCard(imageCard) {
    // Remove active class from all cards
    document.querySelectorAll(".image-card.active").forEach((card) => {
      card.classList.remove("active");
    });

    imageCard.classList.add("active");
    this.activeCard = imageCard;
  }

  /**
   * Displays image preview with navigation
   */
  showPreview(image) {
    this.currentImageIndex = images.findIndex((img) => img.id === image.id);
    this.renderPreview(image);
  }

  /**
   * Renders preview container with image and navigation
   */
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

    // Add event listeners
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

  /**
   * Navigates to previous or next image in preview
   */
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
  }

  /**
   * Updates preview with new image data
   */
  updatePreview(image) {
    const previewContainer = document.querySelector(".preview-container");
    const imgElement = previewContainer.querySelector("img");
    const titleElement = previewContainer.querySelector(".preview-title");

    imgElement.src = image.url;
    imgElement.alt = image.title;
    titleElement.textContent = image.title;

    this.updateNavigationButtons();
  }

  /**
   * Updates active card based on image ID
   */
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

  /**
   * Enables/disables navigation buttons based on current position
   */
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
