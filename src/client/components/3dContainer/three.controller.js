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
import CurvesController from './controllers/curves.controller';


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
        this.curveController = new CurvesController();
        this.boatParametersService.loadBoat('/boat')
            .done((data) => {
                this.$scope.$apply(() => {
                    this.app = this.curveController.initCurves(this.app, data);
                    this.oldValues = JSON.parse(JSON.stringify(this.boatParametersService.updatePoint(data)));
                    this.app.render();
                });
            })
            .fail((res, error) => {
                console.log(error);
            });

        this.$scope.$watchCollection(
            () => this.boatParametersService.checkUpdate(), // what we're watching.
            (newVal, oldVal, scope) => { // what we do if there's been a change.
                this.updateCurves();
            });
    }

    updateCurves() {
        const current = this.boatParametersService.getBoat();
        if (current === undefined) {
            return;
        }
        if (this.oldValues === undefined) {
            this.oldValues = current;
            return;
        }
        // itterate the different curves
        const updates = [];
        Object.keys(current).forEach((key) => {
            // itterate the properties of each curve
            Object.keys(current[key]).forEach((prop) => {
                if (current[key][prop][0] !== this.oldValues[key][prop][0]) {
                    updates.push({key, values: current[key]});
                }
            });
        });
        this.oldValues = JSON.parse(JSON.stringify(current));
        const updateObj = {};
        updates.forEach((update) => {
            this.curveController.deleteCurve(this.app, update);
            updateObj[update.key] = current[update.key];
        });
        this.curveController.initCurves(this.app, updateObj);
    }
}
