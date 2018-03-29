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
            this.$scope.data = this.boatParametersService.getBoat();
            this.$scope.$watchCollection(
                () => this.boatParametersService.checkUpdate(), // what we're watching.
                (newVal, oldVal, scope) => { // what we do if there's been a change.
                    this.$scope.data = this.boatParametersService.getBoat();
                });
            this.$scope.changeValue = (control) => {
                const newValue = this.$scope.data[control];
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
