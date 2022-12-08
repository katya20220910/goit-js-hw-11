import { Notify } from 'notiflix/build/notiflix-notify-aio';

import SimpleLightbox from 'simplelightbox';

import 'simplelightbox/dist/simple-lightbox.min.css';
import { fetchImages } from '../src/api';


const searchForm = document.querySelector('#search-form');
const loadMoreButtton = document.querySelector('.load-more');
const gallery = document.querySelector('.gallery');

searchForm.addEventListener('submit', onSearchForm);
loadMoreButtton.addEventListener('click', onLoadMoreButton);

let searchRequest = '';
let page = 1;
let perPage = 40;
let simpleLb;

function onSearchForm(e) {
  e.preventDefault();
  page = 1;
  let searchRequest = e.currentTarget.searchQuery.value.trim();
  gallery.innerHTML = '';
  loadMoreButtton.classList.add('is-hidden');
  if (!searchRequest) return;

  fetchImages(searchRequest, page, perPage)
    .then(({ data }) => {
      if (data.totalHits === 0) {
        alertNoImagesFound();
      } else {
        createMarkup(data.hits);
        simpleLb = new SimpleLightbox('.gallery a', {
          captionsData: 'alt',
          captionPosition: 'bottom',
          captionDelay: 250,
          enableKeyboard: true,
        }).refresh();
        // alertImagesFound(data);

        if (data.totalHits > perPage) {
          loadMoreButtton.classList.remove('is-hidden');
        }
      }
    })
    .catch(error => console.log(error));
}

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
        alertEndOfSearch();
      }
    })
    .catch(error => console.log(error));
}

// function alertImagesFound(data) {
//   Notify.success(`Hooray! We found ${data.totalHits} images.`);
// }

function alertNoImagesFound() {
  Notify.failure(
    'Sorry, there are no images matching your search query. Please try again.'
  );
}

function alertEndOfSearch() {
  Notify.failure("We're sorry, but you've reached the end of search results.");
}

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

  gallery.insertAdjacentHTML('beforeend', markup);
}

// const simpleLightBox = new SimpleLightbox('.photo-card a', {
//   captions: true,
//   captionsData: 'alt',
//   captionDelay: 250,
//   captionPosition: 'bottom',
//   captionSelector: 'img',
// });

// let searchQuery = '';
// let page = 1;

// const refs = {
//   searchForm: document.querySelector('.search-form'),
//   gallery: document.querySelector('.gallery'),
//   loadMore: document.querySelector('.load-more'),
// };

// refs.searchForm.addEventListener('submit', onSearchForm);
// refs.loadMore.addEventListener('click', onLoadMore);

// refs.loadMore.classList.add('is-hidden');
// async function renderMarkup(images) {
//   const markup = images
//     .map(img => {
//       const {
//         webformatURL,
//         largeImageURL,
//         tags,
//         likes,
//         views,
//         comments,
//         downloads,
//       } = img;
//       return `
//       <div class="photo-card">
//           <a class="photo-link" href="${largeImageURL}">
//             <img src="${webformatURL}" alt="${tags}" loading="lazy" />
//           </a>
//         <div class="info">
//           <p class="info-item">
//             <b>Likes ${likes}</b>
//           </p>
//           <p class="info-item">
//             <b>Views ${views}</b>
//           </p>
//           <p class="info-item">
//             <b>Comments ${comments}</b>
//           </p>
//           <p class="info-item">
//             <b>Downloads ${downloads}</b>
//           </p>
//         </div>
//       </div>
//         `;
//     })
//     .join('');

//   refs.gallery.insertAdjacentHTML('beforeend', markup);
// }

// async function onSearchForm(e) {
//   e.preventDefault();
//   searchQuery = e.currentTarget.searchQuery.value.trim();
//   if (searchQuery === '') {
//     return;
//   }
//   refs.loadMore.classList.add('is-hidden');
//   refs.gallery.innerHTML = '';
//   resetPage();

//   try {
//     const response = await fetchPicture(searchQuery, page);
//     const data = response.data;

//     if (data.totalHits === 0) {
//       Notify.failure(
//         'Sorry, there are no images matching your search query. Please try again.'
//       );
//     } else if (page * 40 < data.totalHits) {
//       Notify.success(`Hooray! We found ${data.totalHits} images.`);
//       renderMarkup(data.hits);
//       simpleLightBox.refresh();
//       refs.loadMore.classList.remove('is-hidden');
//     } else if (page * 40 > data.totalHits) {
//       onNotify();
//       renderMarkup(data.hits);
//       simpleLightBox.refresh();
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// async function onLoadMore() {
//   refs.loadMore.classList.add('is-hidden');
//   increment();

//   try {
//     const response = await fetchPicture(searchQuery, page);
//     const data = response.data;

//     renderMarkup(data.hits);
//     simpleLightBox.refresh();
//     scrollGallery();

//     if (page * 40 > data.totalHits) {
//       onNotify();
//     } else {
//       refs.loadMore.classList.remove('is-hidden');
//     }
//   } catch (error) {
//     console.log(error);
//   }
// }

// function onNotify() {
//   refs.loadMore.classList.add('is-hidden');
//   Notify.failure("We're sorry, but you've reached the end of search results.");
// }

// function increment() {
//   page += 1;
// }

// function resetPage() {
//   page = 1;
// }