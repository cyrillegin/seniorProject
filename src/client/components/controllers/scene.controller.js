/*
    scene.controller.js
    Authors: Cyrille Gindreau

    initScene()
    initializes the scene and renderer of THREE scene.

    render()
    renders the next frame of the scene.

*/
import 'three';

function initScene(container) {
    const app = {
        scene: new THREE.Scene(),
        camera: null,
        cameraControls: null,
        lights: {},
        meshes: {},
        renderer: null,
        container,
        loaded: false,
    };
    initRenderer(app);
    return app;
}

function initRenderer(app) {
    app.renderer = new THREE.WebGLRenderer({
        antialias: true,
        alpha: true,
    });
    app.renderer.shadowMap.enabled = true;
    app.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    app.renderer.gammaInput = true;
    app.renderer.gammaOutput = true;
    app.renderer.autoClear = false;
    app.renderer.sortObjects = false;
    console.log($('#canvas'))
    app.renderer.setSize(app.container.offsetWidth, app.container.offsetHeight);

    app.renderer.setClearColor(0xffffff, 0);

    app.container.appendChild(app.renderer.domElement);

    app.render = () => {
        if (app.loaded = false) {
            return;
        }
        app.renderer.render(app.scene, app.camera);
        requestAnimationFrame(app.render);
    };
    return app;
}

export default initScene;
