/*
    mesh.controller.js
    Authors: Cyrille Gindreau
*/
import 'three';
import 'three/examples/js/loaders/MTLLoader';
import 'three/examples/js/exporters/OBJExporter';
import 'three/examples/js/exporters/STLExporter';
import {applyOffsets} from '../../../utility/calculations';

export default class MeshController {
    initMesh(app, boat) {
        const geometry = this.defineGeometry(boat);
        const uvedGeometry = this.defineUvs(geometry);
        const material = this.defineMaterial();
        this.mesh = new THREE.Mesh(uvedGeometry, material);

        app.mesh = this.mesh;
        app.scene.add(this.mesh);
        this.setupIO();
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

        const faces = [];
        // base mesh to merge everything too
        const initialFace = this.drawFace(this.boat.aftBeam, this.boat.aftChine);
        // Outer mesh
        faces.push(this.drawFace(this.boat.foreBeam, this.boat.foreChine));
        faces.push(this.drawFace(this.boat.foreChine, this.boat.foreKeel));
        faces.push(this.drawFace(this.boat.aftChine, this.boat.aftKeel));
        faces.push(this.drawFace(this.boat.aftBeamEdge, this.boat.aftGunEdge));
        faces.push(this.drawFace(this.boat.foreBeamEdge, this.boat.foreGunEdge));

        // define new boat for inner mesh.
        const innerBoat = JSON.parse(JSON.stringify(boat));
        innerBoat.width -= 1;
        innerBoat.height -= 1;
        innerBoat.length -= 1;

        Object.keys(innerBoat).forEach((key) => {
            if (['width', 'height', 'length', 'frames'].indexOf(key) > -1) {
                return;
            }
            innerBoat[key] = applyOffsets(innerBoat, innerBoat[key], key);
        });
        // we add on to all the top y values to offset the -1 in height.
        // This will make it so that our trim later on will be perfectly horizontal.
        innerBoat.aftBeam.start[1] += 1;
        innerBoat.aftBeam.end[1] += 1;
        innerBoat.foreBeam.start[1] += 1;
        innerBoat.foreBeam.end[1] += 1;
        innerBoat.aftBeamEdge.start[1] += 1;
        innerBoat.aftBeamEdge.end[1] += 1;
        innerBoat.foreBeamEdge.start[1] += 1;
        innerBoat.foreBeamEdge.end[1] += 1;

        // Add inner mesh.
        faces.push(this.drawFace(innerBoat.aftBeam, innerBoat.aftChine));
        faces.push(this.drawFace(innerBoat.foreBeam, innerBoat.foreChine));
        faces.push(this.drawFace(innerBoat.foreChine, innerBoat.foreKeel));
        faces.push(this.drawFace(innerBoat.aftChine, innerBoat.aftKeel));
        faces.push(this.drawFace(innerBoat.aftBeamEdge, innerBoat.aftGunEdge));
        faces.push(this.drawFace(innerBoat.foreBeamEdge, innerBoat.foreGunEdge));

        // Add trim (The part that attaches the inner boat to the outer boat)
        faces.push(this.drawFace(innerBoat.aftBeam, this.boat.aftBeam));
        faces.push(this.drawFace(innerBoat.foreBeam, this.boat.foreBeam));
        faces.push(this.drawFace(innerBoat.aftBeamEdge, this.boat.aftBeamEdge));
        faces.push(this.drawFace(innerBoat.foreBeamEdge, this.boat.foreBeamEdge));

        // Merge faces
        faces.forEach((face) => {
            initialFace.merge(face);
        });

        initialFace.mergeVertices();
        initialFace.uvsNeedUpdate = true;

        const mirror = initialFace.clone();
        mirror.scale(-1, 1, 1);
        mirror.mergeVertices();
        mirror.uvsNeedUpdate = true;
        initialFace.merge(mirror);

        return initialFace;
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

    setupIO() {
        document.querySelector('#save-obj').addEventListener('click', (e) => {
            console.log('obj');
            const exporter = new THREE.OBJExporter();
            const data = exporter.parse(this.mesh);
            const file = new Blob([data], {type: 'OBJ'});
            const a = document.createElement('a');
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = 'boat.obj';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        });
        document.querySelector('#save-stl').addEventListener('click', (e) => {
            console.log('save stl');
            const exporter = new THREE.STLExporter();
            const data = exporter.parse(this.mesh);
            const file = new Blob([data], {type: 'STL'});
            const a = document.createElement('a');
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = 'boat.stl';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        })
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
