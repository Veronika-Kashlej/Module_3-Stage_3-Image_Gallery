import { images } from "./imageData.js";

export class Gallery {
  constructor() {
    this.galleryContainer = document.querySelector(".gallery-container");
    this.loadingIndicator = document.getElementById("loading-indicator");
    this.currentChunk = 0;
    this.itemsPerChunk = 9;
    this.activeCard = null;
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.loadImages();
  }

  loadImages() {
    const startIndex = this.currentChunk * this.itemsPerChunk;
    const endIndex = startIndex + this.itemsPerChunk;
    const imagesToLoad = images.slice(startIndex, endIndex);

    imagesToLoad.forEach((image) => {
      this.createImageCard(image);
    });

    this.currentChunk++;

    if (endIndex >= images.length) {
      this.loadingIndicator.style.display = "none";
    }
  }

  createImageCard(image) {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";
    imageCard.innerHTML = `<img src="${image.url}" alt="image" loading="lazy"><p>${image.title}</p>`;
    this.galleryContainer.append(imageCard);

    imageCard.addEventListener("click", () => {
      this.setActiveCard(imageCard);
      this.showPreview(image);
    });
  }

  setActiveCard(image) {
    if (this.activeCard) {
      this.activeCard.classList.remove("active");
    }

    image.classList.add("active");
    this.activeCard = image;
  }

  showPreview(image) {
    const previewContainer = document.querySelector(".preview-container");
    previewContainer.innerHTML = `<img src="${image.url}" alt="image"><h2>${image.title}</h2>
`;
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.loadImages();
          }
        });
      },
      {
        threshold: 0.1,
      }
    );

    observer.observe(this.loadingIndicator);
  }
}
