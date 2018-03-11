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
    constructor($scope, $timeout, boatParametersService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
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
        this.$timeout(() => {
            const data = this.boatParametersService.getBoat();
            this.app = this.curveController.initCurves(this.app, data);
            this.oldValues = JSON.parse(JSON.stringify(this.boatParametersService.updatePoint(data)));
            this.app.render();

            this.$scope.$watchCollection(
                () => this.boatParametersService.checkUpdate(), // what we're watching.
                (newVal, oldVal, scope) => { // what we do if there's been a change.
                    this.updateCurves();
                });
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
            // If the key is width, height, or length, we actually need to update every
            // curve in the boat so we itterate the array again and push every curve to
            // the updates array. NOTE: we could actually skip updating the keel curves.
            // TODO: This feels pretty hacky, we should consider a different strategy later.
            if (key === 'width' || key === 'height' || key === 'length') {
                if (current[key] === this.oldValues[key]) {
                    return;
                }
                Object.keys(current).forEach((innerKey) => {
                    if (innerKey === 'width' || innerKey === 'height' || innerKey === 'length' || innerKey === 'frames') {
                        return;
                    }
                    updates.push({key: innerKey, values: current[innerKey]});
                });
            }
            // itterate the properties of each curve
            Object.keys(current[key]).forEach((prop) => {
                if (current[key][prop][0] !== this.oldValues[key][prop][0]) {
                    updates.push({key, values: current[key]});
                }
                if (current[key][prop][1] !== this.oldValues[key][prop][1]) {
                    updates.push({key, values: current[key]});
                }
                if (current[key][prop][2] !== this.oldValues[key][prop][2]) {
                    updates.push({key, values: current[key]});
                }
            });
        });
        this.oldValues = JSON.parse(JSON.stringify(current));
        const updateObj = {};
        updates.forEach((update) => {
            this.app = this.curveController.deleteCurve(this.app, update);
            updateObj[update.key] = current[update.key];
        });
        updateObj.width = current.width;
        updateObj.height = current.height;
        updateObj.length = current.length;
        this.curveController.initCurves(this.app, updateObj);
    }
}
