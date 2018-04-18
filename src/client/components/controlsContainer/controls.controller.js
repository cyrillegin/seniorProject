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
        
        this.$scope.checkbox = document.getElementById("controlPointBox");
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
                break;
            case 'foreBeam-end-y':
                this.$scope.data.foreBeamEdge.end[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreBeamEdge.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreKeelFrame.start[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreBeamEdge.startControl[1] = this.$scope.data.foreBeam.end[1];
                this.$scope.data.foreKeelFrame.startControl[1] = this.$scope.data.foreBeam.end[1];
                break;
            case 'foreBeam-end-z':
                this.$scope.data.foreBeamEdge.end[2] = this.$scope.data.foreBeam.end[2];
                this.$scope.data.foreBeamEdge.start[2] = this.$scope.data.foreBeam.end[2];
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
                break;
            case 'foreChine-end-y':
                this.$scope.data.foreGunEdge.end[1] = this.$scope.data.foreChine.end[1];
                break;
            case 'foreChine-end-z':
                this.$scope.data.foreGunEdge.end[2] = this.$scope.data.foreChine.end[2];
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
                
            
        }
        this.boatParametersService.updatePoint(current);
        console.log("Checkbox: ", this.$scope.checkbox.checked)
    }

    moveCurve(curve, axis, value) {
        curve.start[axis] = value;
        curve.startControl[axis] = value;
        curve.end[axis] = value;
        curve.endControl[axis] = value;
        return curve;
    }
    
    getCollinearPoint(a, b, c) {
        //makes C collinear to line made by AB
        //store the original BC distance
        magBC = getMagnitude(b, c);
        
        //get AB direction 
        dirAB = Vector3(b.x - a.x, b.y - a.y, b.z - a.z);
        
        //get AB unit Vector3
        magAB = getMagnitude(a, b);
        unitVecAB = Vector3(dirAB.x / magAB, dirAB.y / magAB, dirAB.z / magAB);
        
        //get final point by scaling unitVecAB by magAB and offsetting it by b's position
        newPoint = Vector3(unitVecAB.x * magBC + b.x, unitVecAB.y * magBC + b.y, unitVecAB.z * magBC + b.z);
        return newPoint;
    }
    
    getMagnitude(start, end) {
        xComponent = end.x - start.x;
        yComponent = end.y - start.y;
        zComponent = end.z - start.z;
        
        return Math.sqrt(Math.pow(xComponent, 2) + Math.pow(yComponent, 2) + Math.pow(zComponent, 2));
    }
}
