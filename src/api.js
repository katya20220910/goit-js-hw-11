import axios from "axios";
const API_KEY = '31922070-0e57426beed12f8c7d4aebf2f';
// const BASE_URL = 'https://pixabay.com/api/';
// const perPAGE = 40;
// const page = 1;
// const searchRequest = '';
//  export async function fetchImages() {
//    const response = await axios.get(
//     `${BASE_URL}?key=${API_KEY}&q=${searchRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPAGE}`
//    );
//    return response;
//  }

// export const fetchPics = async (input, page) => {
//   const response = await axios.get(`${BASE_URL}?key=${API_KEY}&q=${input}&orientation=horizontal&safesearch=true&image_type=photo&per_page=40&page=${page}`)
//   return response.data
// };
axios.defaults.baseURL = 'https://pixabay.com/api/';

export async function fetchImages(searchRequest, page, perPage) {
  const response = await axios.get(
    `?key=${API_KEY}&q=${searchRequest}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`
  );
  return response;
}
 
// export default apiServ;

// axios.defaults.baseURL = 'https://pixabay.com/api/';



// export async function apiServ(query, page, perPage) {
//     const response = await axios.get (`?key=${KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${perPage}`,)
//     return response;
// }


// const PER_PAGE = 40;

// async function fetchPicture(searchQuery, page) {
//   const response = await axios.get(
//     `${BASE_URL}?key=${API_KEY}&q=${searchQuery}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`
//   );

//   return response;
// }