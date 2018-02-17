import template from './slider.template.html';
import './slider.style.scss';

export default class sliderContainer extends HTMLElement {
    constructor(param) {
        super();
        console.log('constructing slider');
    }

    createdCallback(param) {
        this.innerHTML = template;
        this.querySelector('#title').innerHTML = $(this)[0].title;
    }

    attributeChangedCallback(attrName, oldValue, newValue) {
      console.log('change')
      console.log(attrName)
      console.log(oldValue, newValue)
    }

}

// Register the element.
Object.defineProperty(sliderContainer, "title", {'asdf': 5});
document.registerElement('slider-container', sliderContainer);
