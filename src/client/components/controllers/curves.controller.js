const splineHelperObjects = [];
let positions = [];
const geometry = new THREE.BoxGeometry(20, 20, 20);
let splinePointsLength = 4;
const ARC_SEGMENTS = 200;
let splineMesh;
const splines = {};

const curves = [{
    label: 'AF',
    points: [[20, 0, 0], [0, 0, 50], [25, 0, 100]],
}];

function initCurves(app) {

    buildCurve(app);
    return app;
}

function buildCurve(app) {

    for (let i = 0; i < splinePointsLength; i ++) {
        addSplineObject(app, positions[ i ]);
    }

    positions = [];
    for (let i = 0; i < splinePointsLength; i ++) {
        positions.push(splineHelperObjects[ i ].position);
    }

    const geometry = new THREE.Geometry();
    for (let i = 0; i < ARC_SEGMENTS; i ++) {
        geometry.vertices.push(new THREE.Vector3());
    }
    // Create a curve
    const curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
        color: 0x0000ff,
        opacity: 0.35,
        linewidth: 2,
    }));
    curve.mesh.castShadow = true;
    splines.uniform = curve;

    curve.mesh.castShadow = true;

    splines.chordal = curve;
    for (const k in splines) {
        const spline = splines[ k ];
        app.scene.add(spline.mesh);
    }
    load([new THREE.Vector3(200, 460, 0),
        new THREE.Vector3(70, 170, 0),
        new THREE.Vector3(-70, 170, 0),
        new THREE.Vector3(-200, 460, 0)]);
    return app;
}

function addSplineObject(app, position) {
    const material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
    const object = new THREE.Mesh(geometry, material);
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
    splineHelperObjects.push(object);
    return object;
}

function load(newPositions) {
    while (newPositions.length > positions.length) {
        addPoint();
    }
    while (newPositions.length < positions.length) {
        removePoint();
    }
    for (let i = 0; i < positions.length; i ++) {
        positions[ i ].copy(newPositions[ i ]);
    }
    updateSplineOutline();
}

function addPoint() {
    splinePointsLength ++;
    positions.push(addSplineObject().position);
    updateSplineOutline();
}

function removePoint() {
    if (splinePointsLength <= 4) {
        return;
    }
    splinePointsLength --;
    positions.pop();
    scene.remove(splineHelperObjects.pop());
    updateSplineOutline();
}

function updateSplineOutline() {
    for (const k in splines) {
        const spline = splines[ k ];
        splineMesh = spline.mesh;
        for (let i = 0; i < ARC_SEGMENTS; i ++) {
            const p = splineMesh.geometry.vertices[ i ];
            const t = i / (ARC_SEGMENTS - 1);
            spline.getPoint(t, p);
        }
        splineMesh.geometry.verticesNeedUpdate = true;
    }
}

export default initCurves;
