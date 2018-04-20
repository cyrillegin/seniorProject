/*
    mesh.controller.js
    Authors: Cyrille Gindreau
*/
import 'three';
import 'three/examples/js/loaders/MTLLoader';
import 'three/examples/js/exporters/OBJExporter';
import 'three/examples/js/exporters/STLExporter';
import {applyOffsets, casteljauPoint} from '../../../utility/calculations';

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
        let parts = this.splitCurve(this.boat.aftBeam, this.boat.aftChine);

        // Outer mesh
        let nextParts = this.splitCurve(this.boat.foreBeam, this.boat.foreChine);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(this.boat.foreChine, this.boat.foreKeel);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(this.boat.aftChine, this.boat.aftKeel);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(this.boat.aftBeamEdge, this.boat.aftGunEdge);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(this.boat.foreBeamEdge, this.boat.foreGunEdge);
        nextParts.shift();
        parts = parts.concat(nextParts);

        // Define new boat for inner mesh.
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

        nextParts = this.splitCurve(this.boat.foreBeamEdge, this.boat.foreGunEdge);
        nextParts.shift();
        parts = parts.concat(nextParts);

        // Add inner mesh.
        nextParts = this.splitCurve(innerBoat.aftBeam, innerBoat.aftChine);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.foreBeam, innerBoat.foreChine);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.foreChine, innerBoat.foreKeel);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.aftChine, innerBoat.aftKeel);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.aftBeamEdge, innerBoat.aftGunEdge);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.foreBeamEdge, innerBoat.foreGunEdge);
        nextParts.shift();
        parts = parts.concat(nextParts);


        // Add trim (The part that attaches the inner boat to the outer boat)
        nextParts = this.splitCurve(innerBoat.aftBeam, this.boat.aftBeam);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.foreBeam, this.boat.foreBeam);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.aftBeamEdge, this.boat.aftBeamEdge);
        nextParts.shift();
        parts = parts.concat(nextParts);

        nextParts = this.splitCurve(innerBoat.foreBeamEdge, this.boat.foreBeamEdge);
        nextParts.shift();
        parts = parts.concat(nextParts);


        // Draw mesh.
        const firstElement = parts.pop();
        const initialFace = this.drawFace(firstElement);

        for (let i = 1; i < parts.length; i ++) {
            faces.push(this.drawFace(parts[i]));
        }

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

    splitCurve(curveA, curveB) {
        const parts = [{
            start: [
                [curveA.start[0], curveA.start[1], curveA.start[2]],
                [curveA.end[0], curveA.end[1], curveA.end[2]],
            ],
            end: [
                [curveB.start[0], curveB.start[1], curveB.start[2]],
                [curveB.end[0], curveB.end[1], curveB.end[2]],
            ],
        }];
        const itterations = 4;
        let lastA = casteljauPoint(curveA, 0);
        let lastB = casteljauPoint(curveB, 0);
        for (let i = 1; i < itterations + 1; i++) {
            const currentA = casteljauPoint(curveA, 1 / itterations * i);
            const currentB = casteljauPoint(curveB, 1 / itterations * i);
            parts.push({
                start: [
                    [lastA.x, lastA.y, lastA.z],
                    [currentA.x, currentA.y, currentA.z],
                ],
                end: [
                    [lastB.x, lastB.y, lastB.z],
                    [currentB.x, currentB.y, currentB.z],
                ],
            });
            lastA = currentA;
            lastB = currentB;
        }
        return parts;
    }

    drawFace(slice) {
        const geometry = new THREE.Geometry();
        const normal = new THREE.Vector3(0, 0, 0);
        geometry.vertices.push(
            new THREE.Vector3(slice.start[0][0], slice.start[0][1], slice.start[0][2]),
            new THREE.Vector3(slice.start[1][0], slice.start[1][1], slice.start[1][2]),
            new THREE.Vector3(slice.end[0][0], slice.end[0][1], slice.end[0][2]),
        );
        geometry.faces.push(new THREE.Face3(0, 1, 2, normal));

        geometry.vertices.push(
            new THREE.Vector3(slice.start[1][0], slice.start[1][1], slice.start[1][2]),
            new THREE.Vector3(slice.end[0][0], slice.end[0][1], slice.end[0][2]),
            new THREE.Vector3(slice.end[1][0], slice.end[1][1], slice.end[1][2]),
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
        // NOTE: due to the nature of face creation, every other face is 'backwards'.
        // In the display, we set double sided to true so that we don't notice.
        // Most 3d applications and 3d printers will also notice this and autocorrect.
        document.querySelector('#save-obj').addEventListener('click', (e) => {
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
        });
    }
}
