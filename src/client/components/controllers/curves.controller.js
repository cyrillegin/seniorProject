const A = [25, 20, 200];
const B = [25, 10, 190];
const C = [0, 20, 100];
const D = [5, 5, 100];
const E = [45, 5, 100];
const F = [50, 20, 100];
const G = [15, 5, 10];
const H = [25, 0, 10];
const I = [35, 5, 10];
const J = [10, 20, 10];
const K = [40, 20, 10];
const L = [25, 0, 150];


const curves = [{
    label: 'ACJ',
    points: [A, C, J],
}, {
    label: 'AB',
    points: [A, B],
}, {
    label: 'AFK',
    points: [A, F, K],
}, {
    label: 'BDG',
    points: [B, D, G],
}, {
    label: 'BLH',
    points: [B, L, H],
}, {
    label: 'BEI',
    points: [B, E, I],
}, {
    label: 'GH',
    points: [G, H],
}, {
    label: 'GJ',
    points: [G, J],
}, {
    label: 'HI',
    points: [H, I],
}, {
    label: 'IK',
    points: [I, K],
}, {
    label: 'JK',
    points: [J, K],
}];

function initCurves(app) {
    app.curves = [];
    for (let i = 0; i < curves.length; i ++) {
        const curveAttributes = {
            positions: [],
            splines: {},
            splineHelperObjects: [],
            splineMesh: null,
            geometry: new THREE.BoxGeometry(3, 3, 3),
        };
        app.curves.push(curveAttributes);
        buildCurve(app, i);
    }
    return app;
}

function buildCurve(app, a) {
    for (let i = 0; i < curves[a].points.length; i ++) {
        addSplineObject(a, app, app.curves[a].positions[ i ]);
    }

    // Add the blocks
    app.curves[a].positions = [];
    for (let i = 0; i < curves[a].points.length; i ++) {
        app.curves[a].positions.push(app.curves[a].splineHelperObjects[i].position);
    }

    // Curve geometry.
    const geometry = new THREE.Geometry();
    for (let i = 0; i < 200; i ++) {
        geometry.vertices.push(new THREE.Vector3());
    }

    // Create a curve
    const curve = new THREE.CatmullRomCurve3(app.curves[a].positions);
    curve.curveType = 'catmullrom';
    curve.mesh = new THREE.Line(geometry.clone(), new THREE.LineBasicMaterial({
        color: 0x0000ff,
        opacity: 0.85,
        linewidth: 2,
    }));
    curve.mesh.castShadow = true;
    app.curves[a].splines.uniform = curve;
    app.curves[a].splines.chordal = curve;

    for (const k in app.curves[a].splines) {
        const spline = app.curves[a].splines[k];
        app.scene.add(spline.mesh);
    }
    const toLoad = [];
    curves[a].points.forEach((curve) => {
        toLoad.push(new THREE.Vector3(curve[0], curve[1], curve[2]));
    });

    while (toLoad.length > app.curves[a].positions.length) {
        app.curves[a].positions.push(addSplineObject(a).position);
    }

    for (let i = 0; i < app.curves[a].positions.length; i ++) {
        app.curves[a].positions[i].copy(toLoad[i]);
    }
    for (const k in app.curves[a].splines) {
        const spline = app.curves[a].splines[k];
        app.curves[a].splineMesh = spline.mesh;
        for (let i = 0; i < 200; i ++) {
            const p = app.curves[a].splineMesh.geometry.vertices[i];
            const t = i / (200 - 1);
            spline.getPoint(t, p);
        }
        app.curves[a].splineMesh.geometry.verticesNeedUpdate = true;
    }

    return app;
}

// This function shows the control points.
function addSplineObject(a, app, position) {
    const material = new THREE.MeshLambertMaterial({color: Math.random() * 0xffffff});
    const object = new THREE.Mesh(app.curves[a].geometry, material);
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
    app.curves[a].splineHelperObjects.push(object);
    return object;
}

export default initCurves;
