import { images } from "./imageData.js";

export class Gallery {
  constructor() {
    this.galleryContainer = document.querySelector(".gallery-container");
    this.init();
  }

  init() {
    this.loadImages();
  }

  loadImages() {
    images.forEach((image) => {
      this.createImageCard(image);
    });
  }

  createImageCard(image) {
    const imageCard = document.createElement("div");
    imageCard.className = "image-card";
    imageCard.innerHTML = `<img src="${image.url}" alt="image" loading="lazy"><p>${image.title}</p>`;
    this.galleryContainer.append(imageCard);
  }
}
