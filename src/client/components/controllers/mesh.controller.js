import 'three';
import 'three/examples/js/loaders/OBJLoader';
import 'three/examples/js/loaders/MTLLoader';

function initMesh(app) {
    // TODO: look into async/await for this.
    return new Promise((resolve, reject) => {
        loadMaterial('canoe.mtl')
            .then((material) => {
                loadMesh('models/canoe.obj', material)
                    .then((boat) => {
                        boat.position.set(0, 0, 0);
                        app.scene.add(boat);
                        app.meshes.main = boat;
                        resolve(app);
                    });
            });
    });
}

function loadMesh(file, material) {
    return new Promise((resolve, reject) => {
        const objLoader = new THREE.OBJLoader();
        objLoader.setMaterials(material);
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

// wrapper for loading materials onto objects.
function loadMaterial(file) {
    return new Promise((resolve, reject) => {
        const mtlLoader = new THREE.MTLLoader();
        mtlLoader.setBaseUrl('models/');
        mtlLoader.setPath('models/');
        mtlLoader.setTexturePath('models/');
        mtlLoader.load(file, (materials) => {
            materials.preload();
            materials.materials.initialShadingGroup.color = new THREE.Color(1, 1, 1);
            resolve(materials);
        });
    });
}

export default initMesh;
