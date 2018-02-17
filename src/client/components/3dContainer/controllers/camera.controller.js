/*
    camera.controller.js
    Authors: Cyrille Gindreau

    initCamera()
    Creates a camera and adds OrbitControls to it.

*/
import 'three';
import 'three/examples/js/controls/OrbitControls';

function initCamera(app) {
    app.camera = new THREE.PerspectiveCamera(45, app.container.offsetWidth / app.container.offsetHeight, 0.1, 80000);
    app.camera.position.set(-100, 50, -100);
    app.cameraControls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
    return app;
}

export default initCamera;