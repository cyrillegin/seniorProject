// global imports
import 'three';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/controls/OrbitControls';
// local imports
import template from './three.template.html';
import './three.style.scss';
// controller imports
import initScene from './../controllers/scene.controller';


class ThreeContainer extends HTMLElement {
    constructor() {
        // handle any inits or injections. Currently just a placeholder.
        super();
        console.log('constructing canvas');
    }

    // lifecycle hook - called when inserted into dom
    createdCallback() {
        this.innerHTML = template;
        const app = initScene($('#canvas')[0]);
        app.render();
    }
}

// Register the element.
document.registerElement('three-container', ThreeContainer);
