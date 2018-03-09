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
            console.log('change');
            console.log(this.$scope);
        };

        this.initValues();
    }

    initValues(data) {
        const params = data || {};
        this.$scope.coordinates = {
            x1: params.x1 || 5,
            y1: params.y1 || 5,
            z1: params.z1 || 5,
            x2: params.x1c || 5,
            y2: params.y1c || 5,
            z2: params.z1c || 5,
            x1c: params.x2 || 5,
            y1c: params.y2 || 5,
            z1c: params.z2 || 5,
            x2c: params.x2c || 5,
            y2c: params.y2c || 5,
            z2c: params.z2c || 5,
        };
    }
}
