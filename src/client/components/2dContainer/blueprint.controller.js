// Global imports
import * as d3 from 'd3';
import {casteljauPoint, casteljauFromY, findLocation, applyOffsets, conver3dTo2dCoordinates} from '../../utility/calculations';

/* Original sidepanel coordinates
const sidePanel = [
    {x: 1, y: 1}, {x: 500, y: 1},
    {x: 500, y: 1}, {x: 500, y: 20},
    {x: 250, y: 150}, {x: 1, y: 170},
    {x: 1, y: 170}, {x: 1, y: 1},
];
casteljauPoint, casteljauFromY
*/


export default class BlueprintEditor {
    constructor($scope, $timeout, boatParametersService) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
    }
    /* I'll deal with this shit later
    getBoundingSize(Maths, index0, index1) {
        const copy = Maths;
        let maxDiff = 0;
        const vals = {
            minVal: '',
            maxVal: '',
        };
        Object.keys(Maths).forEach((key) => {
            Object.keys(copy).forEach((key1) => {
                if (Math.abs(Maths[key] - copy[key1]) > maxDiff) {
                    maxDiff = Math.abs(Maths[key] - copy[key1]);
                    console.log(maxDiff);
                    if (Maths[key] < Maths[key1]) {
                        vals.minVal = key;
                        vals.maxVal = key1;
                    } else {
                        vals.minVal = key1;
                        vals.maxVal = key;
                    }
                }
            });
        });
        console.log(vals);
        return vals;
    } */
    // Deal with this shit later as well. Does not update as boat changes for some reason
    getReference(boat) {
        const refPoints = {};
        const t = casteljauFromY(boat.foreBeam, boat.length * 0.75);
        refPoints.forePoint = casteljauPoint(boat.foreBeam, t);
      //  console.log(refPoints.forePoint);
        refPoints.forePoint.x = Number(Math.abs(refPoints.forePoint.x).toFixed(1));
        refPoints.forePoint.z = Number(Math.abs(refPoints.forePoint.z).toFixed(1)) + boat.length / 4;
      //  console.log(refPoints.forePoint);
        return refPoints;
    }

    // Acquire coordinates of frames
    getFrameCoords(boat, lastY) {
        let currY = lastY;
        let i = 1;
        let location1;
        let location2;
        let location3;

        // Structure containing the info required to print the frames
        const frames = {
            frame1: {
                count: 1,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame2: {
                count: 2,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame3: {
                count: 3,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame4: {
                count: 4,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame5: {
                count: 5,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame6: {
                count: 6,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame7: {
                count: 7,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame8: {
                count: 8,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame9: {
                count: 9,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame10: {
                count: 10,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame11: {
                count: 11,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame12: {
                count: 12,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame13: {
                count: 13,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame14: {
                count: 14,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },

            frame15: {
                count: 15,
                empty: true,
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {}, {}, {}, {}, {},
                ],
            },
        };

        // Find the location of each frame and insert their offsets into the structure
        let count = 0;
        boat.frames.forEach((frame, index) => {
            const {locationA, locationB, locationC} = findLocation(boat, frame);
            location1 = locationA;
            location2 = locationB;
            location3 = locationC;
          //  console.log(location1, location2, location3);
            Object.keys(frames).forEach((key) => {
                if (frames[key].count === i) {
                    frames[key].points[0].x = 15;
                    frames[key].points[0].y = currY + 15;
                    frames[key].points[1].x = Math.abs(location1.x - location2.x) + frames[key].points[0].x;
                    frames[key].points[1].y = Math.abs(location1.y - location2.y) + frames[key].points[0].y;
                    frames[key].points[2].x = Math.abs(location2.x - location3.x) + frames[key].points[1].x;
                    frames[key].points[2].y = Math.abs(location2.y - location3.y) + frames[key].points[1].y;
                    frames[key].points[3].x = Math.abs(location2.x - location3.x) + frames[key].points[2].x;
                    frames[key].points[3].y = Math.abs(Math.abs(location2.y - location3.y) - frames[key].points[2].y);
                    frames[key].points[4].x = Math.abs(location1.x - location2.x) + frames[key].points[3].x;
                    frames[key].points[4].y = Math.abs(Math.abs(location1.y - location2.y) - frames[key].points[3].y);
                    currY = frames[key].points[2].y;
                    count++;
                }
            });
            i++;
        });

        // Mark which frames are used
        i = 0;
        Object.keys(frames).forEach((key) => {
            if (i < count) {
                frames[key].empty = false;
            } else {
                return;
            }
            i++;
        });
        return frames;

    }

    // Implementation of the Pythagorean Theorem to obtain diagonal distances
    pythagorean(x1, x2, y1, y2) {
        return Number((Math.sqrt(Math.pow((Math.abs(x1 - x2)), 2) + Math.pow((Math.abs(y1 - y2)), 2))).toFixed(1));
    }

    // Acquire the coordinates of the panels
    getCoords(boat) {
        const yMaths = {};
        const xMaths = {};
        let location1;
        let location2;
        let location3;
       const refPoints = this.getReference(boat);
        boat.frames.forEach((frame, index) => {
            const {locationA, locationB, locationC} = findLocation(boat, frame);
            location1 = locationA;
            location2 = locationB;
            location3 = locationC;
        });
        const convertedBoat = conver3dTo2dCoordinates(); // eslint-disable-line

        // Coordinates for first panel
        // Get Coordinates for foreBeam
        applyOffsets(this.boat, this.boat.foreBeam, 'foreBeam');
        yMaths.y1 = Math.abs(Math.abs(this.boat.foreBeam.end[0] - this.boat.foreBeam.start[0]) - 20);
        xMaths.x1 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreBeam.start[2]) + 15;
        yMaths.scy1 = Math.abs(this.boat.foreBeam.endControl[0] - 20);
        xMaths.scx1 = Math.abs(this.boat.foreBeam.endControl[2] - 15);
        yMaths.ecy1 = Math.abs(this.boat.foreBeam.startControl[0] - yMaths.y1);
        xMaths.ecx1 = Math.abs(this.boat.foreBeam.startControl[2] - xMaths.x1);

        // Get Coordinates for aftBeam
        applyOffsets(this.boat, this.boat.aftBeam, 'aftBeam');
        yMaths.y2 = Math.abs(this.boat.aftBeam.start[0] - this.boat.aftBeam.end[0]) + yMaths.y1;
        xMaths.x2 = Math.abs(this.boat.aftBeam.start[2] - this.boat.aftBeam.end[2]) + xMaths.x1;
        yMaths.scy2 = Math.abs(this.boat.aftBeam.startControl[0] - yMaths.y1);
        xMaths.scx2 = Math.abs(this.boat.aftBeam.startControl[2] - xMaths.x1);
        yMaths.ecy2 = Math.abs(this.boat.aftBeam.endControl[0] - yMaths.y2);
        xMaths.ecx2 = Math.abs(this.boat.aftBeam.endControl[2] - xMaths.x2);

        // Get Coordinates for foreChine
        applyOffsets(this.boat, this.boat.foreChine, 'foreChine');
        yMaths.y3 = Math.abs(this.boat.foreBeam.end[1] - this.boat.foreChine.end[1]) + 20;
        xMaths.x3 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreChine.end[2]) + 15;
        yMaths.ecy3 = Math.abs(this.boat.foreChine.endControl[0]) + yMaths.y3;
        xMaths.ecx3 = Math.abs(this.boat.foreChine.endControl[2]) + xMaths.x3;
        yMaths.y4 = Math.abs(this.boat.foreChine.end[0] - this.boat.foreChine.start[0]) + yMaths.y3;
        xMaths.x4 = Math.abs(this.boat.foreChine.end[2] - this.boat.foreChine.start[2]) + xMaths.x3;
        yMaths.scy3 = this.boat.foreChine.startControl[0] + yMaths.y4;
        xMaths.scx3 = xMaths.x4 - this.boat.foreChine.startControl[2];

        // Get Coordinates for aftChine
        applyOffsets(this.boat, this.boat.aftChine, 'aftChine');
        yMaths.y5 = yMaths.y4 - Math.abs(this.boat.aftChine.start[0] - this.boat.aftChine.end[0]);
        xMaths.x5 = Math.abs(this.boat.aftChine.start[2] - this.boat.aftChine.end[2]) + xMaths.x4;
        yMaths.scy4 = this.boat.aftChine.startControl[0] + yMaths.y4;
        xMaths.scx4 = Math.abs(this.boat.aftChine.startControl[2]) + xMaths.x4;
        yMaths.ecy4 = this.boat.aftChine.endControl[0] + yMaths.y5;
        xMaths.ecx4 = xMaths.x5 - this.boat.aftChine.endControl[2];

        // Get size of bounding panel1Box
        // this.getBoundingSize(yMaths, 0, 25);
        // Coordinates for second second panel
        // Get coordinates for foreChine (mirror along x-asix)
        yMaths.y6 = yMaths.y4 + 20;
        xMaths.x6 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreChine.end[2]) + 15;
        yMaths.ecy5 = yMaths.y6 - Math.abs(this.boat.foreChine.endControl[0]);
        xMaths.ecx5 = Math.abs(this.boat.foreChine.endControl[2]) + xMaths.x6;
        yMaths.y7 = yMaths.y6 - Math.abs(this.boat.foreChine.end[0] - this.boat.foreChine.start[0]);
        xMaths.x7 = Math.abs(this.boat.foreChine.end[2] - this.boat.foreChine.start[2]) + xMaths.x6;
        yMaths.scy5 = yMaths.y7 - this.boat.foreChine.startControl[0];
        xMaths.scx5 = xMaths.x7 - this.boat.foreChine.startControl[2];

        // Get coordinates for aftChine (mirror along x-axis)
        yMaths.y8 = Math.abs(this.boat.aftChine.start[0] - this.boat.aftChine.end[0]) + yMaths.y7;
        xMaths.x8 = Math.abs(this.boat.aftChine.start[2] - this.boat.aftChine.end[2]) + xMaths.x7;
        yMaths.scy6 = yMaths.y7 - this.boat.aftChine.startControl[0];
        xMaths.scx6 = Math.abs(this.boat.aftChine.startControl[2]) + xMaths.x7;
        yMaths.ecy6 = yMaths.y8 - this.boat.aftChine.endControl[0];
        xMaths.ecx6 = xMaths.x8 - this.boat.aftChine.endControl[2];

        // Get coordinates for foreKeel
        applyOffsets(this.boat, this.boat.foreKeel, 'foreKeel');
        yMaths.y9 = Math.abs(this.boat.foreKeel.end[0] - this.boat.foreChine.end[0]) + yMaths.y6;
        xMaths.x9 = xMaths.x6 - Math.abs(this.boat.foreKeel.end[2] - this.boat.foreChine.end[2]);
        yMaths.ecy7 = yMaths.y9 - this.boat.foreKeel.endControl[0];
        xMaths.ecx7 = xMaths.x9 + Math.abs(this.boat.foreKeel.endControl[2]);
        yMaths.y10 = yMaths.y9 + (this.boat.foreKeel.end[0] - this.boat.foreKeel.start[0]);
        xMaths.x10 = xMaths.x9 + (this.boat.foreKeel.end[2] - this.boat.foreKeel.start[2]);
        yMaths.scy7 = yMaths.y9 - Math.abs(this.boat.foreKeel.startControl[0]);
        xMaths.scx7 = xMaths.x9 + Math.abs(this.boat.foreKeel.startControl[2]);

        // Get coordinates for aftKeel
        applyOffsets(this.boat, this.boat.aftKeel, 'aftKeel');
        yMaths.y11 = yMaths.y10 + (this.boat.aftKeel.end[0] - this.boat.aftKeel.start[0]);
        xMaths.x11 = xMaths.x10 + Math.abs(this.boat.aftKeel.end[2] - this.boat.aftKeel.start[2]);
        yMaths.ecy8 = yMaths.y11 - this.boat.aftKeel.endControl[0];
        xMaths.ecx8 = xMaths.x11 - Math.abs(this.boat.aftKeel.endControl[2]);
        yMaths.scy8 = yMaths.y11 - Math.abs(this.boat.aftKeel.startControl[0]);
        xMaths.scx8 = xMaths.x11 - Math.abs(this.boat.aftKeel.startControl[2]);

        // Get coordinates for aft panel
        applyOffsets(this.boat, this.boat.aftBeamEdge, 'aftBeamEdge');
        yMaths.y12 = yMaths.y11 + 15;
        xMaths.x12 = 15;
        yMaths.y13 = Math.abs(this.boat.aftBeamEdge.start[2] - this.boat.aftBeamEdge.end[2]) * 2 + yMaths.y12;
        xMaths.x13 = Math.abs(this.boat.aftBeamEdge.start[0] - this.boat.aftBeamEdge.end[0]) * 2 + xMaths.x12;

        applyOffsets(this.boat, this.boat.aftGunEdge, 'aftGunEdge');
        yMaths.y14 = Math.abs(this.boat.aftBeamEdge.end[1] - this.boat.aftGunEdge.end[1]) + yMaths.y12;
        xMaths.x14 = xMaths.x12 + Math.abs(this.boat.aftBeamEdge.end[0] - this.boat.aftGunEdge.end[0]);
        yMaths.y15 = Math.abs(this.boat.aftGunEdge.start[2] - this.boat.aftGunEdge.end[2]) * 2 + yMaths.y14;
        xMaths.x15 = Math.abs(this.boat.aftGunEdge.start[0] - this.boat.aftGunEdge.end[0]) * 2 + xMaths.x14;

        // Get coorindates for fore panel
        applyOffsets(this.boat, this.boat.foreBeamEdge, 'foreBeamEdge');
        yMaths.y16 = yMaths.y15 + 15;
        xMaths.x16 = 15;
        yMaths.y17 = Math.abs(this.boat.foreBeamEdge.start[2] - this.boat.foreBeamEdge.end[2]) * 2 + yMaths.y16;
        xMaths.x17 = Math.abs(this.boat.foreBeamEdge.start[0] - this.boat.foreBeamEdge.end[0]) * 2 + xMaths.x16;

        applyOffsets(this.boat, this.boat.foreGunEdge, 'foreGunEdge');
        yMaths.y18 = Math.abs(this.boat.foreBeamEdge.end[1] - this.boat.foreGunEdge.end[1]) + yMaths.y16;
        xMaths.x18 = xMaths.x16 + Math.abs(this.boat.foreBeamEdge.end[0] - this.boat.foreGunEdge.end[0]);
        yMaths.y19 = Math.abs(this.boat.foreGunEdge.start[2] - this.boat.foreGunEdge.end[2]) * 2 + yMaths.y18;
        xMaths.x19 = Math.abs(this.boat.foreGunEdge.start[0] - this.boat.foreGunEdge.end[0]) * 2 + xMaths.x18;

        yMaths.y21 = yMaths.y19 + 15;
        xMaths.x21 = 15;
        xMaths.x22 = Math.abs(location1.x - location2.x) + xMaths.x21;
        yMaths.y22 = Math.abs(this.boat.aftBeam.start[1] - this.boat.aftChine.start[1]) + yMaths.y21;
        xMaths.x23 = Math.abs(location2.x - location3.x) + xMaths.x22;
        yMaths.y23 = Math.abs(this.boat.aftChine.start[1] - this.boat.aftKeel.start[1]) + yMaths.y22;

      //   Get reference points
        yMaths.y20 = Math.abs(Math.abs(this.boat.foreBeam.end[0] - Math.abs(refPoints.forePoint.x)) - 20);
        xMaths.x20 = Math.abs(this.boat.foreBeam.start[2] - refPoints.forePoint.z) + 15 - 1.6;
        console.log(refPoints.forePoint);

        // Coordinates put into usable structures for d3
        const struct = {
            panel1Box: {
                line: true,
                color: 'blue',
                width: 1,
                text: false,
                points: [
                    {x: 15, y: yMaths.y1}, {x: xMaths.x2, y: yMaths.y1},
                    {x: xMaths.x2, y: yMaths.y4}, {x: 15, y: yMaths.y4},
                    {x: 15, y: yMaths.y1},
                ]},

            panel2Box: {
                line: true,
                color: 'blue',
                width: 1,
                text: false,
                points: [
                    {x: xMaths.x6, y: yMaths.y7}, {x: xMaths.x8, y: yMaths.y7},
                    {x: xMaths.x8, y: yMaths.y10}, {x: xMaths.x6, y: yMaths.y10},
                    {x: xMaths.x6, y: yMaths.y7},
                ]},

            panel1Label: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'panel1Length',
                points: [
                    {x: 15, y: yMaths.y1 - 2}, {x: xMaths.x2, y: yMaths.y1 - 2},
                ]},

            panel1Line: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'panel1Height',
                points: [
                    {x: xMaths.x2 + 2, y: yMaths.y1}, {x: xMaths.x2 + 2, y: yMaths.y4},
                ]},

            panel2Label: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'panel2Length',
                points: [
                    {x: xMaths.x6, y: yMaths.y7 - 2}, {x: xMaths.x8, y: yMaths.y7 - 2},
                ]},

            panel2Line: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'panel2Height',
                points: [
                    {x: xMaths.x8 + 2, y: yMaths.y7}, {x: xMaths.x8 + 2, y: yMaths.y10},
                ]},

            aftPanelTitle: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'title',
                points: [
                    {x: xMaths.x12, y: yMaths.y12 - 5}, {x: xMaths.x13 + 15, y: yMaths.y12 - 5},
                ]},

            aftPanel: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'aftBeamLength',
                points: [
                    {x: xMaths.x12, y: yMaths.y12 - 1}, {x: xMaths.x13, y: yMaths.y12 - 1},
                ]},

            aftHeightLine: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'aftHeight',
                points: [
                    {x: xMaths.x13 + 1, y: yMaths.y13}, {x: xMaths.x15 + 1, y: yMaths.y15},
                ]},

            aftPanelLine: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'aftGunLength',
                points: [
                    {x: xMaths.x14, y: yMaths.y14 - 1}, {x: xMaths.x15, y: yMaths.y15 - 1},
                ]},

            forePanelTitle: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'title',
                points: [
                    {x: xMaths.x16, y: yMaths.y16 - 5}, {x: xMaths.x17 + 15, y: yMaths.y17 - 5},
                ]},

            forePanel: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'foreBeamLength',
                points: [
                    {x: xMaths.x16, y: yMaths.y16 - 1}, {x: xMaths.x17, y: yMaths.y17 - 1},
                ]},

            foreHeightLine: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'foreHeight',
                points: [
                    {x: xMaths.x17 + 1, y: yMaths.y17}, {x: xMaths.x19 + 1, y: yMaths.y19},
                ]},

            forePanelLine: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'foreGunLength',
                points: [
                    {x: xMaths.x18, y: yMaths.y18 - 1}, {x: xMaths.x19, y: yMaths.y19 - 1},
                ]},

            beamFore: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: 15, y: 20}, {x: xMaths.scx1, y: yMaths.scy1},
                    {x: xMaths.ecx1, y: yMaths.ecy1}, {x: xMaths.x1, y: yMaths.y1},
                ]},

            beamAft: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x1, y: yMaths.y1}, {x: xMaths.scx2, y: yMaths.scy2},
                    {x: xMaths.ecx2, y: yMaths.ecy2}, {x: xMaths.x2, y: yMaths.y2},
                ]},

            chineFor: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x3, y: yMaths.y3}, {x: xMaths.ecx3, y: yMaths.ecy3},
                    {x: xMaths.scx3, y: yMaths.scy3}, {x: xMaths.x4, y: yMaths.y4},
                ]},

            chineAf: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x4, y: yMaths.y4}, {x: xMaths.scx4, y: yMaths.scy4},
                    {x: xMaths.ecx4, y: yMaths.ecy4}, {x: xMaths.x5, y: yMaths.y5},
                ]},

            sternCon: {
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x2, y: yMaths.y2}, {x: xMaths.x5, y: yMaths.y5},
                ]},

            sternCon0: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'sternConn',
                points: [
                    {x: xMaths.x5 - 1, y: yMaths.y5}, {x: xMaths.x2 - 1, y: yMaths.y2},
                ]},

            foreCon: {
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: 15, y: 20}, {x: xMaths.x3, y: yMaths.y3},
                ]},

            foreCon0: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'foreConn',
                points: [
                    {x: 15 + 1, y: 20}, {x: xMaths.x3 + 1, y: yMaths.y3},
                ]},

            forChine: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x6, y: yMaths.y6}, {x: xMaths.ecx5, y: yMaths.ecy5},
                    {x: xMaths.scx5, y: yMaths.scy5}, {x: xMaths.x7, y: yMaths.y7},
                ]},

            afChine: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x7, y: yMaths.y7}, {x: xMaths.scx6, y: yMaths.scy6},
                    {x: xMaths.ecx6, y: yMaths.ecy6}, {x: xMaths.x8, y: yMaths.y8},
                ]},

            forKeel: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x9, y: yMaths.y9}, {x: xMaths.ecx7, y: yMaths.ecy7},
                    {x: xMaths.scx7, y: yMaths.scy7}, {x: xMaths.x10, y: yMaths.y10},
                ]},

            afKeel: {
                line: false,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x10, y: yMaths.y10}, {x: xMaths.scx8, y: yMaths.scy8},
                    {x: xMaths.ecx8, y: yMaths.ecy8}, {x: xMaths.x11, y: yMaths.y11},
                ]},

            aftKeelCon: {
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x8, y: yMaths.y8}, {x: xMaths.x11, y: yMaths.y11},
                ]},

            aftKeelCon0: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'sternConn1',
                points: [
                    {x: xMaths.x11 - 1, y: yMaths.y11}, {x: xMaths.x8 - 1, y: yMaths.y8},
                ]},

            forKeelCon: {
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x6, y: yMaths.y6}, {x: xMaths.x9, y: yMaths.y9},
                ]},

            forKeelCon0: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'foreConn1',
                points: [
                    {x: xMaths.x6 + 1, y: yMaths.y6}, {x: xMaths.x9 + 1, y: yMaths.y9},
                ]},

            beamAftEdge: {
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x12, y: yMaths.y12}, {x: xMaths.x13, y: yMaths.y13},
                    {x: xMaths.x15, y: yMaths.y15}, {x: xMaths.x14, y: yMaths.y14},
                    {x: xMaths.x12, y: yMaths.y12},
                ]},

            gunForeEdge: {
                line: true,
                color: 'red',
                width: 2,
                text: false,
                points: [
                    {x: xMaths.x16, y: yMaths.y16}, {x: xMaths.x17, y: yMaths.y17},
                    {x: xMaths.x19, y: yMaths.y19}, {x: xMaths.x18, y: yMaths.y18},
                    {x: xMaths.x16, y: yMaths.y16},
                ]},

            frameTitle: {
                line: true,
                color: 'invisible',
                width: 2,
                text: true,
                variable: 'title',
                points: [
                    {x: xMaths.x16, y: yMaths.y19 + 10}, {x: xMaths.x16 + 30, y: yMaths.y19 + 10},
                ]},

            refPoint1: {
                line: true,
                color: 'black',
                width: 2,
                text: false,
                variable: 'refPoint1',
                points: [
                    {x: xMaths.x20, y: yMaths.y20}, {x: xMaths.x20, y: yMaths.y1},
                ]},

        };
        return struct;
    }

    drawBlueprints(boat) {
        const coords = this.getCoords(boat);
        const frames = this.getFrameCoords(boat, coords.gunForeEdge.points[2].y);
        const refPoints = this.getReference(boat);

        // Acquire dimensions
        const variables = {
            panel1Length: Math.abs(15 - coords.beamAft.points[3].x),
            panel1Height: Math.abs(coords.beamFore.points[3].y - coords.chineFor.points[3].y),
            panel2Length: Math.abs(coords.forChine.points[0].x - coords.afChine.points[3].x),
            panel2Height: Math.abs(coords.afChine.points[0].y - coords.forKeel.points[3].y),
            aftBeamLength: Math.abs(coords.beamAftEdge.points[0].x - coords.beamAftEdge.points[1].x),
            aftGunLength: Math.abs(coords.beamAftEdge.points[3].x - coords.beamAftEdge.points[2].x),
            foreBeamLength: Math.abs(coords.gunForeEdge.points[0].x - coords.gunForeEdge.points[1].x),
            foreGunLength: Math.abs(coords.gunForeEdge.points[3].x - coords.gunForeEdge.points[2].x),
            aftHeight: this.pythagorean(coords.beamAftEdge.points[1].x, coords.beamAftEdge.points[2].x,
                coords.beamAftEdge.points[1].y, coords.beamAftEdge.points[2].y),
            foreHeight: this.pythagorean(coords.gunForeEdge.points[1].x, coords.gunForeEdge.points[2].x,
                coords.gunForeEdge.points[1].y, coords.gunForeEdge.points[2].y),
            foreConn: this.pythagorean(coords.beamFore.points[0].x, coords.chineFor.points[0].x,
                coords.beamFore.points[0].y, coords.chineFor.points[0].y),
            sternConn: this.pythagorean(coords.beamAft.points[3].x, coords.chineAf.points[3].x,
                coords.beamAft.points[3].y, coords.chineAf.points[3].y),
            foreConn1: this.pythagorean(coords.forChine.points[0].x, coords.forKeel.points[0].x,
                coords.forChine.points[0].y, coords.forKeel.points[0].y),
            sternConn1: this.pythagorean(coords.afChine.points[3].x, coords.afKeel.points[3].x,
                coords.afChine.points[3].y, coords.afKeel.points[3].y),
              refPoint1: Number(Math.abs(coords.beamFore.points[3].y - coords.refPoint1.points[0].y).toFixed(1)),
        };
        const windowHeight = Math.abs(coords.beamFore.points[3].y - coords.gunForeEdge.points[2].y) * 30;
        const elem = $('#blueprint-container')[0];
        this.canvas = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', windowHeight);


        // Scale for svg window sizing
        const scale = 0.008;

        // Function to create Bezier curves
        const lineFunction = d3.line()
            .x((d) => (d.x) * elem.clientWidth * scale)
            .y((d) => (d.y) * elem.clientWidth * scale)
            .curve(d3.curveLinear);

        // Function to create straight lines (Mostly used to show control points)
        const lineFunc = d3.line()
            .x((d) => (d.x) * elem.clientWidth * scale)
            .y((d) => (d.y) * elem.clientWidth * scale)
            .curve(d3.curveBasis);

        // Draw blueprints and insert text
        Object.keys(coords).forEach((key) => {
            if (coords[key].color === 'invisible') {
                if (coords[key].line === true) {
                    this.canvas.append('path')
                        .attr('id', key)
                        .attr('d', lineFunction(coords[key].points))
                        .attr('stroke-width', coords[key].width)
                        .attr('fill', 'none');
                }
            } else if (coords[key].line === true) {
                this.canvas.append('path')
                    .attr('id', key)
                    .attr('d', lineFunction(coords[key].points))
                    .attr('stroke', coords[key].color)
                    .attr('stroke-width', coords[key].width)
                    .attr('fill', 'none');
            } else {
                this.canvas.append('path')
                    .attr('d', lineFunc(coords[key].points))
                    .attr('stroke', coords[key].color)
                    .attr('stroke-width', coords[key].width)
                    .attr('fill', 'none');
            }
            if (coords[key].text === true) {
                const label = `#${key}`;
                const label1 = coords[key].variable;
                if (coords[key].variable in variables) {
                    if (key === 'panel1Label') {
                        this.canvas.append('text')
                            .append('textPath')
                            .attr('xlink:href', label)
                            .text('Port/Starboard Panels');
                    } else if (key === 'panel2Label') {
                        this.canvas.append('text')
                            .append('textPath')
                            .attr('xlink:href', label)
                            .text('Keel Panels');
                    }
                    this.canvas.append('text')
                        .append('textPath')
                        .attr('startOffset', '50%')
                        .attr('xlink:href', label)
                        .text(variables[label1]);
                }
                if (coords[key].variable === 'title') {
                    if (key === 'aftPanelTitle') {
                        this.canvas.append('text')
                            .append('textPath')
                            .attr('xlink:href', label)
                            .text('Aft Panel');
                    } else if (key === 'forePanelTitle') {
                        this.canvas.append('text')
                            .append('textPath')
                            .attr('xlink:href', label)
                            .text('Fore Panel');
                    } else if (key === 'frameTitle') {
                        this.canvas.append('text')
                            .append('textPath')
                            .attr('xlink:href', label)
                            .text('Frames');
                    }
                }
            }
        });

        Object.keys(frames).forEach((key) => {
        /*  if (coords[key].color === 'invisible') {
                if (coords[key].line === true) {
                    this.canvas.append('path')
                        .attr('id', key)
                        .attr('d', lineFunction(coords[key].points))
                        .attr('stroke-width', coords[key].width)
                        .attr('fill', 'none');
                }
            } else */if (frames[key].line === true && frames[key].empty === false) {
                this.canvas.append('path')
                    .attr('id', key)
                    .attr('d', lineFunction(frames[key].points))
                    .attr('stroke', frames[key].color)
                    .attr('stroke-width', frames[key].width)
                    .attr('fill', 'none');
            }/*
            if (coords[key].text === true) {
                const label = `#${key}`;
                const label1 = coords[key].variable;
                if (coords[key].variable in variables) {
                    if (key === 'panel1Label') {
                        this.canvas.append('text')
                            .append('textPath')
                            .attr('xlink:href', label)
                            .text('Port/Starboard Panels');
                    } else if (key === 'panel2Label') {
                        this.canvas.append('text')
                            .append('textPath')
                            .attr('xlink:href', label)
                            .text('Keel Panels');
                    }
                    this.canvas.append('text')
                        .append('textPath')
                        .attr('startOffset', '50%')
                        .attr('xlink:href', label)
                        .text(variables[label1]);
                }
            } */
        });

          const test = this.getReference(boat);
         // console.log(test);
    }

    update() {
        const current = this.boatParametersService.getBoat();
        if (current === undefined) {
            return;
        }
        this.canvas.remove();
        this.boat = JSON.parse(JSON.stringify(current));
        this.drawBlueprints(this.boat);
    }

    $onInit() {
        this.boatParametersService.getBoat().then((data) => {
            this.boat = JSON.parse(JSON.stringify(data));
            this.drawBlueprints(this.boat);

            this.$scope.$watchCollection(
                () => this.boatParametersService.checkUpdate(),
                (newVal, oldVal, scope) => {
                    this.update();
                },
            );
        });
    }
}
