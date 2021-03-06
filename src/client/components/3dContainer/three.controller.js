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
import CameraController from './controllers/camera.controller';
import MeshController from './controllers/mesh.controller';
import CurvesController from './controllers/curves.controller';

export default class ThreeContainer {
    constructor($scope, $timeout, boatParametersService, manipulateService) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
        this.manipulateService = manipulateService;
    }
    $onInit() {
        this.setupMenu();
        this.app = initScene(document.querySelector('#canvas'));
        this.app.displayVerticies = true;
        this.app.displayWireFrame = true;
        this.app.displayShaded = false;
        this.app = initLights(this.app);

        this.cameraController = new CameraController();
        this.app = this.cameraController.initCamera(this.app);
        this.meshController = new MeshController();
        this.curveController = new CurvesController();


        this.boatParametersService.getBoat()
            .then((data) => {
                this.app = this.curveController.initCurves(this.app, data);
                this.curveController.updateFrames(this.app, data);
                this.meshController.initMesh(this.app, data);
                this.meshController.showMesh(this.app.displayShaded);
                this.oldValues = JSON.parse(JSON.stringify(this.boatParametersService.updatePoint(data)));
                this.app.render();

                this.$scope.$watchCollection(
                    () => this.boatParametersService.checkUpdate(), // what we're watching.
                    (newVal, oldVal, scope) => { // what we do if there's been a change.
                        this.updateCurves();
                        this.meshController.deleteMesh(this.app);
                        const newBoat = this.boatParametersService.getBoat();
                        this.app = this.meshController.initMesh(this.app, newBoat);
                        this.meshController.showMesh(this.app.displayShaded);
                    });

                this.$scope.$watch(
                    () => this.manipulateService.getHoverInput(), // what we're watching.
                    (newVal, oldVal, scope) => { // what we do if there's been a change.
                        if (newVal === null || newVal === undefined) {
                            return;
                        }
                        const newBoat = this.boatParametersService.getBoat();
                        this.curveController.onHandleHover(this.app, newBoat[newVal], newVal);
                    });
                this.$scope.$watch(
                    () => this.manipulateService.getUnHoverInput(), // what we're watching.
                    (newVal, oldVal, scope) => { // what we do if there's been a change.
                        if (newVal === null || newVal === undefined) {
                            return;
                        }
                        const newBoat = this.boatParametersService.getBoat();
                        this.curveController.onHandleHoverOff(this.app, newBoat[newVal], newVal);
                    });
            })
            .catch((error) => {
                console.log('error loading boat');
                console.log(error);
            });
    }

    setupMenu() {
        // wire frame / shaded toggle
        // display vertix points toggle

        const menuContainer = document.querySelector('#three-menu');
        menuContainer.classList.toggle('menu-container-active');

        document.querySelector('#wire-frame-toggle').addEventListener('click', (e) => {
            this.app.displayWireFrame = !this.app.displayWireFrame;
            this.curveController.showCurves(this.app.displayWireFrame);
        });

        document.querySelector('#vertex-toggle').addEventListener('click', (e) => {
            this.app.displayVerticies = !this.app.displayVerticies;
            const boat = this.boatParametersService.getBoat();
            Object.keys(boat).forEach((key) => {
                if (key === 'width' || key === 'height' || key === 'length' || key === 'frames') {
                    return;
                }
                this.app = this.curveController.deleteCurve(this.app, {key});
            });
            this.curveController.initCurves(this.app, boat);
        });

        document.querySelector('#shaded-toggle').addEventListener('click', (e) => {
            this.app.displayShaded = ! this.app.displayShaded;
            this.meshController.showMesh(this.app.displayShaded);
        });

        // display debug frame rate toggle
        // A 3d axis thing would be useful
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
            if (key === 'frames') {
                return;
            }
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
        updateObj.frames = current.frames;

        this.curveController.initCurves(this.app, updateObj);
        this.curveController.updateFrames(this.app, current);
    }
}
