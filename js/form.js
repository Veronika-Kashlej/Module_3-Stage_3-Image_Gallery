import { images } from "./imageData.js";

export class Form {
  constructor(gallery) {
    this.gallery = gallery;
    this.addImageForm = document.querySelector("form");
    this.imageNameInput = document.querySelector("input[type='text']");
    this.imageFileInput = document.querySelector("input[type='file']");

    this.addImageForm.addEventListener(
      "submit",
      this.handleFormSubmit.bind(this)
    );
  }

  handleFormSubmit(e) {
    e.preventDefault();

    const name = this.imageNameInput.value.trim();
    const file = this.imageFileInput.files[0];

    // Generate unique ID
    const maxId = images.reduce((max, img) => Math.max(max, img.id), 0);
    const newId = maxId + 1;

    const newImage = {
      id: newId,
      title: name,
      url: URL.createObjectURL(file),
    };

    images.unshift(newImage);

    const imageCard = this.gallery.createImageCard(newImage);
    this.gallery.galleryContainer.prepend(imageCard);

    // If preview is currently open, update the current index
    if (this.gallery.previewHandler.currentImageIndex !== -1) {
      this.gallery.previewHandler.currentImageIndex++;
    }

    this.gallery.previewHandler.updateNavigationButtons();

    this.addImageForm.reset();
  }
}
