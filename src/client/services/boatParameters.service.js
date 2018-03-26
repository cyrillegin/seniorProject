export default class boatParametersService {
    constructor() {
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

    loadBoat(file) {
        return $.ajax(file);
    }
}
