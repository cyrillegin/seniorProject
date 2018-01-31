/*
    three.controller.js
    Authors: Cyrille Gindreau

    class ThreeContainer
    Serves as the base of the scene.
    Creates the canvas element and the Three app.

*/
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
// Utility imports
import Manipulate from './../utility/manipulate.controller';


class ThreeContainer extends HTMLElement {
    constructor() {
        // handle any inits or injections. Currently just a placeholder.
        super();
        console.log('constructing canvas');
    }

    // lifecycle hook - called when inserted into dom
    createdCallback() {
        this.innerHTML = template;
        let app = initScene($('#canvas')[0]);
        app = initLights(app);
        app = initCamera(app);
        initMesh(app).then((app) => {
            app.render();
        });
        this.manipulator = new Manipulate(app.meshes);
        this.setupSliders();
    }

    setupSliders() {
        const slider1 = document.getElementById('hull-width-slider');
        const value1 = document.getElementById('hull-width-slider-value');
        slider1.oninput = (value) => {
            value1.innerHTML = value.target.value;
            this.manipulator.adjustWidth(value.target.value);
        };
    }
}

// Register the element.
document.registerElement('three-container', ThreeContainer);
