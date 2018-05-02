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
    const THREE = require('three');
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

// 2D implementation of casteljau's algorithm
export function casteljauPoint2D(curve, t) {
    // Step 1
    const Ax = ((1 - t) * curve.points[0].x) + (t * curve.points[1].x);
    const Ay = ((1 - t) * curve.points[0].y) + (t * curve.points[1].y);
    const Bx = ((1 - t) * curve.points[1].x) + (t * curve.points[2].x);
    const By = ((1 - t) * curve.points[1].y) + (t * curve.points[2].y);
    const Cx = ((1 - t) * curve.points[2].x) + (t * curve.points[3].x);
    const Cy = ((1 - t) * curve.points[2].y) + (t * curve.points[3].y);

    // Step 2
    const Dx = ((1 - t) * Ax) + (t * Bx);
    const Dy = ((1 - t) * Ay) + (t * By);
    const Ex = ((1 - t) * Bx) + (t * Cx);
    const Ey = ((1 - t) * By) + (t * Cy);

    // Step 3
    const Px = ((1 - t) * Dx) + (t * Ex);
    const Py = ((1 - t) * Dy) + (t * Ey);

    return new THREE.Vector2(Px, Py);
}

// Inverse of casteljau's algorithem, takes in a curve and a distance from the back
// of the boat and Returns the t value for use in the casteljauPoint function.
export function casteljauFromY(curve, distFromBack) {
    // make a guess about t
    const curveB = JSON.parse(JSON.stringify(curve));
    let t = 0.5;
    let withinBounds = false;
    let tries = 0;
    const bounds = 0.01;
    // Use a high try cut off because this rarly ever occurs, tipical try counts are around
    // 10-15. We use 50 for situations when withinBounds will never be successful, for
    // example, when the frame could go off of the boat when the beam hangs over the chine.
    while (withinBounds === false && tries < 50) {
        tries ++;
        const result = casteljauPoint(curveB, t);
        if (Math.abs(Math.abs(result.z) - distFromBack) < bounds) {
            withinBounds = true;
        } else if (Math.abs(result.z) - distFromBack < 0) {
            t = t + (0.5 / (tries + 1));
        } else {
            t = t - (0.5 / (tries + 1));
        }
        // Some funky stuff happens around the mid section so
        // we make sure that t never goes out of bounds.
        if (t < 0) {
            t = 0.1;
        }
        if (t > 1) {
            t = 0.9;
        }
    }
    return t;
}

export function findLocation(boat, frame) {
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

export function conver3dTo2dCoordinates() {}

// es6 modules like having a default.
// export default applyOffsets;

export default {casteljauFromY, casteljauPoint, applyOffsets};
