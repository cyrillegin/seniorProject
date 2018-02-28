export default class boatParametersService {

    updatePoint(parmas) {
        this.point = 3;
    }

    getBoat() {
        return this.data;
    }

    loadBoat(file) {
        return $.ajax(file)
            .done((data) => {
                this.data = data;
            })
            .fail((res, error) => {
                this.data = {};
            });

    }
}
