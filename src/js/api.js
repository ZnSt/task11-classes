export default class GalleryApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  API_KEY = '25755107-c5ecbaee54c3d5c87c2809c98';

  fetchImage() {
    return fetch(
      `https://pixabay.com/api/?key=${this.API_KEY}&q=${this.searchQuery}&image_type="photo"&orientation="horizontal"&safesearch=true&per_page=20&page=${this.page}`
    )
      .then(response => response.json())
      .then(data => {
        console.log(data);
        this.incrementPage();
        return data;
      });
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    return (this.searchQuery = newQuery);
  }
}
