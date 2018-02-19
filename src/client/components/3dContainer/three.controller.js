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
        let app = initScene($('#canvas')[0]);
        app = initLights(app);
        app = initCamera(app);
        // initMesh(app).then((app) => {
        //     app.render();
        //     this.manipulator = new Manipulate(app.meshes);
        // });
        $.ajax('/boat')
            .done((data) => {
                app = initCurves(app, data);
                app.render();
                // this.setupMenu();
            })
            .fail((res, error) => {
                console.log(error);
            });
    }
}
