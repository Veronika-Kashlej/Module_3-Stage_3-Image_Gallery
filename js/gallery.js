import { images } from "./imageData.js";

export class Gallery {
  constructor() {
    this.galleryContainer = document.querySelector(".gallery-container");
    this.loadingIndicator = document.getElementById("loading-indicator");
    this.scrollToTopBtn = document.querySelector(".scroll-to-top-btn");
    this.scrollToTopBtn.addEventListener("click", this.scrollToTop);
    this.currentChunk = 0;
    this.itemsPerChunk = 9;
    this.activeCard = null;
    this.areAllImagesLoaded = false;
    this.handleScroll = this.handleScroll.bind(this);
    this.scrollToTop = this.scrollToTop.bind(this);
    this.init();
  }

  init() {
    this.setupIntersectionObserver();
    this.loadImages();
    window.addEventListener("scroll", this.handleScroll);
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
      this.areAllImagesLoaded = true;
    }
  }

  handleScroll() {
    const documentHeight = document.documentElement.scrollHeight;
    const screenHeight = document.documentElement.clientHeight;

    if (
      pageYOffset >= documentHeight - screenHeight - 150 &&
      this.areAllImagesLoaded
    ) {
      this.scrollToTopBtn.classList.add("visible");
    } else {
      this.scrollToTopBtn.classList.remove("visible");
    }
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });

    this.scrollToTopBtn.classList.remove("visible");
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
