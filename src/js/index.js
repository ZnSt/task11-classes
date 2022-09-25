import '../css/style.css';
import { searchForm, divContainer, loadMore } from '../js/refs';
import GalleryApiService from '../js/api';
import renderGallery from '../js/gallery';
import Notiflix from 'notiflix';
import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import throttle from 'lodash.throttle';

const galleryApiService = new GalleryApiService();

searchForm.addEventListener('submit', onSearchForm);
loadMore.addEventListener('click', onClickLoadMore);

const onThrottleScroll = throttle(onScroll, 100);
// Бесконечный скролл
function onScroll() {
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  const { height: cardHeight } =
    divContainer.firstElementChild.getBoundingClientRect();

  if (scrollTop + clientHeight < scrollHeight - cardHeight) {
    return;
  }
  onClickLoadMore();
}

let isScrollListener = false;
function onSearchForm(event) {
  event.preventDefault();
  if (!isScrollListener) {
    document.addEventListener('scroll', onThrottleScroll);
    isScrollListener = true;
  }

  galleryApiService.query = event.currentTarget.elements.searchQuery.value;
  if (!galleryApiService.query) {
    Notiflix.Notify.warning('Please, enter valid name!');
    return;
  }
  galleryApiService.resetPage();
  galleryApiService.fetchImage().then(data => {
    if (!data.hits.length) {
      Notiflix.Notify.warning(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      return;
    }
    const markup = renderGallery(data.hits);
    divContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    loadMore.classList.remove('is-hidden');
  });
}

function onClickLoadMore() {
  galleryApiService.fetchImage().then(data => {
    const markup = renderGallery(data.hits);
    divContainer.insertAdjacentHTML('beforeend', markup);
    lightbox.refresh();
    if (data.totalHits <= galleryApiService.page * 20) {
      loadMore.classList.add('is-hidden');
      Notiflix.Notify.info(
        "We're sorry, but you've reached the end of search results."
      );
      document.removeEventListener('scroll', onThrottleScroll);
      isScrollListener = false;
      return;
    }
  });
}

const lightbox = new SimpleLightbox('.link', {
  captionDelay: 250,
  captions: true,
  captionType: 'alt',
  overlayOpacity: 0.3,
});
