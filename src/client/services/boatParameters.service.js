export default class boatParametersService {
    constructor() {
        'ngInject';
        this.boatLoaded = false;
    }

    updatePoint(data) {
        this.data = data;
        this.updateKey = this.guid();
        return data;
    }

    guid() {
        function s4() {
            return Math.floor((1 + Math.random()) * 0x10000)
                .toString(16)
                .substring(1);
        }
        return `${s4() + s4() }-${ s4() }-${ s4() }-${ s4() }-${ s4() }${s4() }${s4()}`;
    }
    checkUpdate() {
        return this.updateKey;
    }

    getBoat() {
        if (this.boatLoaded === true) {
            return this.data;
        }
        return new Promise((res, rej) => {
            this.loadBoat('/boat')
                .done((data) => {
                    this.data = data;
                    this.boatLoaded = true;
                    res(data);
                })
                .fail((res, error) => {
                    console.log(error);
                    rej(error);
                });
        });
    }

    updateFrameCount(amount) {
        if (amount === this.data.frames.length) {
            return;
        }
        if (amount > this.data.frames.length) {
            while (this.data.frames.length < amount) {
                this.data.frames.push({distanceFromBack: 0});
            }
        } else {
            while (this.data.frames.length > amount) {
                this.data.frames.pop();
            }
        }
    }

    loadBoat(file) {
        return $.ajax(file);
    }
}
