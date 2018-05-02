import mirrorAttributes from '../../../utility/mirror';
import {casteljauPoint, applyOffsets, casteljauFromY} from '../../../utility/calculations';

export default class CurvesController {
    constructor() {
        'ngInject';
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
            const curveCoordinates = applyOffsets(this.boat, this.boat[key], key);
            this.curveObjects.push(this.drawCurve(app, curveCoordinates, key));
        });
        return app;
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

    drawLine(start, end, name) {
        const material = new THREE.LineBasicMaterial({color: 0x9400D3});
        const geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(start.x, start.y, start.z));
        geometry.vertices.push(new THREE.Vector3(end.x, end.y, end.z));
        const line = new THREE.Line(geometry, material);
        line.name = name;
        return line;
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
        const curveCoordinates = applyOffsets(this.boat, curveCopy, key);
        const newCurve = this.drawCurve(app, curveCoordinates, key);
        this.curveObjects.push(newCurve);
    }

    onHandleHoverOff(app, curve, key) {
        this.deleteCurve(app, {key});
        this.curveColor = 0xff0000;
        const curveCopy = JSON.parse(JSON.stringify(curve));
        const curveCoordinates = applyOffsets(this.boat, curveCopy, key);
        const newCurve = this.drawCurve(app, curveCoordinates, key);
        this.curveObjects.push(newCurve);
    }

    showCurves(show) {
        this.curveObjects.forEach((curveObject) => {
            Object.keys(curveObject).forEach((piece) => {
                curveObject[piece].visible = show;
            });
        });
    }

    drawFrames(app, boat) {
        if (Object.keys(boat).length < 5) {
            return;
        }
        const frameLines = [];
        boat.frames.forEach((frame, index) => {
            // calculate frames, returns a beam point, a chine point, and the keel point
            const {locationA, locationB, locationC} = this.findLocation(boat, frame);

            // Draws a line from the beam to the chine
            frameLines.push(this.drawLine(locationA, locationB, `beam-chine-frame-${index}`));
            // Draws a line from the chine to the keel
            frameLines.push(this.drawLine(locationB, locationC, `chine-keel-frame-${index}`));

            // Draw mirror.
            locationA.x = -locationA.x;
            locationB.x = -locationB.x;
            frameLines.push(this.drawLine(locationA, locationB, `beam-chine-frame-mirror-${index}`));
            frameLines.push(this.drawLine(locationB, locationC, `chine-keel-frame-mirror-${index}`));
        });

        // Add the newly created lines to the scene
        frameLines.forEach((line) => {
            app.scene.add(line);
            this.curveObjects.push({line});
        });

        return frameLines;
    }

    updateFrames(app, boat) {
        this.removeFrames(app);
        const boatCopy = JSON.parse(JSON.stringify(boat));
        Object.keys(boatCopy).forEach((key) => {
            if (key === 'width' || key === 'height' || key === 'length' || key === 'frames') {
                return;
            }
            boatCopy[key] = applyOffsets(this.boat, boatCopy[key], key);
        });
        this.drawFrames(app, boatCopy);
    }

    findLocation(boat, frame) {
        let beamCurve;
        let chineCurve;
        let keelCurve;
        let t1;
        let t2;
        let t3;
        if (frame.distanceFromBack < boat.length) {
            beamCurve = boat.aftBeam;
            chineCurve = boat.aftChine;
            keelCurve = boat.aftKeel;
            t1 = casteljauFromY(beamCurve, boat.length - frame.distanceFromBack);
            t2 = casteljauFromY(chineCurve, boat.length - frame.distanceFromBack);
            t3 = casteljauFromY(keelCurve, boat.length - frame.distanceFromBack);
        } else {
            beamCurve = boat.foreBeam;
            chineCurve = boat.foreChine;
            keelCurve = boat.foreKeel;
            t1 = casteljauFromY(beamCurve, frame.distanceFromBack - boat.length);
            t2 = casteljauFromY(chineCurve, frame.distanceFromBack - boat.length);
            t3 = casteljauFromY(keelCurve, frame.distanceFromBack - boat.length);
        }

        const locationA = casteljauPoint(beamCurve, t1);
        const locationB = casteljauPoint(chineCurve, t2);
        const locationC = casteljauPoint(keelCurve, t3);
        return {locationA, locationB, locationC};
    }

    removeFrames(app) {
        // 15 is the max number of frames allowable. We can't use boat.frames.length
        // because that number could be lower than the actual number of frames in the scene.
        // ie: i had 12 frames, now I want 11.
        for (let i = 0; i < 15; i++) {
            const frameA = app.scene.getObjectByName(`beam-chine-frame-${i}`);
            app.scene.remove(frameA);
            const frameB = app.scene.getObjectByName(`chine-keel-frame-${i}`);
            app.scene.remove(frameB);
            const frameC = app.scene.getObjectByName(`beam-chine-frame-mirror-${i}`);
            app.scene.remove(frameC);
            const frameD = app.scene.getObjectByName(`chine-keel-frame-mirror-${i}`);
            app.scene.remove(frameD);
        }
    }
}
