export default class manipulateService {

    addHoverInput(key) {
        this.unHoverInput = null;
        this.hoverInput = key;
    }

    removeHoverInput(key) {
        this.hoverInput = null;
        this.unHoverInput = key;
    }

    getHoverInput() {
        return this.hoverInput;
    }

    getUnHoverInput() {
        return this.unHoverInput;
    }
}
