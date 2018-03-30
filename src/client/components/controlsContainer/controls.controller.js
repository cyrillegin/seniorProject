export default class controlsContainer {
    constructor($scope, $timeout, boatParametersService, manipulateService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
        this.manipulateService = manipulateService;
    }

    $onInit() {
        this.$scope.openMenu = (e) => {
            document.querySelector(`#${e}-menu`).classList.toggle('controls-section-hidden');
            document.querySelector(`#${e}-menu-icon`).classList.toggle('controls-icon-hidden');
        };

        // We need to wait for the boat service to complete initialization
        // before we can init our values.
        this.$timeout(() => {
            const data = this.boatParametersService.getBoat();
            this.$scope.frameCount = data.frames.length;
            this.$scope.data = data;

            this.$scope.$watchCollection(
                () => this.boatParametersService.checkUpdate(), // what we're watching.
                (newVal, oldVal, scope) => { // what we do if there's been a change.
                    this.$scope.data = this.boatParametersService.getBoat();
                });
            this.$scope.changeValue = (control) => {
                const newValue = this.$scope.data[control];
                if (control === 'frameCount') {
                    this.boatParametersService.updateFrameCount(this.$scope.frameCount);
                }
                this.updateModel(control, newValue);
            };
        }, 500);

        this.$scope.hover = (key) => {
            this.manipulateService.addHoverInput(key);
        };
        this.$scope.unhover = (key) => {
            this.manipulateService.removeHoverInput(key);
        };
    }

    updateModel(control, newValue) {
        const current = this.boatParametersService.getBoat();
        switch (control) {
            case 'aftBeam-start-x':
                this.$scope.data.foreBeam.start[0] = this.$scope.data.aftBeam.start[0];
                this.$scope.data.midFrame.start[0] = this.$scope.data.aftBeam.start[0];
                break;
            case 'aftBeam-start-y':
                this.$scope.data.foreBeam.start[1] = this.$scope.data.aftBeam.start[1];
                this.$scope.data.midFrame.start[1] = this.$scope.data.aftBeam.start[1];
                break;
            case 'aftBeam-start-z':
                this.$scope.data.foreBeam.start[2] = this.$scope.data.aftBeam.start[2];
                this.$scope.data.midFrame.start[2] = this.$scope.data.aftBeam.start[2];
                break;

            case 'foreBeam-start-x':
                this.$scope.data.aftBeam.start[0] = this.$scope.data.foreBeam.start[0];
                this.$scope.data.midFrame.start[0] = this.$scope.data.foreBeam.start[0];
                break;
            case 'foreBeam-start-y':
                this.$scope.data.aftBeam.start[1] = this.$scope.data.foreBeam.start[1];
                this.$scope.data.midFrame.start[1] = this.$scope.data.foreBeam.start[1];
                break;
            case 'foreBeam-start-z':
                this.$scope.data.aftBeam.start[2] = this.$scope.data.foreBeam.start[2];
                this.$scope.data.midFrame.start[2] = this.$scope.data.foreBeam.start[2];
                break;

            case 'aftBeam-end-x':
                this.$scope.data.aftBeamEdge.end[0] = this.$scope.data.aftBeam.end[0];
                this.$scope.data.aftFrame.start[0] = this.$scope.data.aftBeam.end[0];
                break;
            case 'aftBeam-end-y':
                this.$scope.data.aftBeamEdge.end[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftFrame.start[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftBeamEdge.start[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftKeelFrame.start[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftBeamEdge.startControl[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftKeelFrame.startControl[1] = this.$scope.data.aftBeam.end[1];
                break;
            case 'aftBeam-end-z':
                this.$scope.data.aftBeamEdge.end[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftFrame.start[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftBeamEdge.start[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftKeelFrame.start[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftBeamEdge.startControl[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftKeelFrame.startControl[2] = this.$scope.data.aftBeam.end[2];
                break;

            case 'foreBeam-end-x':
                this.$scope.data.foreBeamEdge.end[0] = this.$scope.data.foreBeam.end[0];
                this.$scope.data.foreFrame.start[0] = this.$scope.data.foreBeam.end[0];
                break;
            case 'foreBeam-end-y':
                this.$scope.data.foreBeamEdge.end[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreFrame.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreBeamEdge.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreKeelFrame.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreBeamEdge.startControl[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreKeelFrame.startControl[1] = this.$scope.data.foreBeam.end[1];
                break;
            case 'foreBeam-end-z':
                this.$scope.data.foreBeamEdge.end[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreFrame.start[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreBeamEdge.start[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreKeelFrame.start[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreBeamEdge.startControl[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreKeelFrame.startControl[2] = this.$scope.data.foreBeam.end[2];
                break;

            case 'aftChine-start-x':
                this.$scope.data.foreChine.start[0] = this.$scope.data.aftChine.start[0];
                this.$scope.data.midFrame.end[0] = this.$scope.data.aftChine.start[0];
                break;
            case 'aftChine-start-y':
                this.$scope.data.foreChine.start[1] = this.$scope.data.aftChine.start[1];
                this.$scope.data.midFrame.end[1] = this.$scope.data.aftChine.start[1];
                break;
            case 'aftChine-start-z':
                this.$scope.data.foreChine.start[2] = this.$scope.data.aftChine.start[2];
                this.$scope.data.midFrame.end[2] = this.$scope.data.aftChine.start[2];
                break;

            case 'foreChine-start-x':
                this.$scope.data.aftChine.start[0] = this.$scope.data.foreChine.start[0];
                this.$scope.data.midFrame.end[0] = this.$scope.data.foreChine.start[0];
                break;
            case 'foreChine-start-y':
                this.$scope.data.aftChine.start[1] = this.$scope.data.foreChine.start[1];
                this.$scope.data.midFrame.end[1] = this.$scope.data.foreChine.start[1];
                break;
            case 'foreChine-start-z':
                this.$scope.data.aftChine.start[2] = this.$scope.data.foreChine.start[2];
                this.$scope.data.midFrame.end[2] = this.$scope.data.foreChine.start[2];
                break;

            case 'aftChine-end-x':
                this.$scope.data.aftGunEdge.end[0] = this.$scope.data.aftChine.end[0];
                this.$scope.data.aftFrame.end[0] = this.$scope.data.aftChine.end[0];
                break;
            case 'aftChine-end-y':
                this.$scope.data.aftGunEdge.end[1] = this.$scope.data.aftChine.end[1];
                this.$scope.data.aftFrame.end[1] = this.$scope.data.aftChine.end[1];
                break;
            case 'aftChine-end-z':
                this.$scope.data.aftGunEdge.end[2] = this.$scope.data.aftChine.end[2];
                this.$scope.data.aftFrame.end[2] = this.$scope.data.aftChine.end[2];
                break;

            case 'foreChine-end-x':
                this.$scope.data.foreGunEdge.end[0] = this.$scope.data.foreChine.end[0];
                this.$scope.data.foreFrame.end[0] = this.$scope.data.foreChine.end[0];
                break;
            case 'foreChine-end-y':
                this.$scope.data.foreGunEdge.end[1] = this.$scope.data.foreChine.end[1];
                this.$scope.data.foreFrame.end[1] = this.$scope.data.foreChine.end[1];
                break;
            case 'foreChine-end-z':
                this.$scope.data.foreGunEdge.end[2] = this.$scope.data.foreChine.end[2];
                this.$scope.data.foreFrame.end[2] = this.$scope.data.foreChine.end[2];
                break;

            case 'aftKeel-start-x':
                this.$scope.data.foreKeel.start[0] = this.$scope.data.aftKeel.start[0];
                break;
            case 'aftKeel-start-y':
                this.$scope.data.foreKeel.start[1] = this.$scope.data.aftKeel.start[1];
                break;
            case 'aftKeel-start-z':
                this.$scope.data.foreKeel.start[2] = this.$scope.data.aftKeel.start[2];
                break;

            case 'foreKeel-start-x':
                this.$scope.data.aftKeel.start[0] = this.$scope.data.foreKeel.start[0];
                break;
            case 'foreKeel-start-y':
                this.$scope.data.aftKeel.start[1] = this.$scope.data.foreKeel.start[1];
                break;
            case 'foreKeel-start-z':
                this.$scope.data.aftKeel.start[2] = this.$scope.data.foreKeel.start[2];
                break;

            case 'aftKeel-end-x':
                this.$scope.data.aftGunEdge.start[0] = this.$scope.data.aftKeel.end[0];
                this.$scope.data.aftKeelFrame.end[0] = this.$scope.data.aftKeel.end[0];
                break;
            case 'aftKeel-end-y':
                this.$scope.data.aftGunEdge.start[1] = this.$scope.data.aftKeel.end[1];
                this.$scope.data.aftKeelFrame.end[1] = this.$scope.data.aftKeel.end[1];
                break;
            case 'aftKeel-end-z':
                this.$scope.data.aftGunEdge.start[2] = this.$scope.data.aftKeel.end[2];
                this.$scope.data.aftKeelFrame.end[2] = this.$scope.data.aftKeel.end[2];
                break;

            case 'foreKeel-end-x':
                this.$scope.data.foreGunEdge.start[0] = this.$scope.data.foreKeel.end[0];
                this.$scope.data.foreKeelFrame.end[0] = this.$scope.data.foreKeel.end[0];
                break;
            case 'foreKeel-end-y':
                this.$scope.data.foreGunEdge.start[1] = this.$scope.data.foreKeel.end[1];
                this.$scope.data.foreKeelFrame.end[1] = this.$scope.data.foreKeel.end[1];
                break;
            case 'foreKeel-end-z':
                this.$scope.data.foreGunEdge.start[2] = this.$scope.data.foreKeel.end[2];
                this.$scope.data.foreKeelFrame.end[2] = this.$scope.data.foreKeel.end[2];
                break;
        }
        this.boatParametersService.updatePoint(current);
    }

    moveCurve(curve, axis, value) {
        curve.start[axis] = value;
        curve.startControl[axis] = value;
        curve.end[axis] = value;
        curve.endControl[axis] = value;
        return curve;
    }
}
