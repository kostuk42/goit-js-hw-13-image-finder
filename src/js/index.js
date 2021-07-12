import ApiService from "./apiService";
import { debounce } from "lodash";
import toastr from "toastr";
import 'toastr/build/toastr.css';
import '../css/style.css';
import cardTemplate from '../templates/cards.hbs';
import * as basicLightbox from 'basiclightbox';
import 'basicLightbox/dist/basicLightbox.min.css';
let apiService = new ApiService(toastr);
let searchQuery = '';
import refs from './refs.js';

refs.inputEl.addEventListener("change", (e) => {
    searchQuery = refs.inputEl.value;
})

refs.buttonEl.addEventListener("click", (e) => {
    e.preventDefault();
    apiService.api(searchQuery, cardTemplate);
});
console.log(refs.galleryEl)
refs.galleryEl.onclick = (e) => {
    console.log(e.target.tagName)
    if (e.target.tagName !== 'IMG') return
    const imgEl = e.target;
    const url = imgEl.dataset.large;
    const instance = basicLightbox.create(`<img src="${url}" alt="">`);
    instance.show();
}






