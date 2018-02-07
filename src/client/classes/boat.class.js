import Panel from './panel.class';

export default class boat {
    constructor() {
        this.leftPanel = new Panel();
        this.rightPanel = new Panel();
        this.leftBase = new Panel();
        this.rightBase = new Panel();
        this.stern = new Panel();
    }
}
