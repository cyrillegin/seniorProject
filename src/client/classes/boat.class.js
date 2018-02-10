import Curve from './curve.class';

export default class boat {
    constructor() {
        this.aftCurveBeamLeft = new Curve();
        this.foreCurveBeamLeft = new Curve();
        this.aftCurveBeamRightight = new Curve();
        this.foreCurveBeam = new Curve();
        this.aftCurveKeelLeft = new Curve();
        this.foreCurveKeelLeft = new Curve();
        this.aftCurveKeelCenter = new Curve();
        this.foreCurveKeelCenter = new Curve();
        this.aftCurveKeelRight = new Curve();
        this.foreCurveKeelRight = new Curve();

        this.aftBeamKeelLeft = new Curve();
        this.aftBeamKeelRight = new Curve();
        this.foreBeamKeelLeft = new Curve();
        this.foreBeamKeelRight = new Curve();

        this.aftKeelLeft = new Curve();
        this.aftKeelRight = new Curve();
        this.foreKeelLeft = new Curve();
        this.foreKeelRight = new Curve();

        this.aftBeamLeft = new Curve();
        this.aftBeamRight = new Curve();
        this.foreBeamLeft = new Curve();
        this.foreBeamRight = new Curve();
    }
}
