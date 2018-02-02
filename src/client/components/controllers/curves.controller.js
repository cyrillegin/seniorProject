let container, stats;
let camera, scene, renderer;
let splineHelperObjects = [], splineOutline;
let positions = [];
let options;
const geometry = new THREE.BoxGeometry(20, 20, 20);
let transformControl;
let splinePointsLength = 4;
const ARC_SEGMENTS = 200;
let splineMesh;
const splines = {};
const params = {
    uniform: true,
    tension: 0.5,
    centripetal: true,
    chordal: true,
    addPoint,
};

function initCurves(app) {


    const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
    planeGeometry.rotateX(- Math.PI / 2);

    const planeMaterial = new THREE.ShadowMaterial({opacity: 0.2});
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);

    plane.position.y = -200;
    plane.receiveShadow = true;
    app.scene.add(plane);

    const helper = new THREE.GridHelper(2000, 100);
    helper.position.y = - 199;
    helper.material.opacity = 0.25;
    helper.material.transparent = true;
    app.scene.add(helper);
    // var axes = new THREE.AxesHelper( 1000 );
    // axes.position.set( - 500, - 500, - 500 );
    // scene.add( axes );

    /** *****
* Curves
******** */
    for (var i = 0; i < splinePointsLength; i ++) {
        addSplineObject(app, positions[ i ]);
    }
    positions = [];
    for (var i = 0; i < splinePointsLength; i ++) {
        positions.push(splineHelperObjects[ i ].position);
    }
    const geometry = new THREE.Geometry();
    for (var i = 0; i < ARC_SEGMENTS; i ++) {
        geometry.vertices.push(new THREE.Vector3());
    }
    let curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
        color: 0xff0000,
        opacity: 0.35,
        linewidth: 2,
    }));
    curve.mesh.castShadow = true;
    splines.uniform = curve;
    curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'centripetal';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
        color: 0x00ff00,
        opacity: 0.35,
        linewidth: 2,
    }));
    curve.mesh.castShadow = true;
    splines.centripetal = curve;
    curve = new THREE.CatmullRomCurve3(positions);
    curve.curveType = 'chordal';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
        color: 0x0000ff,
        opacity: 0.35,
        linewidth: 2,
    }));
    curve.mesh.castShadow = true;
    splines.chordal = curve;
    for (const k in splines) {
        const spline = splines[ k ];
        app.scene.add(spline.mesh);
    }
    load([new THREE.Vector3(289.76843686945404, 452.51481137238443, 56.10018915737797),
        new THREE.Vector3(-53.56300074753207, 171.49711742836848, -14.495472686253045),
        new THREE.Vector3(-91.40118730204415, 176.4306956436485, -6.958271935582161),
        new THREE.Vector3(-383.785318791128, 491.1365363371675, 47.869296953772746)]);
        
        return app
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

function load(new_positions) {
    while (new_positions.length > positions.length) {
        addPoint();
    }
    while (new_positions.length < positions.length) {
        removePoint();
    }
    for (let i = 0; i < positions.length; i ++) {
        positions[ i ].copy(new_positions[ i ]);
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
