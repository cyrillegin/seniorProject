export default class controlsContainer {
    constructor($scope) {
        this.$scope = $scope;
    }

    $onInit() {
        this.$scope.frames = [{
            title: 'Frame 1',
        }, {
            title: 'Frame 2',
        }, {
            title: 'Frame 3',
        }, {
            title: 'Frame 4',
        }];
    }
}
