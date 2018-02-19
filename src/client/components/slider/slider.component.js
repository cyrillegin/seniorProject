import template from './slider.template.html';
import './slider.style.scss';

export default class sliderContainer extends HTMLElement {
    constructor() {
        super();
        console.log('constructing slider');
    }

    createdCallback(param) {
        this.innerHTML = template;
        // this.querySelector('#type').innerHTML = 'hello'
        this.querySelector('#title').innerHTML = $(this)[0].title;
        // this.querySelector('#type').innerHTML = $(this)[0].type;
        // console.log($(this)[0].title);
        // console.log($(this));
        // this.querySelector($(this)[0].type).toggleClass('hidden');
        console.log($(this)[0].type);
    }
}

// Register the element.
// Object.defineProperty(sliderContainer, 'title', {default: null});
// Object.defineProperty(sliderContainer, 'type', {default: null});
document.registerElement('slider-container', sliderContainer);
// customElements.define('slider-container', sliderContainer);
