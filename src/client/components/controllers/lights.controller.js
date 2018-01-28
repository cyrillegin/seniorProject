import 'three';

function initLights(app) {
    // Create main light.
    const sun = new THREE.SpotLight(0xffffff, 1);
    sun.position.set(40, 20, 40);
    sun.angle = 1.1;
    sun.decay = 0;
    sun.castShadow = true;
    sun.shadow.mapSize.width = 2048;
    sun.shadow.mapSize.height = 2048;
    sun.shadow.camera.near = 1;
    sun.shadow.camera.far = 80000;
    app.scene.add(sun);
    app.lights.sun = sun;

    // Create backlight.
    const backlight = new THREE.AmbientLight(0xffffff, 0.3);
    backlight.position.set(10, -10, -10);
    app.scene.add(backlight);
    app.lights.backlight = backlight;
    return app;
}

export default initLights;
