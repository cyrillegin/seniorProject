export default class sliderContainer {
    constructor($scope) {
        this.$scope = $scope;
    }

    $onInit() {
        this.$scope.title = this.data.title;
        this.$scope.type = this.data.type;
        this.$scope.selector = this.data.title.replace(' ', '-');

        this.$scope.openMenu = () => {
            $(`#${this.$scope.selector}-icon`).toggleClass('carrot-icon-rotated');
            $(`#${this.$scope.selector}`).toggleClass('curve-slider-hidden');
        };

        this.$scope.valueChange = (val) => {
            console.log('change')
            console.log(this.$scope)
        };
    }
}
