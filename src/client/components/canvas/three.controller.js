// global imports
import 'three';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/controls/OrbitControls';
// local imports
import template from './three.template.html';
import './three.style.scss';
// controller imports
import initScene from './../controllers/scene.controller';
import initLights from './../controllers/lights.controller';
import initCamera from './../controllers/camera.controller';
import initMesh from './../controllers/mesh.controller';


class ThreeContainer extends HTMLElement {
    constructor() {
        // handle any inits or injections. Currently just a placeholder.
        super();
        console.log('constructing canvas');
    }

    // lifecycle hook - called when inserted into dom
    createdCallback() {
        this.innerHTML = template;
        console.log($('#canvas'))
        let app = initScene($('#canvas')[0]);
        app = initLights(app);
        app = initCamera(app);
        app = initMesh(app);
        app.render();
    }
}

// Register the element.
document.registerElement('three-container', ThreeContainer);
