/*
    camera.controller.js
    Authors: Cyrille Gindreau

    initCamera()
    Creates a camera and adds OrbitControls to it.

*/
import 'three';
import 'three/examples/js/controls/OrbitControls';

export default class CameraController {
    constructor() {
        'ngInject';

        this.camera = null;
    }
    initCamera(app) {
        app.camera = new THREE.PerspectiveCamera(45, app.container.offsetWidth / app.container.offsetHeight, 0.1, 80000);
        app.camera.position.set(-100, 50, -100);
        app.camera.cameraControls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
        this.initCameraMenu(app.camera);
        return app;
    }

    initCameraMenu(app) {
        document.querySelector('#camera-front-button').addEventListener('click', (e) => {
            app.camera.position.set(0, 0, 0)
        });
    }
}
