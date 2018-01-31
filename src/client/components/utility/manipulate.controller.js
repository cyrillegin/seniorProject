class Manipulate {
    constructor(mesh) {
        console.log(mesh)
        this.mesh = mesh.main.children[0];
    }
    adjustWidth(value) {
        this.mesh.scale.z = value / 100 + 0.5;
    }
    adjustHeight(value) {
        this.mesh.scale.y = value / 100 + 0.5;
    }
    adjustLength(value) {
        this.mesh.scale.x = value / 100 + 0.5;
    }
}
export default Manipulate;
