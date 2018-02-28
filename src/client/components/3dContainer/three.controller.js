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
        this.curveController = new curvesController();
        this.boatParametersService.loadBoat('/boat')
            .done((data) => {
                this.app = this.curveController.initCurves(this.app, data);
                this.app.render();
            })
            .fail((res, error) => {
                console.log(error);
            });

        this.$scope.$watch(
            () => this.boatParametersService.getBoat(), // what we're watching.
            (newVal, oldVal, scope) => { // what we do if there's been a change.
                this.updateCurves(newVal);
            }, true);
    }
    updateCurves(val) {
        if (val === undefined) {
            return;
        }
        // Remove all of the old curves
        // TODO: Either parrallelize this or update on a per point basis.
        this.app.scene.children.forEach((child) => {
            if (child.type === 'Line' || child.type === 'Mesh') {
                this.app.scene.remove(child);
              
            }
        });
        // this.app.render()
        console.log(this.app.scene.children.length)
        // const thingToRemove = this.app.scene.getObjectByName('curve');
        // this.app.scene.remove(thingToRemove);
        // this.app.curves = [];
    }
}
