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

            // Object.keys(this.$scope.data).forEach((key) => {
            //   console.log(['width', 'height', 'length', 'frames'].indexOf(key))
            //     if (['width', 'height', 'length', 'frames'].indexOf(key) < 0) {
            //         console.log(document.querySelector(`#${key}-table`))
            //         document.querySelector(`#${key}-table`).addEventListener('mouseover', () => {
            //             console.log('hovering ' + key)
            //         });
            //     }
            // });
        }, 500);
        
        this.$scope.hover = (key) => {
            this.manipulateService.addHoverInput(key);
        }
        this.$scope.unhover = (key) => {
            this.manipulateService.removeHoverInput(key)
        }
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
