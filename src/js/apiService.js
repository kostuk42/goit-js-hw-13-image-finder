
export default function ApiService(toastr) {
    this.key = '22433952-2d63403013f80436a9dd1929b';
    this.lastQuery = '';
    this.pageNumber = 1;
    this.result = '';
    this.target = '';
    this.observer = '';
    this.control = 0;
    this.toastr = toastr;
    this.api = async (searchQuery, cardTemplate) => {
        const galleryEl = document.body.querySelector('.gallery');
        if (!searchQuery) {

            this.toastr.error('No choice!');
            return
        }
        if (this.lastQuery !== searchQuery) {
            this.pageNumber = 1;
            this.result = '';
            galleryEl.innerHTML = null;
        }
        if (this.result && this.result.total === this.control) {
            this.toastr.info('there is nothing to show more');
            return
        }
        let URL = `https://pixabay.com/api/?image_type=photo&orientation=horizontal&q=${searchQuery}&page=${this.pageNumber}&per_page=12&key=${this.key}`;
        let response = await fetch(URL);
        if (response.status === 404) {
            console.log('not found');
            return
        }
        let result = await response.json().catch(err => {
            this.toastr.warning('something went wrong');
            return
        })
        this.lastQuery = searchQuery;
        if (result.total === 0) {
            this.toastr.error('Unfortunately we have find nothing :(');
            return
        } else if (this.pageNumber === 1) {
            toastr.info(`we have find ${result.total} matches`);
        }
       
        this.result = result; 
        result.hits.forEach(pic => {
             galleryEl.insertAdjacentHTML('beforeend', cardTemplate(pic));
             const elem = galleryEl.lastChild.querySelector('img');
             elem.onload = () => {
                 this.control += 1;
                 if (this.control === (this.pageNumber - 1) * 12) {
                     console.log('works');
                     const scrollElem = galleryEl.children[this.control - 12];
                     console.log(scrollElem);
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
            this.target = galleryEl.lastElementChild;
            const options = {
                threshold: 1
            }
            const callback = (entries, observer) => {
                if (entries[0].isIntersecting) {
                    if(this.control <12 ) return
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