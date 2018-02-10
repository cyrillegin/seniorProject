import mirrorAttributes from '../../../utility/mirror';


function initCurves(app, boat) {
    app.curves = [];

    Object.keys(boat).forEach((key) => {
        const curveMesh = {
            curve: buildCurve(boat[key]),
            mirror: buildCurve(mirrorAttributes(boat[key])),
            points: [],
        };
        curveMesh.points.push(drawCurvePoint(boat[key].start));
        curveMesh.points.push(drawCurvePoint(boat[key].end));
        curveMesh.points.push(drawCurveControlPoint(boat[key].startControl));
        curveMesh.points.push(drawCurveControlPoint(boat[key].endControl));
        app.scene.add(curveMesh.curve);
        app.scene.add(curveMesh.mirror);
        curveMesh.points.forEach((point) => {
            app.scene.add(point);
        });
        app.curves.push(curveMesh);
    });
    return app;
}

function buildCurve(curveAttributes) {
    const newCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(curveAttributes.start[0], curveAttributes.start[1], curveAttributes.start[2]),
        new THREE.Vector3(curveAttributes.startControl[0], curveAttributes.startControl[1], curveAttributes.startControl[2]),
        new THREE.Vector3(curveAttributes.endControl[0], curveAttributes.endControl[1], curveAttributes.endControl[2]),
        new THREE.Vector3(curveAttributes.end[0], curveAttributes.end[1], curveAttributes.end[2]),
    );
    const points = newCurve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({color: 0xff0000});
    const curveObject = new THREE.Line(geometry, material);
    return curveObject;
}

function drawCurvePoint(location) {
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshBasicMaterial({color: 0x00ff00});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(location[0], location[1], location[2]);
    return mesh;
}

function drawCurveControlPoint(location) {
    const geometry = new THREE.BoxGeometry(1, 1, 1);
    const material = new THREE.MeshBasicMaterial({color: 0x0000ff});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(location[0], location[1], location[2]);
    return mesh;
}

export default initCurves;
