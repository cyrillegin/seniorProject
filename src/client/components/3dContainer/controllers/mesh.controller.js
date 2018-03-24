/*
    mesh.controller.js
    Authors: Cyrille Gindreau
*/
import 'three';
import 'three/examples/js/loaders/MTLLoader';

export default class MeshController {
    initMesh(app, boat) {
        console.log('drawing')
        const geometry = this.defineGeometry(boat);
        const material = this.defineMaterial();
        const mesh = new THREE.Mesh(geometry, material);

        app.mesh = mesh;
        app.scene.add(mesh);
        return app;
    }
    
    // For mirror, there is a copy function
    defineGeometry(boat) {
        const geometry = new THREE.Geometry();
        const copiedBoat = JSON.parse(JSON.stringify(boat));
        this.boat = {
            width: copiedBoat.width,
            height: copiedBoat.height,
            length: copiedBoat.length,
            frames: copiedBoat.frames,
        };
        Object.keys(copiedBoat).forEach((key) => {
            if (['width', 'height', 'length', 'frames'].indexOf(key) > -1) {
                return;
            }
            this.boat[key] = this.applyOffsets(copiedBoat[key], key);
        });

        geometry.vertices.push(
            new THREE.Vector3(this.boat.aftBeam.end[0], this.boat.aftBeam.end[1], this.boat.aftBeam.end[2]),
            new THREE.Vector3(this.boat.aftBeam.start[0], this.boat.aftBeam.start[1], this.boat.aftBeam.start[2]),
            new THREE.Vector3(this.boat.aftChine.start[0], this.boat.aftChine.start[1], this.boat.aftChine.start[2]),
        );

        geometry.faces.push(new THREE.Face3(0, 1, 2));

        geometry.vertices.push(
            new THREE.Vector3(this.boat.aftChine.end[0], this.boat.aftChine.end[1], this.boat.aftChine.end[2]),
            new THREE.Vector3(this.boat.aftChine.start[0], this.boat.aftChine.start[1], this.boat.aftChine.start[2]),
            new THREE.Vector3(this.boat.aftBeam.end[0], this.boat.aftBeam.end[1], this.boat.aftBeam.end[2]),
        );

        geometry.faces.push(new THREE.Face3(5, 4, 3));

        geometry.computeBoundingSphere();
        return geometry;
    }

    defineMaterial() {
        return new THREE.MeshBasicMaterial({color: 0xffff00});
    }

    // NOTE: This was copy/pasted from the curves controller.
    // TODO: Move both functions to calculations.
    applyOffsets(curve, key) {
        // Define offsets
        let lengthOffset = key.toLowerCase().includes('aft') ? -this.boat.length : this.boat.length;
        let heightOffset = key.toLowerCase().includes('beam') ? this.boat.height : -this.boat.height;
        const widthOffset = key.toLowerCase().includes('keel') ? 0 : this.boat.width;

        if (key.toLowerCase().includes('frame')) {
            heightOffset = this.boat.height;
        }
        if (key.toLowerCase().includes('mid')) {
            lengthOffset = 0;
        }
        console.log(curve)

        // Apply offsets
        const curveCoordinates = curve;
        if (! key.toLowerCase().includes('edge')) {
            curveCoordinates.start[0] += widthOffset;
            curveCoordinates.startControl[0] += widthOffset;
        }
        curveCoordinates.end[0] += widthOffset;
        curveCoordinates.endControl[0] += widthOffset;

        curveCoordinates.start[1] += heightOffset;
        curveCoordinates.startControl[1] += heightOffset;
        if (key.toLowerCase().includes('frame')) {
            heightOffset = -heightOffset;
        }
        curveCoordinates.end[1] += heightOffset;
        curveCoordinates.endControl[1] += heightOffset;

        curveCoordinates.end[2] += lengthOffset;
        curveCoordinates.endControl[2] += lengthOffset;
        if (key.toLowerCase().includes('edge') || key.toLowerCase().includes('frame')) {
            curveCoordinates.start[2] += lengthOffset;
            curveCoordinates.startControl[2] += lengthOffset;
        }
        return curveCoordinates;
    }
}


// The following is what was used to load the canoe. Leaving it here as reference.
//
// function initMesh(app) {
//     // TODO: look into async/await for this.
//     return new Promise((resolve, reject) => {
//         loadMaterial('canoe.mtl')
//             .then((material) => {
//                 loadMesh('models/canoe.obj', material)
//                     .then((boat) => {
//                         boat.position.set(0, 0, 0);
//                         app.scene.add(boat);
//                         app.meshes.main = boat;
//                         resolve(app);
//                     });
//             });
//     });
// }
// 
// function loadMesh(file, material) {
//     return new Promise((resolve, reject) => {
//         const objLoader = new THREE.OBJLoader();
//         objLoader.setMaterials(material);
//         objLoader.load(
//             file,
//             (object) => {
//                 resolve(object);
//             },
//             // called when loading is in progresses
//             (xhr) => {
//                 // console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
//             },
//             // called when loading has errors
//             (error) => {
//                 console.log('An error happened');
//                 reject(error);
//             },
//         );
//     });
// }
// 
// // wrapper for loading materials onto objects.
// function loadMaterial(file) {
//     return new Promise((resolve, reject) => {
//         const mtlLoader = new THREE.MTLLoader();
//         mtlLoader.setBaseUrl('models/');
//         mtlLoader.setPath('models/');
//         mtlLoader.setTexturePath('models/');
//         mtlLoader.load(file, (materials) => {
//             materials.preload();
//             materials.materials.initialShadingGroup.color = new THREE.Color(1, 1, 1);
//             resolve(materials);
//         });
//     });
// }
// 
// export default initMesh;
