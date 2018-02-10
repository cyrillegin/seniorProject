import mirrorAttributes from '../../../utility/mirror';


function initCurves(app, boat) {
    app.curves = [];
    Object.keys(boat).forEach((key) => {
        const newCurve = buildCurve(boat[key]);
        app.scene.add(newCurve);
        app.curves.push(newCurve);
        const mirrorCurve = buildCurve(mirrorAttributes(boat[key]));
        app.scene.add(mirrorCurve);
        app.curves.push(mirrorCurve);
    });
    return app;
}

function buildCurve(curveAttributes) {
    const newCurve = new THREE.CubicBezierCurve3(
        new THREE.Vector3(curveAttributes.startControl[0], curveAttributes.startControl[1], curveAttributes.startControl[2]),
        new THREE.Vector3(curveAttributes.start[0], curveAttributes.start[1], curveAttributes.start[2]),
        new THREE.Vector3(curveAttributes.endControl[0], curveAttributes.endControl[1], curveAttributes.endControl[2]),
        new THREE.Vector3(curveAttributes.end[0], curveAttributes.end[1], curveAttributes.end[2]),
    );
    const points = newCurve.getPoints(50);
    const geometry = new THREE.BufferGeometry().setFromPoints(points);

    const material = new THREE.LineBasicMaterial({color: 0xff0000});
    const curveObject = new THREE.Line(geometry, material);
    return curveObject;
}

export default initCurves;
