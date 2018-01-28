import 'three';
import 'three/examples/js/controls/OrbitControls';

function initCamera(app) {
    app.camera = new THREE.PerspectiveCamera(45, app.container.offsetWidth / app.container.offsetHeight, 2, 80000);
    app.camera.position.set(10, 0, 0);
    app.camera.lookAt(app.scene.position);
    app.cameraControls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
    return app;
}

export default initCamera;
