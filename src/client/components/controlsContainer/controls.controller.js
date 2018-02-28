export default class controlsContainer {
    constructor($scope, boatParametersService) {
        this.$scope = $scope;
        this.boatParametersService = boatParametersService;
    }

    $onInit() {
        this.initializeValues();
        this.$scope.openMenu = (e) => {
            console.log(e);
        };

        this.$scope.changeValue = () => {
            this.boatParametersService.updatePoint();
        };
    }


    initializeValues(values) {
        let data;
        if (values === undefined) {
            data = {
                width: 5,
                height: 5,
                length: 5,
                frames: [{
                    distanceFromBack: 1,
                }, {
                    distanceFromBack: 2,
                }, {
                    distanceFromBack: 3,
                }],
                aft: {
                    beam: {
                        start: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                        startControl: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                        end: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                        endControl: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                    },
                },
                fore: {
                    beam: {
                        start: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                        startControl: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                        end: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                        endControl: {
                            x: 1,
                            y: 1,
                            z: 1,
                        },
                    },
                },
            };
        } else {
            data = params;
        }
        this.$scope.data = data;
        this.$scope.frameCount = data.frames.length;
    }
}
