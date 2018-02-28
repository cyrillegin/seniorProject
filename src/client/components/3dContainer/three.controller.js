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
import curvesController from './controllers/curves.controller';


export default class ThreeContainer {
    constructor($scope, boatParametersService) {
        this.$scope = $scope;
        this.boatParametersService = boatParametersService;
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
                const cController = new curvesController();
                this.app = cController.initCurves(this.app, data);
                this.app.render();
            })
            .fail((res, error) => {
                console.log(error);
            });

        this.$scope.$watch(
            () => this.boatParametersService.getBoat(),
            (newVal, oldVal, scope) => {
                console.log('thing happened');
            }, true);
    }
    manipulateCurve() {
        console.log(this.app);
    }
}
