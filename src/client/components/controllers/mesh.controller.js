import 'three';
import 'three/examples/js/loaders/OBJLoader';

function initMesh(app) {
    // TODO: look into async/await for this.
    loadMesh('models/boat.obj')
        .then((apartment) => {
            apartment.position.set(0, 0, 0);
            app.scene.add(apartment);
            app.meshes.main = apartment;
        });
    return app;
}

function loadMesh(file) {
    return new Promise((resolve, reject) => {
        const objLoader = new THREE.OBJLoader();
        objLoader.load(
            file,
            (object) => {
                resolve(object);
            },
            // called when loading is in progresses
            (xhr) => {
                console.log(`${(xhr.loaded / xhr.total * 100)}% loaded`);
            },
            // called when loading has errors
            (error) => {
                console.log('An error happened');
                reject(error);
            },
        );
    });
}

export default initMesh;
