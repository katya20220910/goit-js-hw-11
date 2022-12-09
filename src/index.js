import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from '../src/api';

//перебір
const searchForm = document.querySelector('#search-form');
const loadMoreButtton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

//розмітка html

function createMarkup(images) {
  const markup = images
    .map(image => {
      const {
        largeImageURL,
        webformatURL,
        tags,
        likes,
        views,
        comments,
        downloads,
      } = image;
      return `
        <a class="gallery__link" href="${largeImageURL}">
          <div class="gallery-item">
            <img class="gallery-item__img" src="${webformatURL}" alt="${tags}" loading="lazy" />
            <div class="info">
              <p class="info-item"><b>Likes</b>${likes}</p>
              <p class="info-item"><b>Views</b>${views}</p>
              <p class="info-item"><b>Comments</b>${comments}</p>
              <p class="info-item"><b>Downloads</b>${downloads}</p>
            </div>
          </div>
        </a>
      `;
    })
    .join('');
//додавання
  gallery.insertAdjacentHTML('beforeend', markup);
}
//слухач
searchForm.addEventListener('submit', onSearchForm);
loadMoreButtton.addEventListener('click', onLoadMoreButton);
//змінні
let searchRequest = '';
let page = 1;
let perPage = 40;
let simpleLb;
//функція + умови пошуку
function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  searchRequest = e.currentTarget.searchQuery.value.trim()
  gallery.innerHTML = '';
  loadMoreButtton.classList.add('is-hidden');
  if (!searchRequest) {
    return;
  }
  fetchImages(searchRequest, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        gallery.innerHTML = '';
         Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
      }
     else {
       createMarkup(data.hits);
       simpleLb = new SimpleLightbox('.gallery a', {
           captionsData: 'alt',
          captionPosition: 'bottom',
          captionDelay: 250,
           enableKeyboard: true,
       }).refresh();
      Notify.success(`Hooray! We found ${data.totalHits} images.`);

      if (data.totalHits > perPage) {
loadMoreButtton.classList.remove('is-hidden');
      }
   }
   })
    .catch(error => console.log(error))
}
//додавання сторінок
function onLoadMoreButton() {
  page += 1;
  simpleLb.destroy();

  fetchImages(searchRequest, page, perPage)
    .then(({ data }) => {
      createMarkup(data.hits);
      simpleLb = new SimpleLightbox('.gallery a').refresh();

      const totalPages = Math.ceil(data.totalHits / perPage);

      if (page === totalPages) {
        loadMoreButtton.classList.add('is-hidden');
         Notify.failure("We're sorry, but you've reached the end of search results.");
      }
    })
    .catch(error => console.log(error));
}
