// Takes in the boat, a curve to apply offsets to, and its key (the name of the curve)
// Returns the modifed curve coordinates taking into consideration, width, height, length,
// as well as positional offsets for the curve controls.
export function applyOffsets(boat, curve, key) {
    // Define offsets
    let lengthOffset = key.toLowerCase().includes('aft') ? -boat.length : boat.length;
    let heightOffset = key.toLowerCase().includes('beam') ? boat.height : -boat.height;
    const widthOffset = key.toLowerCase().includes('keel') ? 0 : boat.width;

    if (key.toLowerCase().includes('frame')) {
        heightOffset = boat.height;
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

// Implementation of casteljau's algorithem, adapted from 2d to 3d from
// https://stackoverflow.com/questions/14174252/how-to-find-out-y-coordinate-of-specific-point-in-bezier-curve-in-canvas
// Takes a curve and a percent along the curve and returns the 3d coordinates of that point in a vector3
export function casteljauPoint(curve, t) {
    // Step 1
    const Ax = ((1 - t) * curve.start[0]) + (t * (curve.start[0] + curve.startControl[0]));
    const Ay = ((1 - t) * curve.start[1]) + (t * (curve.start[1] + curve.startControl[1]));
    const Az = ((1 - t) * curve.start[2]) + (t * (curve.start[2] + curve.startControl[2]));
    const Bx = ((1 - t) * (curve.start[0] + curve.startControl[0])) + (t * (curve.end[0] + curve.endControl[0]));
    const By = ((1 - t) * (curve.start[1] + curve.startControl[1])) + (t * (curve.end[1] + curve.endControl[1]));
    const Bz = ((1 - t) * (curve.start[2] + curve.startControl[2])) + (t * (curve.end[2] + curve.endControl[2]));
    const Cx = ((1 - t) * (curve.end[0] + curve.endControl[0])) + (t * curve.end[0]);
    const Cy = ((1 - t) * (curve.end[1] + curve.endControl[1])) + (t * curve.end[1]);
    const Cz = ((1 - t) * (curve.end[2] + curve.endControl[2])) + (t * curve.end[2]);

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

// Inverse of casteljau's algorithem, takes in a curve and a y dimension and Returns
// the t value from use in the casteljauPoint function.
export function casteljauFromY(curve, distFromBack) {
    console.log(curve);
    console.log(distFromBack);
    console.log('begin')
    // make a guess about t
    const curveB = JSON.parse(JSON.stringify(curve));
    let t = 0.5;
    let withinBounds = false;
    let tries = 0;
    const bounds = 0.01;
    while (withinBounds === false && tries < 3) {
        tries ++;
        const result = casteljauPoint(curveB, t);
        console.log(Math.abs(result.z));
        if (Math.abs(Math.abs(result.z) - distFromBack) < bounds) {
            console.log(`bounds found! tries: ${tries}, result: `, result);
            withinBounds = true;
        } else if (result.z - distFromBack > 0) {
            console.log('go up');
            t = t + (0.5 / (tries + 1) ** 2);
        } else {
            console.log('go down');
            t = t - (0.5 / (tries + 1) ** 2);
        }
    }
    return t;
}

export function conver3dTo2dCoordinates() {}

// es6 modules like having a default.
export default applyOffsets;

// export default {casteljauPoint, applyOffsets};
