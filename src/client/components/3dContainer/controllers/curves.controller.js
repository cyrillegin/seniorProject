import mirrorAttributes from '../../../utility/mirror';

export default class CurvesController {
    constructor() {
        this.curveObjects = [];
    }

    initCurves(app, boat) {
        app.curves = [];
        this.boat = JSON.parse(JSON.stringify(boat));
        this.curveColor = 0xff0000;

        Object.keys(this.boat).forEach((key) => {
            if (key === 'width' || key === 'height' || key === 'length' || key === 'frames') {
                return;
            }

            const curveCoordinates = this.applyOffsets(this.boat[key], key);
            this.curveObjects.push(this.drawCurve(app, curveCoordinates, key));
        });

        this.curveObjects.concat(this.drawFrames(app, this.boat));

        return app;
    }

    drawFrames(app, boat) {
        if (Object.keys(boat).length < 5) {
            return;
        }
        const frameLines = [];
        boat.frames.forEach((frame, index) => {
            // Remove the old frames first.
            const frameA = app.scene.getObjectByName(`beam-chine-frame-${index}`);
            app.scene.remove(frameA);
            const frameB = app.scene.getObjectByName(`chine-keel-frame-${index}`);
            app.scene.remove(frameB);
            const frameC = app.scene.getObjectByName(`beam-chine-frame-mirror-${index}`);
            app.scene.remove(frameC);
            const frameD = app.scene.getObjectByName(`chine-keel-frame-mirror-${index}`);
            app.scene.remove(frameD);
            // calculate frames, returns a beam point, a chine point, and the keel point
            const {locationA, locationB, locationC} = this.findLocation(boat, frame);
            locationA.z = -locationA.z;
            locationB.z = -locationB.z;
            locationC.z = -locationC.z;
            frameLines.push(this.drawLine(locationA, locationB, `beam-chine-frame-${index}`));
            frameLines.push(this.drawLine(locationB, locationC, `chine-keel-frame-${index}`));
            
            locationA.x = -locationA.x;
            locationB.x = -locationB.x;
            frameLines.push(this.drawLine(locationA, locationB, `beam-chine-frame-mirror-${index}`));
            frameLines.push(this.drawLine(locationB, locationC, `chine-keel-frame-mirror-${index}`));
        });

        frameLines.forEach((line) => {
            app.scene.add(line);
        });

        return frameLines;
    }

