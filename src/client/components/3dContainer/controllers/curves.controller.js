import mirrorAttributes from '../../../utility/mirror';

export default class CurvesController {

    initCurves(app, boat) {
        app.curves = [];
        this.boat = boat;

        Object.keys(boat).forEach((key) => {
            if (key === 'width' || key === 'height' || key === 'length' || key === 'frames') {
                return;
            }
            if (key !== "aftBeam") return;
            // Define offsets
            const lengthOffset = key.toLowerCase().includes('aft') ? -this.boat.length : this.boat.length;
            const heightOffset = key.toLowerCase().includes('beam') ? -this.boat.height : this.boat.height;
            const widthOffset = key.toLowerCase().includes('mid') ? 0 : this.boat.width;

            // Apply offsets
            const curveCoordinates = boat[key];
            curveCoordinates.start[0] += widthOffset;
            curveCoordinates.startControl[0] += widthOffset;
            curveCoordinates.end[0] += widthOffset;
            curveCoordinates.endControl[0] += widthOffset;

            curveCoordinates.start[1] += heightOffset;
            curveCoordinates.startControl[1] += heightOffset;
            curveCoordinates.end[1] += heightOffset;
            curveCoordinates.endControl[1] += heightOffset;

            curveCoordinates.end[2] += lengthOffset;
            curveCoordinates.endControl[2] += lengthOffset;
            console.log(curveCoordinates)

            // Draw curve
            const curve = this.buildCurve(curveCoordinates, key);
            curve.name = `curve-${key}`;
            app.scene.add(curve);

            const mirror = this.buildCurve(mirrorAttributes(curveCoordinates, boat.width), key);
            mirror.name = `curve-mirror-${key}`;
            app.scene.add(mirror);

            const startControlLine = this.drawControlLine(boat[key].start, boat[key].startControl);
            startControlLine.name = `curve-start-${key}`;
            app.scene.add(startControlLine);

            const endControlLine = this.drawControlLine(boat[key].end, boat[key].endControl);
            endControlLine.name = `curve-end-${key}`;
            app.scene.add(endControlLine);

            const startPoint = this.drawCurvePoint(boat[key].start);
            startPoint.name = `start-point-${key}`;
            app.scene.add(startPoint);

            const endPoint = this.drawCurvePoint(boat[key].end);
            endPoint.name = `end-point-${key}`;
            app.scene.add(endPoint);

            const startControlPoint = this.drawCurveControlPoint(curveCoordinates.startControl);
            startControlPoint.name = `start-control-${key}`;
            app.scene.add(startControlPoint);

            const endControlPoint = this.drawCurveControlPoint(curveCoordinates.endControl);
            endControlPoint.name = `end-control-${key}`;
            app.scene.add(endControlPoint);

        });
        return app;
    }

    deleteCurve(app, update) {
        const curve = app.scene.getObjectByName(`curve-${update.key}`);
        app.scene.remove(curve);
        const mirror = app.scene.getObjectByName(`curve-mirror-${update.key}`);
        app.scene.remove(mirror);
        const startControl = app.scene.getObjectByName(`curve-start-${update.key}`);
        app.scene.remove(startControl);
        const endControl = app.scene.getObjectByName(`curve-end-${update.key}`);
        app.scene.remove(endControl);

        const start = app.scene.getObjectByName(`start-point-${update.key}`);
        app.scene.remove(start);
        const end = app.scene.getObjectByName(`end-point-${update.key}`);
        app.scene.remove(end);
        const startPoint = app.scene.getObjectByName(`start-control-${update.key}`);
        app.scene.remove(startPoint);
        const endPoint = app.scene.getObjectByName(`end-control-${update.key}`);
        app.scene.remove(endPoint);
    }

    buildCurve(curveAttributes, key) {
        const newCurve = this.defineCurve(curveAttributes, key);

        const points = newCurve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({color: 0xff0000});
        const curveObject = new THREE.Line(geometry, material);
        return curveObject;
    }

    defineCurve(curveAttributes, key) {
        const pointA = new THREE.Vector3(curveAttributes.start[0], curveAttributes.start[1], curveAttributes.start[2]);
        const pointB = new THREE.Vector3(curveAttributes.startControl[0], curveAttributes.startControl[1], curveAttributes.startControl[2]);
        const pointC = new THREE.Vector3(curveAttributes.endControl[0], curveAttributes.endControl[1], curveAttributes.endControl[2]);
        const pointD = new THREE.Vector3(curveAttributes.end[0], curveAttributes.end[1], curveAttributes.end[2]);
        const newCurve = new THREE.CubicBezierCurve3(pointA, pointB, pointC, pointD);
        return newCurve;
    }

    drawCurvePoint(location) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(location[0], location[1], location[2]);
        return mesh;
    }

    drawCurveControlPoint(location) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(location[0], location[1], location[2]);
        return mesh;
    }

    drawControlLine(start, end) {
        const material = new THREE.LineBasicMaterial({
            color: 0x000088,
        });

        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(start[0], start[1], start[2]),
            new THREE.Vector3(end[0], end[1], end[2]),
        );

        const line = new THREE.Line(geometry, material);
        return line;
    }
}
