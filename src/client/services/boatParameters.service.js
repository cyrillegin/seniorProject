export default class boatParametersService {

    updatePoint(data) {
        console.log('updating');
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
        return this.data;
    }

    loadBoat(file) {
        return $.ajax(file);
    }
}
