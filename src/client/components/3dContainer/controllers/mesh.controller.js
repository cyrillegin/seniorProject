/*
    mesh.controller.js
    Authors: Cyrille Gindreau
*/
import 'three';
import 'three/examples/js/loaders/MTLLoader';
import {applyOffsets} from '../../../utility/calculations';

export default class MeshController {
    initMesh(app, boat) {
        const geometry = this.defineGeometry(boat);
        const uvedGeometry = this.defineUvs(geometry);
        const material = this.defineMaterial();
        this.mesh = new THREE.Mesh(uvedGeometry, material);

        app.mesh = this.mesh;
        app.scene.add(this.mesh);
        return app;
    }

    // For mirror, there is a copy function, we'll need to do it after a merge of half the boat.
    defineGeometry(boat) {
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
            this.boat[key] = applyOffsets(this.boat, copiedBoat[key], key);
        });

        const face1 = this.drawFace(this.boat.aftBeam, this.boat.aftChine);
        const face2 = this.drawFace(this.boat.foreBeam, this.boat.foreChine);
        const face3 = this.drawFace(this.boat.foreChine, this.boat.foreKeel);
        const face4 = this.drawFace(this.boat.aftChine, this.boat.aftKeel);
        const face5 = this.drawFace(this.boat.aftBeamEdge, this.boat.aftGunEdge);
        const face6 = this.drawFace(this.boat.foreBeamEdge, this.boat.foreGunEdge);
        face1.merge(face2);
        face1.merge(face3);
        face1.merge(face4);
        face1.merge(face5);
        face1.merge(face6);

        face1.mergeVertices();
        face1.uvsNeedUpdate = true;

        const mirror = face1.clone();
        mirror.scale(-1, 1, 1);
        mirror.mergeVertices();
        mirror.uvsNeedUpdate = true;
        face1.merge(mirror);

        return face1;
    }

    drawFace(curveA, curveB) {
        const geometry = new THREE.Geometry();
        const normal = new THREE.Vector3(0, 0, 0);
        geometry.vertices.push(
            new THREE.Vector3(curveA.end[0], curveA.end[1], curveA.end[2]),
            new THREE.Vector3(curveA.start[0], curveA.start[1], curveA.start[2]),
            new THREE.Vector3(curveB.start[0], curveB.start[1], curveB.start[2]),
        );
        geometry.faces.push(new THREE.Face3(0, 1, 2, normal));

        geometry.vertices.push(
            new THREE.Vector3(curveB.end[0], curveB.end[1], curveB.end[2]),
            new THREE.Vector3(curveB.start[0], curveB.start[1], curveB.start[2]),
            new THREE.Vector3(curveA.end[0], curveA.end[1], curveA.end[2]),
        );
        geometry.faces.push(new THREE.Face3(3, 4, 5, normal));

        geometry.computeBoundingSphere();

        return geometry;
    }

    defineUvs(geometry) {
        // NOTE: The following was taken from: https://stackoverflow.com/questions/20774648/three-js-generate-uv-coordinate
        // TODO: We'll need to run our own uving system but this seems to work okay for the time being.
        geometry.faceVertexUvs[0] = [];

        geometry.faces.forEach((face) => {

            const components = ['x', 'y', 'z'].sort((a, b) => Math.abs(face.normal[a]) > Math.abs(face.normal[b]));

            const v1 = geometry.vertices[face.a];
            const v2 = geometry.vertices[face.b];
            const v3 = geometry.vertices[face.c];

            geometry.faceVertexUvs[0].push([
                new THREE.Vector2(v1[components[0]], v1[components[1]]),
                new THREE.Vector2(v2[components[0]], v2[components[1]]),
                new THREE.Vector2(v3[components[0]], v3[components[1]]),
            ]);

        });

        geometry.uvsNeedUpdate = true;
        return geometry;
    }

    defineMaterial() {
        const texture = new THREE.TextureLoader().load('models/wood_texture.jpg');
        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;
        texture.repeat.set(0.1, 0.05);
        const material = new THREE.MeshBasicMaterial({map: texture});
        material.setValues({
            side: THREE.DoubleSide,
        });
        return material;
    }

    showMesh(show) {
        this.mesh.visible = show;
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
