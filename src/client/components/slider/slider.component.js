import template from './slider.template.html';
import './slider.style.scss';

export default class sliderContainer extends HTMLElement {
    constructor() {
        super();
        console.log('constructing slider');
    }

    createdCallback() {
        this.innerHTML = template;
    }
}

// Register the element.
document.registerElement('slider-container', sliderContainer);
