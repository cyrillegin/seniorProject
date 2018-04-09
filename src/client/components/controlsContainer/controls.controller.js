export default class controlsContainer {
    constructor($scope, $timeout, boatParametersService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
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
                console.log(control, newValue)
                this.updateModel(control, newValue);
            };
        });

	this.mouseDown = false;
        this.oldMouseY = null;
        this.oldValue = null;

        this.$scope.mDown = (e) => {
            this.mouseDown = true;
            this.oldMouseY = e.originalEvent.clientY;
        };

        this.$scope.mMove = (e) => {
            if (this.mouseDown) {
                e.originalEvent.target.value = parseFloat(e.originalEvent.target.value) + (this.oldMouseY - e.originalEvent.clientY) / 10;
                this.oldMouseY = e.originalEvent.clientY;
                console.log("control: "+e.originalEvent.target.id+" value: "+e.originalEvent.target.value);
                this.updateModel(e.originalEvent.target.id, e.originalEvent.target.value);
            }
        };

        this.$scope.mUp = (e) => {
            this.mouseDown = false;
        };
    }

    updateModel(control, newValue) {
        const current = this.boatParametersService.getBoat();
        switch (control) {
            case 'width':
                current.width = newValue;
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
