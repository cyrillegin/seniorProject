
const curveAttributes = {
    positions: [],
    splines: {},
    splineHelperObjects: [],
    splineMesh: null,
    geometry: new THREE.BoxGeometry(3, 3, 3),
};

const curves = [{
    label: 'AF',
    points: [[20, 0, 0], [0, 0, 50], [25, 0, 100]],
}];

function initCurves(app) {

    buildCurve(app);
    return app;
}

function buildCurve(app) {

    for (let i = 0; i < 3; i ++) {
        addSplineObject(app, curveAttributes.positions[ i ]);
    }

    // Add the blocks
    curveAttributes.positions = [];
    for (let i = 0; i < 3; i ++) {
        curveAttributes.positions.push(curveAttributes.splineHelperObjects[i].position);
    }

    // Curve geometry.
    const geometry = new THREE.Geometry();
    for (let i = 0; i < 200; i ++) {
        geometry.vertices.push(new THREE.Vector3());
    }
    // Create a curve
    const curve = new THREE.CatmullRomCurve3(curveAttributes.positions);
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
        color: 0x0000ff,
        opacity: 0.35,
        linewidth: 2,
    }));
    curve.mesh.castShadow = true;
    curveAttributes.splines.uniform = curve;
    curve.mesh.castShadow = true;

    curveAttributes.splines.chordal = curve;
    for (const k in curveAttributes.splines) {
        const spline = curveAttributes.splines[k];
        app.scene.add(spline.mesh);
    }
    const toLoad = [];
    curves[0].points.forEach((curve) => {
        toLoad.push(new THREE.Vector3(curve[0], curve[1], curve[2]));
    });

    while (toLoad.length > curveAttributes.positions.length) {
        curveAttributes.positions.push(addSplineObject().position);
    }

    for (let i = 0; i < curveAttributes.positions.length; i ++) {
        curveAttributes.positions[i].copy(toLoad[i]);
    }
    for (const k in curveAttributes.splines) {
        const spline = curveAttributes.splines[k];
        curveAttributes.splineMesh = spline.mesh;
        for (let i = 0; i < 200; i ++) {
            const p = curveAttributes.splineMesh.geometry.vertices[i];
            const t = i / (200 - 1);
            spline.getPoint(t, p);
        }
        curveAttributes.splineMesh.geometry.verticesNeedUpdate = true;
    }

    return app;
}

// This function shows the control points.
function addSplineObject(app, position) {
    const material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
    const object = new THREE.Mesh(curveAttributes.geometry, material);
    if (position) {
        object.position.copy(position);
    } else {
        object.position.x = Math.random() * 1000 - 500;
        object.position.y = Math.random() * 600;
        object.position.z = Math.random() * 800 - 400;
    }
    object.castShadow = true;
    object.receiveShadow = true;
    app.scene.add(object);
    curveAttributes.splineHelperObjects.push(object);
    return object;
}

export default initCurves;
