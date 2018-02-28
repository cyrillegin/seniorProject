export default class controlsContainer {
    constructor($scope, $timeout, boatParametersService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
    }

    $onInit() {
        this.$scope.openMenu = (e) => {
            console.log(e);
        };

        // We need to wait for the boat service to complete initialization
        // before we can init our values.
        this.$timeout(() => {
            this.$scope.data = this.boatParametersService.getBoat();
            this.$scope.$watchCollection(
                () => this.boatParametersService.checkUpdate(), // what we're watching.
                (newVal, oldVal, scope) => { // what we do if there's been a change.
                    this.$scope.data = this.boatParametersService.getBoat();
                    console.log(this.$scope.data)
                });
            this.$scope.changeValue = (control) => {
                const newValue = this.$scope.data[control];
                this.updateModel(control, newValue);
            };
        });
    }

    updateModel(control, newValue) {
        const current = this.boatParametersService.getBoat();
        switch (control) {
            case 'width':
                current.aftBeam.end[0] = newValue;
                current.foreBeam.start[0] = newValue;
        }
        this.boatParametersService.updatePoint(current);
    }
}
