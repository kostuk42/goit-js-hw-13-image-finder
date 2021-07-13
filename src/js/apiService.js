import refs from './refs.js';
import toastr from 'toastr';

toastr.options = {
  "debug": false,
  "positionClass": "toast-bottom-full-width",
  "onclick": null,
  "fadeIn": 300,
  "fadeOut": 1000,
  "timeOut": 5000,
  "extendedTimeOut": 1000
}
export default function ApiService() {
    this.key = '22433952-2d63403013f80436a9dd1929b';
    this.lastQuery = '';
    this.pageNumber = 1;
    this.result = '';
    this.target = '';
    this.observer = '';
    this.control = 0;
    this.api = async (searchQuery, cardTemplate) => {
        
        if (!searchQuery) {
            toastr.error('No choice!');
            return
        }
        if (this.lastQuery !== searchQuery) {
            this.pageNumber = 1;
            this.result = '';
            refs.galleryEl.innerHTML = null;
        }
        if (this.result && this.result.total === this.control) {
            toastr.info('there is nothing to show more');
            return
        }
        let URL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${this.pageNumber}&per_page=12&key=${this.key}`;
        let response = await fetch(URL);
        if (response.status === 404) {
            toastr.warning('not found');
            return
        }
        let result = await response.json().catch(err => {
            toastr.warning('something went wrong');
            return
        })
        this.lastQuery = searchQuery;
        if (result.total === 0) {
            toastr.error('Unfortunately we have find nothing :(');
            return
        } else if (this.pageNumber === 1) {
            toastr.info(`we have find ${result.total} matches`);
        }
        this.result = result; 
        result.hits.forEach(pic => {
             refs.galleryEl.insertAdjacentHTML('beforeend', cardTemplate(pic));
             const elem = refs.galleryEl.lastChild.querySelector('img');
             elem.onload = () => {
                 this.control += 1;
                 if (this.control === (this.pageNumber - 1) * 12) {
                     const scrollElem = refs.galleryEl.children[this.control - 12];
                     scrollElem.scrollIntoView({
                       behavior: 'smooth',
                       block: 'start'
                       });
                }
            }
        });
        
            if (this.observer) {
                this.observer.disconnect(this.target)
            }
            this.target = refs.galleryEl.lastElementChild;
            const options = {
                threshold: 1
            }
            const callback = (entries, observer) => {
                if (entries[0].isIntersecting) {
                    if (this.control < 12) return
                    console.log([entries]);
                    this.api(searchQuery, cardTemplate);
                }
            }
            this.observer = new IntersectionObserver(callback, options);
            if (this.target) {
                this.observer.observe(this.target);
           };
        this.pageNumber += 1;
    }  
}