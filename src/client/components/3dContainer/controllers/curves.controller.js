import mirrorAttributes from '../../../utility/mirror';

export default class CurvesController {

    initCurves(app, boat) {
        app.curves = [];
        this.boat = boat;

        Object.keys(boat).forEach((key) => {
            if (key === 'width' || key === 'height' || key === 'length' || key === 'frames') {
                return;
            }

            const curve = this.buildCurve(boat[key], key);
            curve.name = `curve-${key}`;
            app.scene.add(curve);

            const mirror = this.buildCurve(mirrorAttributes(boat[key], boat.width), key);
            mirror.name = `curve-mirror-${key}`;
            app.scene.add(mirror);

            const startControlLine = this.drawControlLine(boat[key].start, boat[key].startControl);
            startControlLine.name = `curve-start-${key}`;
            app.scene.add(startControlLine);

            const endControlLine = this.drawControlLine(boat[key].end, boat[key].endControl);
            endControlLine.name = `curve-end-${key}`;
            app.scene.add(endControlLine);

            const startPoint = this.drawCurvePoint(boat[key].start, 0);
            startPoint.name = `start-point-${key}`;
            app.scene.add(startPoint);

            const lenOffset = key.startsWith('aft') ? -this.boat.length : this.boat.length;
            const endPoint = this.drawCurvePoint(boat[key].end, lenOffset);
            endPoint.name = `end-point-${key}`;
            app.scene.add(endPoint);

            const startControlPoint = this.drawCurveControlPoint(boat[key].startControl);
            startControlPoint.name = `start-control-${key}`;
            app.scene.add(startControlPoint);

            const endControlPoint = this.drawCurveControlPoint(boat[key].endControl, lenOffset);
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
        const lenOffset = key.startsWith('aft') ? -this.boat.length : this.boat.length;
        const pointA = new THREE.Vector3(this.boat.width + curveAttributes.start[0], this.boat.height + curveAttributes.start[1], curveAttributes.start[2]);
        const pointB = new THREE.Vector3(this.boat.width + curveAttributes.startControl[0], this.boat.height + curveAttributes.startControl[1], curveAttributes.startControl[2]);
        const pointC = new THREE.Vector3(this.boat.width + curveAttributes.end[0], this.boat.height + curveAttributes.end[1], lenOffset + curveAttributes.end[2]);
        const pointD = new THREE.Vector3(this.boat.width + curveAttributes.endControl[0], this.boat.height + curveAttributes.endControl[1], lenOffset + curveAttributes.endControl[2]);
        const newCurve = new THREE.CubicBezierCurve3(pointA, pointB, pointC, pointD);
        return newCurve;
    }

    drawCurvePoint(location, lenOffset) {
        const geometry = new THREE.BoxGeometry(2, 2, 2);
        const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.boat.width + location[0], this.boat.height + location[1], lenOffset + location[2]);
        return mesh;
    }

    drawCurveControlPoint(location, lenOffset) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(this.boat.width + location[0], this.boat.height + location[1], lenOffset + location[2]);
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
