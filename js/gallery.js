import { images } from "./imageData.js";
import { DragDropHandler } from "./dragDrop.js";
import { ResizeHandler } from "./resize.js";
import { PreviewHandler } from "./preview.js";
import { Form } from "./form.js";

export class Gallery {
  constructor() {
    this.galleryContainer = document.querySelector(".gallery-container");
    this.loadingIndicator = document.getElementById("loading-indicator");
    this.scrollToTopBtn = document.querySelector(".scroll-to-top-btn");
    this.gallerySection = document.querySelector(".gallery-section");
    this.previewSection = document.querySelector(".preview-section");

    this.scrollToTopBtn.addEventListener("click", this.scrollToTop.bind(this));
    this.handleScroll = this.handleScroll.bind(this);

    this.currentChunk = 0;
    this.itemsPerChunk = 9;
    this.activeCard = null;

    this.dragDropHandler = new DragDropHandler(this);
    this.resizeHandler = new ResizeHandler(this);
    this.previewHandler = new PreviewHandler(this);
    this.form = new Form(this);

    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.loadImages();
    this.gallerySection.addEventListener("scroll", this.handleScroll);
    this.resizeHandler.init();
  }

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

  hasLoadedAllImages() {
    return this.currentChunk * this.itemsPerChunk >= images.length;
  }

  loadImages() {
    const startIndex = this.currentChunk * this.itemsPerChunk;
    const endIndex = startIndex + this.itemsPerChunk;
    const imagesToLoad = images.slice(startIndex, endIndex);

    imagesToLoad.forEach((image) => {
      const imageCard = this.createImageCard(image);
      this.galleryContainer.append(imageCard);
    });

    this.currentChunk++;

    // Hide loading indicator when all images are loaded
    if (this.hasLoadedAllImages()) {
      this.loadingIndicator.style.display = "none";
    }
  }

  handleScroll() {
    const scrollPosition = this.gallerySection.scrollTop;
    const containerHeight = this.gallerySection.clientHeight;
    const scrollHeight = this.gallerySection.scrollHeight;
    const shouldShowButton =
      this.hasLoadedAllImages() &&
      scrollPosition + containerHeight >= scrollHeight - 10;

    if (shouldShowButton) {
      this.scrollToTopBtn.classList.add("visible");
    } else {
      this.scrollToTopBtn.classList.remove("visible");
    }
  }

  scrollToTop() {
    this.gallerySection.scrollTo({ top: 0, behavior: "smooth" });
    this.scrollToTopBtn.classList.remove("visible");
  }

  createImageCard(image) {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";
    imageCard.setAttribute("data-image-id", image.id);
    imageCard.setAttribute("draggable", "true");
    imageCard.innerHTML = `
      <img src="${image.url}" alt="${image.title}" loading="lazy">
      <p>${image.title}</p>
    `;

    imageCard.addEventListener("click", () => {
      this.setActiveCard(imageCard);
      this.previewHandler.showPreview(image);
    });

    imageCard.addEventListener("dragstart", (e) =>
      this.dragDropHandler.handleDragStart(e, imageCard, image)
    );
    imageCard.addEventListener("dragend", () =>
      this.dragDropHandler.handleDragEnd()
    );

    return imageCard;
  }

  setActiveCard(imageCard) {
    document.querySelectorAll(".image-card.active").forEach((card) => {
      card.classList.remove("active");
    });

    imageCard.classList.add("active");
    this.activeCard = imageCard;
  }
}
