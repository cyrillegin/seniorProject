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

// controller imports
import initScene from './controllers/scene.controller';
import initLights from './controllers/lights.controller';
import initCamera from './controllers/camera.controller';
// import initMesh from './controllers/mesh.controller';
import initCurves from './controllers/curves.controller';


export default class ThreeContainer {
    constructor($scope) {
        this.$scope = $scope;
    }
    $onInit() {
        this.app = initScene($('#canvas')[0]);
        this.app = initLights(this.app);
        this.app = initCamera(this.app);
        // initMesh(this.app).then((this.app) => {
        //     this.app.render();
        //     this.manipulator = new Manipulate(this.app.meshes);
        // });
        $.ajax('/boat')
            .done((data) => {
                this.app = initCurves(this.app, data);
                this.app.render();
            })
            .fail((res, error) => {
                console.log(error);
            });
    }
    manipulateCurve() {
        console.log(this.app);
    }
}
