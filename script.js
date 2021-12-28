class PhotoGallery {
  constructor() {
    this.API_KEY = "563492ad6f917000010000015ba7b0b0f4df45f2b738403e82de3e36";
    this.galleryDIv = document.querySelector(".gallery");
    this.searchForm = document.querySelector(".header form");
    this.loadMore = document.querySelector(".load-more");
    this.logo = document.querySelector(".logo");
    this.pageIndex = 1;
    this.searchValueGlobal = "";
    this.eventHandle();
  }
  eventHandle() {
    document.addEventListener("DOMContentLoaded", () => {
      this.getImg(1);
    });
    this.searchForm.addEventListener("submit", (e) => {
      this.pageIndex = 1;
      this.getSearchedImages(e);
    });
    this.loadMore.addEventListener("click", (e) => {
      this.loadMoreImages(e);
    });
    this.logo.addEventListener("click", () => {
      this.pageIndex = 1;
      this.galleryDIv.innerHTML = "";
      this.getImg(this.pageIndex);
    });
  }
  async getImg(index) {
    this.loadMore.setAttribute("data-img", "curated");
    const baseURL = `https://api.pexels.com/v1/curated?page=${index}&per_page=100`;
    const data = await this.fetchImages(baseURL);
    this.generateHTML(data.photos);
    console.log(data);
  }
  async fetchImages(baseURL) {
    const response = await fetch(baseURL, {
      method: "GET",
      headers: {
        Accept: "application/json",
        Authorization: this.API_KEY,
      },
    });
    const data = await response.json();
    return data;
  }
  generateHTML(photos) {
    photos.forEach((photo) => {
      const item = document.createElement("div");
      item.classList.add("item");
      item.innerHTML = `
      <a href='${photo.src.original}' target="_blank">
        <img src="${photo.src.medium}">
        <h3> ${photo.photographer}<h3>
      </a>
      `;
      this.galleryDIv.appendChild(item);
    });
  }
  async getSearchedImages(e) {
    this.loadMore.setAttribute("data-img", "search");
    e.preventDefault();
    this.galleryDIv.innerHTML = "";
    const searchValue = e.target.querySelector("input").value;
    this.searchValueGlobal = searchValue;
    const baseURL =
      await `https://api.pexels.com/v1/search?query=${searchValue}&page=1&per_page=50`;
    const data = await this.fetchImages(baseURL);
    this.generateHTML(data.photos);
    e.target.reset();
  }
  async getMoreSearchedImages(index) {
    const baseURL = `https://api.pexels.com/v1/search?query=${this.searchValueGlobal}&page=${index}&per_page=80`;
    const data = await this.fetchImages(baseURL);
    console.log(data);
    this.generateHTML(data.photos);
  }

  loadMoreImages(e) {
    let index = ++this.pageIndex;
    const loadMoreImages = e.target.getAttribute("data-img");
    if (loadMoreImages === "curated") {
      this.getImg(index);
    } else {
      this.getMoreSearchedImages(index);
    }
  }
}

const gallery = new PhotoGallery();
