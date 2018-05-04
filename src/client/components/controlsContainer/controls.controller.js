import Vector3 from '../../classes/vector3.class';

export default class controlsContainer {
    constructor($scope, $timeout, boatParametersService, manipulateService) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
        this.manipulateService = manipulateService;
    }

    $onInit() {
        this.$scope.openMenu = (e) => {
            document.querySelector(`#${e}-menu`).classList.toggle('controls-section-hidden');
            document.querySelector(`#${e}-menu-icon`).classList.toggle('controls-icon-hidden');
        };

        // We need to wait for the boat service to complete initialization
        // before we can init our values.
        this.$timeout(() => {
            const data = this.boatParametersService.getBoat();
            this.$scope.frameCount = data.frames.length;
            this.$scope.data = data;

            this.$scope.$watchCollection(
                () => this.boatParametersService.checkUpdate(), // what we're watching.
                (newVal, oldVal, scope) => { // what we do if there's been a change.
                    this.$scope.data = this.boatParametersService.getBoat();
                });
            this.$scope.changeValue = (control) => {
                const newValue = this.$scope.data[control];
                if (control === 'frameCount') {
                    this.boatParametersService.updateFrameCount(this.$scope.frameCount);
                }
                this.updateModel(control, newValue);
            };
        }, 500);

        this.mouseDown = false;
        this.oldMouseY = null;
        this.oldValue = null;

        this.$scope.mDown = (e, key, part, axis) => {
            this.mouseDown = true;
            this.key = key.key;
            this.part = part;
            this.axis = axis;
            this.startingMousePosition = e.originalEvent.clientX;
        };

        document.querySelector('body').addEventListener('mousemove', (e) => {
            if (this.mouseDown) {
                let control = `${this.key}-${this.part}-`;
                if (this.axis === 0) {
                    control += 'x';
                } else if (this.axis === 1) {
                    control += 'y';
                } else {
                    control += 'z';
                }
                const newValue = -(this.startingMousePosition - e.clientX) / 10;
                this.$scope.data[this.key][this.part][this.axis] = newValue;
                this.updateModel(control, newValue);
            }
        });

        document.querySelector('body').addEventListener('mouseup', (e) => {
            this.mouseDown = false;
        });

        this.$scope.hover = (key) => {
            this.manipulateService.addHoverInput(key);
        };

        this.$scope.unhover = (key) => {
            this.manipulateService.removeHoverInput(key);
        };

        this.$scope.collinearBeam = document.getElementById('collinearBeam');
        this.$scope.collinearChine = document.getElementById('collinearChine');
        this.$scope.collinearKeel = document.getElementById('collinearKeel');

        this.$scope.SaveJson = () => {
            const data = JSON.stringify(this.$scope.data);
            const file = new Blob([data], {type: 'JSON'});
            const a = document.createElement('a');
            const url = URL.createObjectURL(file);
            a.href = url;
            a.download = 'boat.json';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            }, 0);
        };

        this.$scope.LoadJson = () => {
            document.querySelector('#json-file-input').click();
        };

        document.querySelector('#json-file-input').onchange = (e) => {
            const reader = new FileReader();
            reader.onload = (e) => {
                const obj = JSON.parse(event.target.result);
                this.boatParametersService.updatePoint(obj);
                this.$scope.data = obj;
                this.$scope.$apply();
                $('input').each((index, elem) => {
                    if ($(elem).scope) {
                        $(elem).scope()
                            .$apply();
                    }
                });
            };
            reader.readAsText(e.target.files[0]);
        };
    }

    updateModel(control, newValue) {
        const current = this.boatParametersService.getBoat();
        switch (control) {
            case 'aftBeam-start-x':
                this.$scope.data.foreBeam.start[0] = this.$scope.data.aftBeam.start[0];
                break;
            case 'aftBeam-start-y':
                this.$scope.data.foreBeam.start[1] = this.$scope.data.aftBeam.start[1];
                break;
            case 'aftBeam-start-z':
                this.$scope.data.foreBeam.start[2] = this.$scope.data.aftBeam.start[2];
                break;

            case 'foreBeam-start-x':
                this.$scope.data.aftBeam.start[0] = this.$scope.data.foreBeam.start[0];
                break;
            case 'foreBeam-start-y':
                this.$scope.data.aftBeam.start[1] = this.$scope.data.foreBeam.start[1];
                break;
            case 'foreBeam-start-z':
                this.$scope.data.aftBeam.start[2] = this.$scope.data.foreBeam.start[2];
                break;

            case 'aftBeam-end-x':
                this.$scope.data.aftBeamEdge.end[0] = this.$scope.data.aftBeam.end[0];
                this.$scope.data.aftFrame.start[0] = this.$scope.data.aftBeam.end[0];
                break;
            case 'aftBeam-end-y':
                this.$scope.data.aftBeamEdge.end[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftFrame.start[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftBeamEdge.start[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftKeelFrame.start[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftBeamEdge.startControl[1] = this.$scope.data.aftBeam.end[1];
                this.$scope.data.aftKeelFrame.startControl[1] = this.$scope.data.aftBeam.end[1];
                break;
            case 'aftBeam-end-z':
                this.$scope.data.aftBeamEdge.end[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftFrame.start[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftBeamEdge.start[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftKeelFrame.start[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftBeamEdge.startControl[2] = this.$scope.data.aftBeam.end[2];
                this.$scope.data.aftKeelFrame.startControl[2] = this.$scope.data.aftBeam.end[2];
                break;

            case 'foreBeam-end-x':
                this.$scope.data.foreBeamEdge.end[0] = this.$scope.data.foreBeam.end[0];
                this.$scope.data.foreFrame.start[0] = this.$scope.data.foreBeam.end[0];
                break;
            case 'foreBeam-end-y':
                this.$scope.data.foreBeamEdge.end[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreFrame.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreBeamEdge.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreKeelFrame.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreBeamEdge.startControl[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreKeelFrame.startControl[1] = this.$scope.data.foreBeam.end[1];
                break;
            case 'foreBeam-end-z':
                this.$scope.data.foreBeamEdge.end[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreBeamEdge.start[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreFrame.start[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreKeelFrame.start[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreBeamEdge.startControl[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreKeelFrame.startControl[2] = this.$scope.data.foreBeam.end[2];
                break;

            case 'aftChine-start-x':
                this.$scope.data.foreChine.start[0] = this.$scope.data.aftChine.start[0];
                break;
            case 'aftChine-start-y':
                this.$scope.data.foreChine.start[1] = this.$scope.data.aftChine.start[1];
                break;
            case 'aftChine-start-z':
                this.$scope.data.foreChine.start[2] = this.$scope.data.aftChine.start[2];
                break;

            case 'foreChine-start-x':
                this.$scope.data.aftChine.start[0] = this.$scope.data.foreChine.start[0];
                break;
            case 'foreChine-start-y':
                this.$scope.data.aftChine.start[1] = this.$scope.data.foreChine.start[1];
                break;
            case 'foreChine-start-z':
                this.$scope.data.aftChine.start[2] = this.$scope.data.foreChine.start[2];
                break;

            case 'aftChine-end-x':
                this.$scope.data.aftGunEdge.end[0] = this.$scope.data.aftChine.end[0];
                this.$scope.data.aftFrame.end[0] = this.$scope.data.aftChine.end[0];
                break;
            case 'aftChine-end-y':
                this.$scope.data.aftGunEdge.end[1] = this.$scope.data.aftChine.end[1];
                this.$scope.data.aftFrame.end[1] = this.$scope.data.aftChine.end[1];
                break;
            case 'aftChine-end-z':
                this.$scope.data.aftGunEdge.end[2] = this.$scope.data.aftChine.end[2];
                this.$scope.data.aftFrame.end[2] = this.$scope.data.aftChine.end[2];
                break;

            case 'foreChine-end-x':
                this.$scope.data.foreGunEdge.end[0] = this.$scope.data.foreChine.end[0];
                this.$scope.data.foreFrame.end[0] = this.$scope.data.foreChine.end[0];
                break;
            case 'foreChine-end-y':
                this.$scope.data.foreGunEdge.end[1] = this.$scope.data.foreChine.end[1];
                this.$scope.data.foreFrame.end[1] = this.$scope.data.foreChine.end[1];
                break;
            case 'foreChine-end-z':
                this.$scope.data.foreGunEdge.end[2] = this.$scope.data.foreChine.end[2];
                this.$scope.data.foreFrame.end[2] = this.$scope.data.foreChine.end[2];
                break;

            case 'aftKeel-start-x':
                this.$scope.data.foreKeel.start[0] = this.$scope.data.aftKeel.start[0];
                break;
            case 'aftKeel-start-y':
                this.$scope.data.foreKeel.start[1] = this.$scope.data.aftKeel.start[1];
                break;
            case 'aftKeel-start-z':
                this.$scope.data.foreKeel.start[2] = this.$scope.data.aftKeel.start[2];
                break;

            case 'foreKeel-start-x':
                this.$scope.data.aftKeel.start[0] = this.$scope.data.foreKeel.start[0];
                break;
            case 'foreKeel-start-y':
                this.$scope.data.aftKeel.start[1] = this.$scope.data.foreKeel.start[1];
                break;
            case 'foreKeel-start-z':
                this.$scope.data.aftKeel.start[2] = this.$scope.data.foreKeel.start[2];
                break;

            case 'aftKeel-end-x':
                this.$scope.data.aftGunEdge.start[0] = this.$scope.data.aftKeel.end[0];
                this.$scope.data.aftKeelFrame.end[0] = this.$scope.data.aftKeel.end[0];
                break;
            case 'aftKeel-end-y':
                this.$scope.data.aftGunEdge.start[1] = this.$scope.data.aftKeel.end[1];
                this.$scope.data.aftKeelFrame.end[1] = this.$scope.data.aftKeel.end[1];
                break;
            case 'aftKeel-end-z':
                this.$scope.data.aftGunEdge.start[2] = this.$scope.data.aftKeel.end[2];
                this.$scope.data.aftKeelFrame.end[2] = this.$scope.data.aftKeel.end[2];
                break;

            case 'foreKeel-end-x':
                this.$scope.data.foreGunEdge.start[0] = this.$scope.data.foreKeel.end[0];
                this.$scope.data.foreKeelFrame.end[0] = this.$scope.data.foreKeel.end[0];
                break;
            case 'foreKeel-end-y':
                this.$scope.data.foreGunEdge.start[1] = this.$scope.data.foreKeel.end[1];
                this.$scope.data.foreKeelFrame.end[1] = this.$scope.data.foreKeel.end[1];
                break;
            case 'foreKeel-end-z':
                this.$scope.data.foreGunEdge.start[2] = this.$scope.data.foreKeel.end[2];
                this.$scope.data.foreKeelFrame.end[2] = this.$scope.data.foreKeel.end[2];
                break;

            case 'aftBeam-startControl-x':
            case 'aftBeam-startControl-y':
            case 'aftBeam-startControl-z':
                if (this.$scope.collinearBeam.checked === true) {
                    const startPoint = new Vector3(this.$scope.data.aftBeam.startControl[0], this.$scope.data.aftBeam.startControl[1], this.$scope.data.aftBeam.startControl[2]);
                    const midPoint = new Vector3(this.$scope.data.aftBeam.start[0], this.$scope.data.aftBeam.start[1], this.$scope.data.aftBeam.start[2]);
                    const endPoint = new Vector3(this.$scope.data.foreBeam.startControl[0], this.$scope.data.foreBeam.startControl[1], this.$scope.data.foreBeam.startControl[2]);
                    const newPoint = this.getCollinearPoint(startPoint, midPoint, endPoint);

                    this.$scope.data.foreBeam.startControl[0] = newPoint.x;
                    this.$scope.data.foreBeam.startControl[1] = newPoint.y;
                    this.$scope.data.foreBeam.startControl[2] = newPoint.z;
                }
                break;

            case 'foreBeam-startControl-x':
            case 'foreBeam-startControl-y':
            case 'foreBeam-startControl-z':
                if (this.$scope.collinearBeam.checked === true) {
                    const startPoint = new Vector3(this.$scope.data.foreBeam.startControl[0], this.$scope.data.foreBeam.startControl[1], this.$scope.data.foreBeam.startControl[2]);
                    const midPoint = new Vector3(this.$scope.data.foreBeam.start[0], this.$scope.data.foreBeam.start[1], this.$scope.data.foreBeam.start[2]);
                    const endPoint = new Vector3(this.$scope.data.aftBeam.startControl[0], this.$scope.data.aftBeam.startControl[1], this.$scope.data.aftBeam.startControl[2]);
                    const newPoint = this.getCollinearPoint(startPoint, midPoint, endPoint);

                    this.$scope.data.aftBeam.startControl[0] = newPoint.x;
                    this.$scope.data.aftBeam.startControl[1] = newPoint.y;
                    this.$scope.data.aftBeam.startControl[2] = newPoint.z;
                }
                break;

            case 'aftChine-startControl-x':
            case 'aftChine-startControl-y':
            case 'aftChine-startControl-z':
                if (this.$scope.collinearChine.checked === true) {
                    const startPoint = new Vector3(this.$scope.data.aftChine.startControl[0], this.$scope.data.aftChine.startControl[1], this.$scope.data.aftChine.startControl[2]);
                    const midPoint = new Vector3(this.$scope.data.aftChine.start[0], this.$scope.data.aftChine.start[1], this.$scope.data.aftChine.start[2]);
                    const endPoint = new Vector3(this.$scope.data.foreChine.startControl[0], this.$scope.data.foreChine.startControl[1], this.$scope.data.foreChine.startControl[2]);
                    const newPoint = this.getCollinearPoint(startPoint, midPoint, endPoint);

                    this.$scope.data.foreChine.startControl[0] = newPoint.x;
                    this.$scope.data.foreChine.startControl[1] = newPoint.y;
                    this.$scope.data.foreChine.startControl[2] = newPoint.z;
                }
                break;

            case 'foreChine-startControl-x':
            case 'foreChine-startControl-y':
            case 'foreChine-startControl-z':
                if (this.$scope.collinearChine.checked === true) {
                    const startPoint = new Vector3(this.$scope.data.foreChine.startControl[0], this.$scope.data.foreChine.startControl[1], this.$scope.data.foreChine.startControl[2]);
                    const midPoint = new Vector3(this.$scope.data.foreChine.start[0], this.$scope.data.foreChine.start[1], this.$scope.data.foreChine.start[2]);
                    const endPoint = new Vector3(this.$scope.data.aftChine.startControl[0], this.$scope.data.aftChine.startControl[1], this.$scope.data.aftChine.startControl[2]);
                    const newPoint = this.getCollinearPoint(startPoint, midPoint, endPoint);

                    this.$scope.data.aftChine.startControl[0] = newPoint.x;
                    this.$scope.data.aftChine.startControl[1] = newPoint.y;
                    this.$scope.data.aftChine.startControl[2] = newPoint.z;
                }
                break;

            case 'aftKeel-startControl-x':
            case 'aftKeel-startControl-y':
            case 'aftKeel-startControl-z':
                if (this.$scope.collinearKeel.checked === true) {
                    const startPoint = new Vector3(this.$scope.data.aftKeel.startControl[0], this.$scope.data.aftKeel.startControl[1], this.$scope.data.aftKeel.startControl[2]);
                    const midPoint = new Vector3(this.$scope.data.aftKeel.start[0], this.$scope.data.aftKeel.start[1], this.$scope.data.aftKeel.start[2]);
                    const endPoint = new Vector3(this.$scope.data.foreKeel.startControl[0], this.$scope.data.foreKeel.startControl[1], this.$scope.data.foreKeel.startControl[2]);
                    const newPoint = this.getCollinearPoint(startPoint, midPoint, endPoint);

                    this.$scope.data.foreKeel.startControl[0] = newPoint.x;
                    this.$scope.data.foreKeel.startControl[1] = newPoint.y;
                    this.$scope.data.foreKeel.startControl[2] = newPoint.z;
                }
                break;

            case 'foreKeel-startControl-x':
            case 'foreKeel-startControl-y':
            case 'foreKeel-startControl-z':
                if (this.$scope.collinearKeel.checked === true) {
                    const startPoint = new Vector3(this.$scope.data.foreKeel.startControl[0], this.$scope.data.foreKeel.startControl[1], this.$scope.data.foreKeel.startControl[2]);
                    const midPoint = new Vector3(this.$scope.data.foreKeel.start[0], this.$scope.data.foreKeel.start[1], this.$scope.data.foreKeel.start[2]);
                    const endPoint = new Vector3(this.$scope.data.aftKeel.startControl[0], this.$scope.data.aftKeel.startControl[1], this.$scope.data.aftKeel.startControl[2]);
                    const newPoint = this.getCollinearPoint(startPoint, midPoint, endPoint);

                    this.$scope.data.aftKeel.startControl[0] = newPoint.x;
                    this.$scope.data.aftKeel.startControl[1] = newPoint.y;
                    this.$scope.data.aftKeel.startControl[2] = newPoint.z;
                }
                break;
        }
        this.boatParametersService.updatePoint(current);
        // console.log("Checkbox: ", this.$scope.checkbox.checked, control)

    }

    moveCurve(curve, axis, value) {
        curve.start[axis] = value;
        curve.startControl[axis] = value;
        curve.end[axis] = value;
        curve.endControl[axis] = value;
        return curve;
    }

    getCollinearPoint(a, b, c) {
        // makes C collinear to line made by AB
        // store the original BC distance
        const magBC = Math.sqrt(Math.pow(c.x, 2) + Math.pow(c.y, 2) + Math.pow(c.z, 2));

        // get the AB unit vector
        const dirAB = new Vector3(a.x * -1, a.y * -1, a.z * -1);
        const magAB = Math.sqrt(Math.pow(a.x, 2) + Math.pow(a.y, 2) + Math.pow(a.z, 2));
        const unitVecAB = new Vector3(dirAB.x / magAB, dirAB.y / magAB, dirAB.z / magAB);

        // multiply BC magnitude by AB unit vector to get final position
        const newPoint = new Vector3(unitVecAB.x * magBC, unitVecAB.y * magBC, unitVecAB.z * magBC);
        return newPoint;
    }
}