    drawLine(start, end, name) {
        const material = new THREE.LineBasicMaterial({color: 0x9400D3});
        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(start.x, start.y, start.z));
        geometry.vertices.push(new THREE.Vector3(end.x, end.y, end.z));
        const line = new THREE.Line(geometry, material);
        line.name = name
        return line;
    }

    findLocation(boat, frame) {
        let T;
        let beamCurve;
        let chineCurve;
        let keelCurve;
        if (frame.distanceFromBack < boat.width) {
            T = (boat.width - frame.distanceFromBack) / boat.width;
            beamCurve = boat.aftBeam;
            chineCurve = boat.aftChine;
            keelCurve = boat.aftKeel;
        } else {
            T = (frame.distanceFromBack - boat.width) / boat.width;
            beamCurve = boat.foreBeam;
            chineCurve = boat.foreChine;
            keelCurve = boat.foreKeel;
        }
        const locationA = this.casteljauPoint(beamCurve, T);
        const locationB = this.casteljauPoint(chineCurve, T);
        const locationC = this.casteljauPoint(keelCurve, T);
        return {locationA, locationB, locationC};
    }

    // Implementation of casteljau's algorithem, adapted from 2d to 3d from
    // https://stackoverflow.com/questions/14174252/how-to-find-out-y-coordinate-of-specific-point-in-bezier-curve-in-canvas
    casteljauPoint(curve, t) {
        // Step 1
        const Ax = ((1 - t) * curve.start[0]) + (t * curve.start[0] + curve.startControl[0]);
        const Ay = ((1 - t) * curve.start[1]) + (t * curve.start[1] + curve.startControl[1]);
        const Az = ((1 - t) * curve.start[2]) + (t * curve.start[2] + curve.startControl[2]);
        const Bx = ((1 - t) * curve.start[0] + curve.startControl[0]) + (t * curve.end[0] + curve.endControl[0]);
        const By = ((1 - t) * curve.start[1] + curve.startControl[1]) + (t * curve.end[1] + curve.endControl[1]);
        const Bz = ((1 - t) * curve.start[2] + curve.startControl[2]) + (t * curve.end[2] + curve.endControl[2]);
        const Cx = ((1 - t) * curve.end[0] + curve.endControl[0]) + (t * curve.end[0]);
        const Cy = ((1 - t) * curve.end[1] + curve.endControl[1]) + (t * curve.end[1]);
        const Cz = ((1 - t) * curve.end[2] + curve.endControl[2]) + (t * curve.end[2]);

        // Step 2
        const Dx = ((1 - t) * Ax) + (t * Bx);
        const Dy = ((1 - t) * Ay) + (t * By);
        const Dz = ((1 - t) * Az) + (t * Bz);
        const Ex = ((1 - t) * Bx) + (t * Cx);
        const Ey = ((1 - t) * By) + (t * Cy);
        const Ez = ((1 - t) * Bz) + (t * Cz);

        // Step 3
        const Px = ((1 - t) * Dx) + (t * Ex);
        const Py = ((1 - t) * Dy) + (t * Ey);
        const Pz = ((1 - t) * Dz) + (t * Ez);
        return new THREE.Vector3(Px, Py, Pz);
    }

    drawCurve(app, curveCoordinates, key) {
        const curveObject = {};

        const curve = this.buildCurve(curveCoordinates, key);
        curve.name = `curve-${key}`;
        app.scene.add(curve);
        curveObject.curve = curve;

        const mirror = this.buildCurve(mirrorAttributes(curveCoordinates, this.boat.width), key);
        mirror.name = `curve-mirror-${key}`;
        app.scene.add(mirror);
        curveObject.mirror = mirror;

        if (app.displayVerticies) {
            const startControlLine = this.drawControlLine(curveCoordinates.start, curveCoordinates.startControl);
            startControlLine.name = `curve-start-${key}`;
            app.scene.add(startControlLine);
            curveObject.startControlLine = startControlLine;

            const endControlLine = this.drawControlLine(curveCoordinates.end, curveCoordinates.endControl);
            endControlLine.name = `curve-end-${key}`;
            app.scene.add(endControlLine);
            curveObject.endControlLine = endControlLine;

            const startPoint = this.drawCurvePoint(curveCoordinates.start);
            startPoint.name = `start-point-${key}`;
            app.scene.add(startPoint);
            curveObject.startPoint = startPoint;

            const endPoint = this.drawCurvePoint(curveCoordinates.end);
            endPoint.name = `end-point-${key}`;
            app.scene.add(endPoint);
            curveObject.endPoint = endPoint;

            const startControlPoint = this.drawCurveControlPoint(curveCoordinates.start, curveCoordinates.startControl);
            startControlPoint.name = `start-control-${key}`;
            app.scene.add(startControlPoint);
            curveObject.startControlPoint = startControlPoint;

            const endControlPoint = this.drawCurveControlPoint(curveCoordinates.end, curveCoordinates.endControl);
            endControlPoint.name = `end-control-${key}`;
            app.scene.add(endControlPoint);
            curveObject.endControlPoint = endControlPoint;
        }
        return curveObject;
    }

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

        // Apply offsets
        const curveCoordinates = curve;
        if (! key.toLowerCase().includes('edge')) {
            curveCoordinates.start[0] += widthOffset;
        }
        curveCoordinates.end[0] += widthOffset;

        curveCoordinates.start[1] += heightOffset;
        if (key.toLowerCase().includes('frame')) {
            heightOffset = -heightOffset;
        }
        curveCoordinates.end[1] += heightOffset;

        curveCoordinates.end[2] += lengthOffset;
        if (key.toLowerCase().includes('edge') || key.toLowerCase().includes('frame')) {
            curveCoordinates.start[2] += lengthOffset;
        }
        return curveCoordinates;
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
        return app;
    }

    onHandleHover(app, curve, key) {
        this.deleteCurve(app, {key});
        this.curveColor = 0x00ff00;
        const curveCopy = JSON.parse(JSON.stringify(curve));
        const curveCoordinates = this.applyOffsets(curveCopy, key);
        const newCurve = this.drawCurve(app, curveCoordinates, key);
        this.curveObjects.push(newCurve);
    }

    onHandleHoverOff(app, curve, key) {
        this.deleteCurve(app, {key});
        this.curveColor = 0xff0000;
        const curveCopy = JSON.parse(JSON.stringify(curve));
        const curveCoordinates = this.applyOffsets(curveCopy, key);
        const newCurve = this.drawCurve(app, curveCoordinates, key);
        this.curveObjects.push(newCurve);
    }

    buildCurve(curveAttributes, key) {
        const newCurve = this.defineCurve(curveAttributes, key);

        const points = newCurve.getPoints(50);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);

        const material = new THREE.LineBasicMaterial({color: this.curveColor});
        const curveObject = new THREE.Line(geometry, material);
        return curveObject;
    }

    defineCurve(curveAttributes, key) {
        const pointA = new THREE.Vector3(
            curveAttributes.start[0],
            curveAttributes.start[1],
            curveAttributes.start[2],
        );
        const pointB = new THREE.Vector3(
            curveAttributes.start[0] + curveAttributes.startControl[0],
            curveAttributes.start[1] + curveAttributes.startControl[1],
            curveAttributes.start[2] + curveAttributes.startControl[2],
        );
        const pointC = new THREE.Vector3(
            curveAttributes.end[0] + curveAttributes.endControl[0],
            curveAttributes.end[1] + curveAttributes.endControl[1],
            curveAttributes.end[2] + curveAttributes.endControl[2],
        );
        const pointD = new THREE.Vector3(
            curveAttributes.end[0],
            curveAttributes.end[1],
            curveAttributes.end[2],
        );
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

    drawCurveControlPoint(base, offset) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
        const mesh = new THREE.Mesh(geometry, material);
        mesh.position.set(base[0] + offset[0], base[1] + offset[1], base[2] + offset[2]);
        return mesh;
    }

    drawControlLine(start, end) {
        const material = new THREE.LineBasicMaterial({
            color: 0x000088,
        });

        const geometry = new THREE.Geometry();
        geometry.vertices.push(
            new THREE.Vector3(start[0], start[1], start[2]),
            new THREE.Vector3(start[0] + end[0], start[1] + end[1], start[2] + end[2]),
        );

        const line = new THREE.Line(geometry, material);
        return line;
    }

    showCurves(show) {
        this.curveObjects.forEach((curveObject) => {
            Object.keys(curveObject).forEach((piece) => {
                curveObject[piece].visible = show;
            });
        });
    }
}
