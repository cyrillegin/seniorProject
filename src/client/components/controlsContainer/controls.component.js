import template from './controls.template.html';

export default class controlsContainer extends HTMLElement {
    constructor() {
        super();
        console.log('constructing controls');
    }

    createdCallback() {
        this.innerHTML = template;
    }
}

// Register the element.
document.registerElement('controls-container', controlsContainer);