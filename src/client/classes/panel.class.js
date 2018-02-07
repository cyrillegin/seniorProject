import Curve from './curve.class';

export default class panel {
    constructor() {
        this.sides = [];
        const side1 = new Curve();
        const side2 = new Curve();
        const side3 = new Curve();
        this.sides.push(side1);
        this.sides.push(side2);
        this.sides.push(side3);
    }
}
