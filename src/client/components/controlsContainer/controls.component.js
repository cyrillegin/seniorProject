import template from './controls.template.html';
import './controls.style.scss';

export default class controlsContainer extends HTMLElement {
    constructor() {
        super();
        console.log('constructing controls');
        this.bar = 'foo';
    }

    createdCallback() {
        this.innerHTML = template;
    }
}

// Register the element.
document.registerElement('controls-container', controlsContainer);
// customElements.define('controls-container', controlsContainer);
