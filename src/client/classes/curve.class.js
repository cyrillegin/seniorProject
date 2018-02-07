import Vector3 from './vector3.class';

export default class Curve {
    constructor() {
        this.start = new Vector3();
        this.end = new Vector3();
        this.startControl = new Vector3();
        this.endControl = new Vector3();
        this.verticies = [];
        console.log('hello world');
        console.log(this);
    }
}
