export default class sliderContainer {
    constructor($scope) {
        this.$scope = $scope;
        console.log(this);
    }

    $onInit() {
        this.$scope.title = this.data.title;
    }
}
