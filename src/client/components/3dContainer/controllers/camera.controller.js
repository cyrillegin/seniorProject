/*
    camera.controller.js
    Authors: Cyrille Gindreau

    initCamera()
    Creates a camera and adds OrbitControls to it.

*/
import 'three';
import 'three/examples/js/controls/OrbitControls';
import TWEEN from '@tweenjs/tween.js';

export default class CameraController {
    constructor() {
        'ngInject';

        this.camera = null;
    }
    initCamera(app) {
        app.camera = new THREE.PerspectiveCamera(45, app.container.offsetWidth / app.container.offsetHeight, 0.1, 80000);
        app.camera.position.set(-100, 50, -100);
        app.camera.cameraControls = new THREE.OrbitControls(app.camera, app.renderer.domElement);
        this.initCameraMenu(app);
        return app;
    }

    initCameraMenu(app) {
        document.querySelector('#camera-front-button').addEventListener('click', (e) => {
            const to = {
                x: 0,
                y: 0,
                z: 100,
            };
            this.tweenCamera(app, to);
        });
        document.querySelector('#camera-top-button').addEventListener('click', (e) => {
            const to = {
                x: 0,
                y: 100,
                z: 0,
            };
            this.tweenCamera(app, to);
        });
        document.querySelector('#camera-side-button').addEventListener('click', (e) => {
            const to = {
                x: 100,
                y: 0,
                z: 0,
            };
            this.tweenCamera(app, to);
        });
        document.querySelector('#camera-45-button').addEventListener('click', (e) => {
            const to = {
                x: 100,
                y: 100,
                z: 100,
            };
            this.tweenCamera(app, to);
        });
    }

    tweenCamera(app, to) {
        const from = {
            x: app.camera.position.x,
            y: app.camera.position.y,
            z: app.camera.position.z,
        };

        new TWEEN.Tween(from)
            .to(to, 600)
            .easing(TWEEN.Easing.Linear.None)
            .onUpdate((e) => {
                app.camera.position.set(e.x, e.y, e.z);
                app.camera.lookAt(new THREE.Vector3(0, 0, 0));
            })
            .onComplete(() => {
                app.camera.lookAt(new THREE.Vector3(0, 0, 0));
            })
            .start();
    }
}
