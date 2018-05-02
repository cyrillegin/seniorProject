// Global imports
import * as d3 from 'd3';
import {saveAs} from 'file-saver';
// import jsPDF from 'jspdf';
import {casteljauPoint2D, findLocation, applyOffsets, conver3dTo2dCoordinates} from '../../utility/calculations';

/* Original sidepanel coordinates
const sidePanel = [
    {x: 15, y: 20}, {x: 26, y: 13},
    {x: 48, y: 65}, {x: 65, y: 7},
];
const sidePanel1 = [
    {x: 21.6, y: 15.8}, {x: 39.2, y: 44.2},
    {x: 58.2, y: 30.2},
];
const sidePanel2 = [
    {x: 32.16, y: 32.84}, {x: 50.6, y: 35.8},
];
/*
casteljauPoint, casteljauFromY
*/


export default class BlueprintEditor {
    constructor($scope, $timeout, boatParametersService) {
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
    }

    // I'll deal with this shit later
    getBoundingSize(coordStruct) {
        const vals = {
            miny1: 1000,
            minx1: 0,
            maxy1: 0,
            maxx1: 0,
            miny2: 1000,
            minx2: 0,
            maxy2: 0,
            maxx2: 0,
        };

        let i;
        for (i = 0; i <= 1.05; i = i + 0.05) {
            const topFore = casteljauPoint2D(coordStruct.beamFore, i);
            const bottomFore = casteljauPoint2D(coordStruct.chineFor, i);
            if (topFore.y < vals.miny1) {
                vals.miny1 = topFore.y;
            }

            if (topFore.y > vals.maxy1) {
                vals.maxy1 = topFore.y;
            }

            if (bottomFore.y > vals.maxy1) {
                vals.maxy1 = bottomFore.y;
            }

            if (bottomFore.y < vals.miny1) {
                vals.miny1 = bottomFore.y;
            }

            if (topFore.x > vals.maxx1) {
                vals.maxx1 = topFore.x;
            }

            if (bottomFore.x > vals.maxx1) {
                vals.maxx1 = bottomFore.x;
            }

            const topAft = casteljauPoint2D(coordStruct.beamAft, i);
            const bottomAft = casteljauPoint2D(coordStruct.chineAf, i);
            if (topAft.y < vals.miny1) {
                vals.miny1 = topAft.y;
            }

            if (topAft.y > vals.maxy1) {
                vals.maxy1 = topAft.y;
            }
            if (bottomAft.y > vals.maxy1) {
                vals.maxy1 = bottomAft.y;
            }

            if (bottomAft.y < vals.miny1) {
                vals.miny1 = bottomAft.y;
            }

            if (topAft.x > vals.maxx1) {
                vals.maxx1 = topAft.x;
            }

            if (bottomAft.x > vals.maxx1) {
                vals.maxx1 = bottomAft.x;
            }

            if ('forChine' in coordStruct) {
                const topChineFore = casteljauPoint2D(coordStruct.forChine, i);
                const bottomKeelFore = casteljauPoint2D(coordStruct.forKeel, i);
                if (topChineFore.y < vals.miny2) {
                    vals.miny2 = topChineFore.y;
                }

                if (topChineFore.y > vals.maxy2) {
                    vals.maxy2 = topChineFore.y;
                }

                if (bottomKeelFore.y > vals.maxy2) {
                    vals.maxy2 = bottomKeelFore.y;
                }

                if (bottomKeelFore.y < vals.miny2) {
                    vals.miny2 = bottomKeelFore.y;
                }

                if (topChineFore.x > vals.maxx2) {
                    vals.maxx2 = topChineFore.x;
                }

                if (bottomKeelFore.x > vals.maxx2) {
                    vals.maxx2 = bottomKeelFore.x;
                }

                const topChineAft = casteljauPoint2D(coordStruct.afChine, i);
                const bottomKeelAft = casteljauPoint2D(coordStruct.afKeel, i);
                if (topChineAft.y < vals.miny2) {
                    vals.miny2 = topChineAft.y;
                }

                if (topChineAft.y > vals.maxy2) {
                    vals.maxy2 = topChineAft.y;
                }

                if (bottomKeelAft.y > vals.maxy2) {
                    vals.maxy2 = bottomKeelAft.y;
                }

                if (bottomKeelAft.y < vals.miny2) {
                    vals.miny2 = bottomKeelAft.y;
                }

                if (topChineAft.x > vals.maxx2) {
                    vals.maxx2 = topChineAft.x;
                }

                if (bottomKeelAft.x > vals.maxx2) {
                    vals.maxx2 = bottomKeelAft.x;
                }
            }
        }
        // console.log('vals', vals);
        return vals;
    }

    // Acquire points to draw reference lines
    getReference(coords) {
        const refPoints = {};
        // Get foreBeam reference
        refPoints.foreBeam = casteljauPoint2D(coords.beamFore, 0.25);
        refPoints.foreBeam.x = Number(Math.abs(refPoints.foreBeam.x).toFixed(1));
        refPoints.foreBeam.y = Number(Math.abs(refPoints.foreBeam.y).toFixed(1));

        // Get aftBeam reference
        refPoints.aftBeam = casteljauPoint2D(coords.beamAft, 0.75);
        refPoints.aftBeam.x = Number(Math.abs(refPoints.aftBeam.x).toFixed(1));
        refPoints.aftBeam.y = Number(Math.abs(refPoints.aftBeam.y).toFixed(1));

        // Get foreChine reference
        refPoints.foreChine = casteljauPoint2D(coords.chineFor, 0.25);
        refPoints.foreChine.x = Number(Math.abs(refPoints.foreChine.x).toFixed(1));
        refPoints.foreChine.y = Number(Math.abs(refPoints.foreChine.y).toFixed(1));

        // Get aftChine reference
        refPoints.aftChine = casteljauPoint2D(coords.chineAf, 0.75);
        refPoints.aftChine.x = Number(Math.abs(refPoints.aftChine.x).toFixed(1));
        refPoints.aftChine.y = Number(Math.abs(refPoints.aftChine.y).toFixed(1));

        // Get foreKeelChine reference
        refPoints.foreKeelChine = casteljauPoint2D(coords.forChine, 0.25);
        refPoints.foreKeelChine.x = Number(Math.abs(refPoints.foreKeelChine.x).toFixed(1));
        refPoints.foreKeelChine.y = Number(Math.abs(refPoints.foreKeelChine.y).toFixed(1));

        // Get aftKeelChine reference
        refPoints.aftKeelChine = casteljauPoint2D(coords.afChine, 0.75);
        refPoints.aftKeelChine.x = Number(Math.abs(refPoints.aftKeelChine.x).toFixed(1));
        refPoints.aftKeelChine.y = Number(Math.abs(refPoints.aftKeelChine.y).toFixed(1));

        // Get foreKeel reference
        refPoints.foreKeel = casteljauPoint2D(coords.forKeel, 0.25);
        refPoints.foreKeel.x = Number(Math.abs(refPoints.foreKeel.x).toFixed(1));
        refPoints.foreKeel.y = Number(Math.abs(refPoints.foreKeel.y).toFixed(1));

        // Get aftKeel reference
        refPoints.aftKeel = casteljauPoint2D(coords.afKeel, 0.75);
        refPoints.aftKeel.x = Number(Math.abs(refPoints.aftKeel.x).toFixed(1));
        refPoints.aftKeel.y = Number(Math.abs(refPoints.aftKeel.y).toFixed(1));

        return refPoints;
    }

    // Acquire coordinates of frames
    getFrameCoords(boat, lastY) {

        // Structure containing the info required to print the frames
        const frames = {};
        for (let i = 1; i <= 15; i++) {
            frames[`frame${i}`] = {
                count: i, empty: true, line: true, color: 'red', width: 2, text: true, size: 0, points: [
                    {}, {}, {}, {}, {},
                ],
                pointsTop: [
                    {}, {},
                ],
            },

            frames[`frame${i}Top`] = {
                count: i, empty: true, line: true, color: 'invisible', width: 2, text: true, size: 0, variable: 'frameTop', points: [
                    {}, {},
                ],
            },

            frames[`frame${i}Side`] = {
                count: i, empty: true, line: true, color: 'invisible', width: 2, text: true, size: 0, variable: 'frameSide', size: 0, points: [
                    {}, {},
                ],
            };
        }

        // Find the location of each frame and insert their offsets into the structure
        let currY = lastY;
        let i = 1;
        let count = 0;
        let startY;
        boat.frames.forEach((frame, index) => {
            const {locationA, locationB, locationC} = findLocation(boat, frame);
            Object.keys(frames).forEach((key) => {
                if (frames[key].count === i) {
                    // const prevY = currY;
                    if (frames[key].color !== 'invisible') {
                        frames[key].points[0].x = 15;
                        startY = currY + 15;
                        frames[key].points[0].y = startY;
                        frames[key].points[1].x = Math.abs(locationA.x - locationB.x) + frames[key].points[0].x;
                        frames[key].points[1].y = Math.abs(locationA.y - locationB.y) + frames[key].points[0].y;
                        frames[key].points[2].x = Math.abs(locationB.x - locationC.x) + frames[key].points[1].x;
                        frames[key].points[2].y = Math.abs(locationB.y - locationC.y) + frames[key].points[1].y;
                        frames[key].points[3].x = Math.abs(locationB.x - locationC.x) + frames[key].points[2].x;
                        frames[key].points[3].y = Math.abs(Math.abs(locationB.y - locationC.y) - frames[key].points[2].y);
                        frames[key].points[4].x = Math.abs(locationA.x - locationB.x) + frames[key].points[3].x;
                        frames[key].points[4].y = Math.abs(Math.abs(locationA.y - locationB.y) - frames[key].points[3].y);
                        currY = frames[key].points[2].y;
                        frames[key].size = this.pythagorean(frames[key].points[2].x, frames[key].points[1].x, frames[key].points[2].y, frames[key].points[1].y) * 2;

                        frames[key].pointsTop[0].x = 15;
                        frames[key].pointsTop[0].y = startY;
                        frames[key].pointsTop[1].x = Math.abs(locationA.x - locationB.x) + frames[key].points[3].x;
                        frames[key].pointsTop[1].y = Math.abs(Math.abs(locationA.y - locationB.y) - frames[key].points[3].y);
                        frames[key].topSize = this.pythagorean(frames[key].pointsTop[0].x, frames[key].pointsTop[1].x, frames[key].pointsTop[0].y, frames[key].pointsTop[1].y);
                    } else {
                        if (frames[key].variable === 'frameSide') {
                            frames[key].points[0].x = 16;
                            frames[key].points[0].y = startY;
                            frames[key].points[1].x = Math.abs(locationA.x - locationB.x) + frames[key].points[0].x;
                            frames[key].points[1].y = Math.abs(locationA.y - locationB.y) + frames[key].points[0].y;
                            frames[key].size = this.pythagorean(frames[key].points[0].x, frames[key].points[1].x, frames[key].points[0].y, frames[key].points[1].y) * 2;
                        }

                        if (frames[key].variable === 'frameTop') {
                            frames[key].points[0].x = 15;
                            frames[key].points[0].y = startY - 1;
                            frames[key].points[1].x = Math.abs(locationA.x - locationC.x) * 2 + frames[key].points[0].x;
                            frames[key].points[1].y = startY - 1;
                            frames[key].size = this.pythagorean(frames[key].points[0].x, frames[key].points[1].x, frames[key].points[0].y, frames[key].points[1].y);
                        }
                    }
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
                frames[key].text = true;
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

        // const refPoints = this.getReference(boat);
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

        // Coordinates put into usable structures for d3
        const struct = {
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
        };

            // Get bounding box 1 Coordinates
        const box1 = this.getBoundingSize(struct);

        struct.panel1Box = {
            line: true,
            color: 'blue',
            width: 1,
            text: false,
            points: [
                {x: 15, y: box1.miny1}, {x: box1.maxx1, y: box1.miny1},
                {x: box1.maxx1, y: box1.maxy1}, {x: 15, y: box1.maxy1},
                {x: 15, y: box1.miny1},
            ]},

        struct.panel1Label = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'panel1Length',
            points: [
                {x: 15, y: box1.miny1 - 2}, {x: box1.maxx1, y: box1.miny1 - 2},
            ]},

        struct.panel1Line = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'panel1Height',
            points: [
                {x: box1.maxx1 + 2, y: box1.miny1}, {x: box1.maxx1 + 2, y: box1.maxy1},
            ]};

        // Coordinates for second  panel
        // Get coordinates for foreChine (mirror along x-asix)
        yMaths.y6 = struct.panel1Box.points[2].y + 20;
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

        struct.forChine = {
            line: false,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x6, y: yMaths.y6}, {x: xMaths.ecx5, y: yMaths.ecy5},
                {x: xMaths.scx5, y: yMaths.scy5}, {x: xMaths.x7, y: yMaths.y7},
            ]},

        struct.afChine = {
            line: false,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x7, y: yMaths.y7}, {x: xMaths.scx6, y: yMaths.scy6},
                {x: xMaths.ecx6, y: yMaths.ecy6}, {x: xMaths.x8, y: yMaths.y8},
            ]},

        struct.forKeel = {
            line: false,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x9, y: yMaths.y9}, {x: xMaths.ecx7, y: yMaths.ecy7},
                {x: xMaths.scx7, y: yMaths.scy7}, {x: xMaths.x10, y: yMaths.y10},
            ]},

        struct.afKeel = {
            line: false,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x10, y: yMaths.y10}, {x: xMaths.scx8, y: yMaths.scy8},
                {x: xMaths.ecx8, y: yMaths.ecy8}, {x: xMaths.x11, y: yMaths.y11},
            ]},

        struct.aftKeelCon = {
            line: true,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x8, y: yMaths.y8}, {x: xMaths.x11, y: yMaths.y11},
            ]},

        struct.aftKeelCon0 = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'sternConn1',
            points: [
                {x: xMaths.x11 - 1, y: yMaths.y11}, {x: xMaths.x8 - 1, y: yMaths.y8},
            ]},

        struct.forKeelCon = {
            line: true,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x6, y: yMaths.y6}, {x: xMaths.x9, y: yMaths.y9},
            ]},

        struct.forKeelCon0 = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'foreConn1',
            points: [
                {x: xMaths.x6 + 1, y: yMaths.y6}, {x: xMaths.x9 + 1, y: yMaths.y9},
            ]};

        // Add bounding points to coordinate structures
        const box2 = this.getBoundingSize(struct);

        struct.panel2Box = {
            line: true,
            color: 'blue',
            width: 1,
            text: false,
            points: [
                {x: xMaths.x6, y: box2.miny2}, {x: box2.maxx2, y: box2.miny2},
                {x: box2.maxx2, y: box2.maxy2}, {x: xMaths.x6, y: box2.maxy2},
                {x: xMaths.x6, y: box2.miny2},
            ]},

        struct.panel2Label = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'panel2Length',
            points: [
                {x: xMaths.x6, y: box2.miny2 - 2}, {x: box2.maxx2, y: box2.miny2 - 2},
            ]},

        struct.panel2Line = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'panel2Height',
            points: [
                {x: box2.maxx2 + 2, y: box2.miny2}, {x: box2.maxx2 + 2, y: box2.maxy2},
            ]};

        // Get coordinates for aft panel
        applyOffsets(this.boat, this.boat.aftBeamEdge, 'aftBeamEdge');
        yMaths.y12 = struct.panel2Box.points[2].y + 15;
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

        struct.beamAftEdge = {
            line: true,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x12, y: yMaths.y12}, {x: xMaths.x13, y: yMaths.y13},
                {x: xMaths.x15, y: yMaths.y15}, {x: xMaths.x14, y: yMaths.y14},
                {x: xMaths.x12, y: yMaths.y12},
            ]},

        struct.gunForeEdge = {
            line: true,
            color: 'red',
            width: 2,
            text: false,
            points: [
                {x: xMaths.x16, y: yMaths.y16}, {x: xMaths.x17, y: yMaths.y17},
                {x: xMaths.x19, y: yMaths.y19}, {x: xMaths.x18, y: yMaths.y18},
                {x: xMaths.x16, y: yMaths.y16},
            ]},

        struct.frameTitle = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'title',
            points: [
                {x: xMaths.x16, y: yMaths.y19 + 10}, {x: xMaths.x16 + 30, y: yMaths.y19 + 10},
            ]},

        struct.aftPanelTitle = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'title',
            points: [
                {x: xMaths.x12, y: yMaths.y12 - 5}, {x: xMaths.x13 + 15, y: yMaths.y12 - 5},
            ]},

        struct.aftPanel = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'aftBeamLength',
            points: [
                {x: xMaths.x12, y: yMaths.y12 - 1}, {x: xMaths.x13, y: yMaths.y12 - 1},
            ]},

        struct.aftHeightLine = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'aftHeight',
            points: [
                {x: xMaths.x13 + 1, y: yMaths.y13}, {x: xMaths.x15 + 1, y: yMaths.y15},
            ]},

        struct.aftPanelLine = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'aftGunLength',
            points: [
                {x: xMaths.x14, y: yMaths.y14 - 1}, {x: xMaths.x15, y: yMaths.y15 - 1},
            ]},

        struct.forePanelTitle = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'title',
            points: [
                {x: xMaths.x16, y: yMaths.y16 - 5}, {x: xMaths.x17 + 15, y: yMaths.y17 - 5},
            ]},

        struct.forePanel = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'foreBeamLength',
            points: [
                {x: xMaths.x16, y: yMaths.y16 - 1}, {x: xMaths.x17, y: yMaths.y17 - 1},
            ]},

        struct.foreHeightLine = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'foreHeight',
            points: [
                {x: xMaths.x17 + 1, y: yMaths.y17}, {x: xMaths.x19 + 1, y: yMaths.y19},
            ]},

        struct.forePanelLine = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            variable: 'foreGunLength',
            points: [
                {x: xMaths.x18, y: yMaths.y18 - 1}, {x: xMaths.x19, y: yMaths.y19 - 1},
            ]};


        // Add reference points to coordinates structure
        const ref = this.getReference(struct);

        struct.refPoint1 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.foreBeam.x, y: ref.foreBeam.y}, {x: ref.foreBeam.x, y: struct.panel1Box.points[0].y},
            ]},

        struct.refPoint1Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(struct.panel1Box.points[0].y - ref.foreBeam.y).toFixed(1)),
            points: [
                {x: ref.foreBeam.x - 1, y: ref.foreBeam.y}, {x: ref.foreBeam.x - 1, y: struct.panel1Box.points[0].y},
            ]},

        struct.refPoint2 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.aftBeam.x, y: ref.aftBeam.y}, {x: ref.aftBeam.x, y: struct.panel1Box.points[0].y},
            ]},

        struct.refPoint2Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(yMaths.y1 - ref.aftBeam.y).toFixed(1)),
            points: [
                {x: ref.aftBeam.x + 1, y: yMaths.y1}, {x: ref.aftBeam.x + 1, y: ref.aftBeam.y},
            ]},

        struct.refPoint3 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.foreChine.x, y: ref.foreChine.y}, {x: ref.foreChine.x, y: struct.panel1Box.points[2].y},
            ]},

        struct.refPoint3Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(struct.panel1Box.points[2].y - ref.foreChine.y).toFixed(1)),
            points: [
                {x: ref.foreChine.x - 1, y: struct.panel1Box.points[2].y}, {x: ref.foreChine.x - 1, y: ref.foreChine.y},
            ]},

        struct.refPoint4 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.aftChine.x, y: ref.aftChine.y}, {x: ref.aftChine.x, y: struct.panel1Box.points[2].y},
            ]},

        struct.refPoint4Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(struct.panel1Box.points[2].y - ref.aftChine.y).toFixed(1)),
            points: [
                {x: ref.aftChine.x + 1, y: ref.aftChine.y}, {x: ref.aftChine.x + 1, y: struct.panel1Box.points[2].y},
            ]},

        struct.refPoint5 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.foreKeelChine.x, y: ref.foreKeelChine.y}, {x: ref.foreKeelChine.x, y: struct.panel2Box.points[0].y},
            ]},

        struct.refPoint5Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(struct.panel2Box.points[0].y - ref.foreKeelChine.y).toFixed(1)),
            points: [
                {x: ref.foreKeelChine.x - 1, y: ref.foreKeelChine.y}, {x: ref.foreKeelChine.x - 1, y: struct.panel2Box.points[0].y},
            ]},

        struct.refPoint6 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.aftKeelChine.x, y: ref.aftKeelChine.y}, {x: ref.aftKeelChine.x, y: struct.panel2Box.points[0].y},
            ]},

        struct.refPoint6Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(struct.panel2Box.points[0].y - ref.aftKeelChine.y).toFixed(1)),
            points: [
                {x: ref.aftKeelChine.x + 1, y: struct.panel2Box.points[0].y}, {x: ref.aftKeelChine.x + 1, y: ref.aftKeelChine.y},
            ]},

        struct.refPoint7 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.foreKeel.x, y: ref.foreKeel.y}, {x: ref.foreKeel.x, y: struct.panel2Box.points[2].y},
            ]},

        struct.refPoint7Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(struct.panel2Box.points[2].y - ref.foreKeel.y).toFixed(1)),
            points: [
                {x: ref.foreKeel.x - 1, y: ref.foreKeel.y}, {x: ref.foreKeel.x - 1, y: struct.panel2Box.points[2].y},
            ]},

        struct.refPoint8 = {
            line: true,
            color: 'black',
            width: 2,
            text: false,
            points: [
                {x: ref.aftKeel.x, y: ref.aftKeel.y}, {x: ref.aftKeel.x, y: struct.panel2Box.points[2].y},
            ]},

        struct.refPoint8Size = {
            line: true,
            color: 'invisible',
            width: 2,
            text: true,
            size: Number(Math.abs(struct.panel2Box.points[2].y - ref.aftKeel.y).toFixed(1)),
            points: [
                {x: ref.aftKeel.x + 1, y: struct.panel2Box.points[2].y}, {x: ref.aftKeel.x + 1, y: ref.aftKeel.y},
            ]};
        // console.log('box1', struct.panel1Box);
        return struct;
    }

    drawBlueprints(boat) {
        const coords = this.getCoords(boat);
        const frames = this.getFrameCoords(boat, coords.gunForeEdge.points[2].y);

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
            // refPoint1: Number(Math.abs(coords.beamFore.points[3].y - coords.refPoint1.points[0].y).toFixed(1)),
        };
        
        const elem = $('#blueprint-container')[0];
        // Scale for svg window sizing
        const scale = 0.008;
        const pad = 10;
        
        let windowHeight = variables.panel1Height + variables.panel2Height + variables.aftHeight + variables.foreHeight;
        windowHeight += (variables.aftHeight + variables.foreHeight) / 2 * boat.frames.length;
        windowHeight += pad * 6; // for main blueprint padding
        windowHeight += pad * boat.frames.length; // pad for frames
        windowHeight *= elem.clientWidth * scale
        console.log(boat)
        console.log(variables)
        console.log(windowHeight)
        
        this.canvas = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', windowHeight);

        // Function to create Bezier curves
        const lineFunction = d3.line()
            .x((d) => (d.x) * elem.clientWidth * scale)
            .y((d) => (d.y) * elem.clientWidth * scale)
            .curve(d3.curveLinear);

        // Function to create straight lines (Mostly used to show control points)
        const lineFunc = d3.line()
            .x((d) => (d.x) * elem.clientWidth * scale)
            .y((d) => (d.y) * elem.clientWidth * scale)
            .curve(d3.curveBundle.beta(0.66));

        // Draw blueprints and insert text
        /*        this.canvas.append('path')
            .attr('d', lineFunction(sidePanel))
            .attr('stroke', 'orange')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

            this.canvas.append('path')
                .attr('d', lineFunction(sidePanel1))
                .attr('stroke', 'green')
                .attr('stroke-width', 2)
                .attr('fill', 'none');

                this.canvas.append('path')
                    .attr('d', lineFunction(sidePanel2))
                    .attr('stroke', 'purple')
                    .attr('stroke-width', 2)
                    .attr('fill', 'none');

            this.canvas.append('path')
                .attr('d', lineFunc(sidePanel))
                .attr('stroke', 'purple')
                .attr('stroke-width', 5)
                .attr('fill', 'none'); */

        this.canvas.append('path')
            .attr('id', 'panel1Box')
            .attr('d', lineFunction(coords.panel1Box.points))
            .attr('stroke', coords.panel1Box.color)
            .attr('stroke-width', coords.panel1Box.width)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'panel2Box')
            .attr('d', lineFunction(coords.panel2Box.points))
            .attr('stroke', coords.panel2Box.color)
            .attr('stroke-width', coords.panel2Box.width)
            .attr('fill', 'none');

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
                if (key !== 'panel1Box' && key !== 'panel2Box') {
                    this.canvas.append('path')
                        .attr('id', key)
                        .attr('d', lineFunction(coords[key].points))
                        .attr('stroke', coords[key].color)
                        .attr('stroke-width', coords[key].width)
                        .attr('fill', 'none');
                }
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
                        .attr('startOffset', '45%')
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
                } else {
                    this.canvas.append('text')
                        .append('textPath')
                        .attr('xlink:href', label)
                        .text(coords[key].size);
                }
            }
        });

        Object.keys(frames).forEach((key) => {
            if (frames[key].color === 'invisible') {
                if (frames[key].line === true && frames[key].text === true) {
                    if (Object.keys(frames[key].points[0]).length === 0) {
                        return;
                    }
                    this.canvas.append('path')
                        .attr('id', key)
                        .attr('d', lineFunction(frames[key].points))
                        .attr('stroke-width', frames[key].width)
                        .attr('fill', 'none');
                }
            } else if (frames[key].line === true && frames[key].empty === false) {
                this.canvas.append('path')
                    .attr('id', key)
                    .attr('d', lineFunction(frames[key].points))
                    .attr('stroke', frames[key].color)
                    .attr('stroke-width', frames[key].width)
                    .attr('fill', 'none');

                this.canvas.append('path')
                    .attr('id', frames[key].topVariable)
                    .attr('d', lineFunction(frames[key].pointsTop))
                    .attr('stroke', 'blue')
                    .attr('stroke-width', 1)
                    .attr('fill', 'none');
            }
            if (frames[key].text === true) {
                const label = `#${key}`;
                this.canvas.append('text')
                    .append('textPath')
                    .attr('startOffset', '50%')
                    .attr('xlink:href', label)
                    .text(frames[key].size);
            }

        });

        this.drawLegend(this.canvas, elem);
        this.setupImageExport(this.canvas);
    }

    setupImageExport(canvas) {
        // Adapted from http://bl.ocks.org/Rokotyan/0556f8facbaf344507cdc45dc3622177
        const savePNG = (callback) => {

            const width = canvas.node().clientWidth;
            const height = canvas.node().clientHeight;

            // Below are the functions that handle actual exporting:
            // getSVGString ( svgNode ) and svgString2Image( svgString, width, height, format, callback )
            function getSVGString(svgNode) {
                svgNode.setAttribute('xlink', 'http://www.w3.org/1999/xlink');
                const cssStyleText = getCSSStyles(svgNode);

                const styleElement = document.createElement('style');
                styleElement.setAttribute('type', 'text/css');
                styleElement.innerHTML = cssStyleText;
                const refNode = svgNode.hasChildNodes() ? svgNode.children[0] : null;
                svgNode.insertBefore(styleElement, refNode);


                const serializer = new XMLSerializer();
                let svgString = serializer.serializeToString(svgNode);
                svgString = svgString.replace(/(\w+)?:?xlink=/g, 'xmlns:xlink='); // Fix root xlink without namespace
                svgString = svgString.replace(/NS\d+:href/g, 'xlink:href'); // Safari NS namespace fix

                return svgString;

                function getCSSStyles(parentElement) {
                    const selectorTextArr = [];

                    // Add Parent element Id and Classes to the list
                    selectorTextArr.push(`#${parentElement.id}`);
                    for (let c = 0; c < parentElement.classList.length; c++) {
                        if (!selectorTextArr.includes(`.${parentElement.classList[c]}`)) {
                            selectorTextArr.push(`.${parentElement.classList[c]}`);
                        }
                    }

                    // Add Children element Ids and Classes to the list
                    const nodes = parentElement.getElementsByTagName('*');
                    for (let i = 0; i < nodes.length; i++) {
                        const id = nodes[i].id;
                        if (!selectorTextArr.includes(`#${id}`)) {
                            selectorTextArr.push(`#${id}`);
                        }

                        const classes = nodes[i].classList;
                        for (let c = 0; c < classes.length; c++) {
                            if (!selectorTextArr.includes(`.${classes[c]}`)) {
                                selectorTextArr.push(`.${classes[c]}`);
                            }
                        }
                    }

                    // Extract CSS Rules
                    let extractedCSSText = '';
                    for (let i = 0; i < document.styleSheets.length; i++) {
                        const s = document.styleSheets[i];

                        try {
                            if (!s.cssRules) {
                                continue;
                            }
                        } catch (e) {
                            if (e.name !== 'SecurityError') {
                                throw e; // for Firefox
                            }
                            continue;
                        }

                        const cssRules = s.cssRules;
                        for (let r = 0; r < cssRules.length; r++) {
                            if (selectorTextArr.includes(cssRules[r].selectorText)) {
                                extractedCSSText += cssRules[r].cssText;
                            }
                        }
                    }

                    return extractedCSSText;
                }
            }

            // format unused
            function svgString2Image(svgString, width, height, format, callback) {

                const imgsrc = `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svgString)))}`; // Convert SVG string to data URL

                const canvas = document.createElement('canvas');
                const context = canvas.getContext('2d');

                canvas.width = width;
                canvas.height = height;

                const image = new Image();
                image.onload = () => {
                    context.clearRect (0, 0, width, height);
                    context.drawImage(image, 0, 0, width, height);

                    canvas.toBlob((blob) => {
                        if (callback) {
                            callback(blob, 'Boat.png');
                        }
                    });
                };
                image.src = imgsrc;
            }
            const svgString = getSVGString(canvas.node());

          	svgString2Image(svgString, 2 * width, 2 * height, 'png', callback);
        };

        // const savePDF = () => {
        //     savePNG((image) => {
        //         const pdf = new jsPDF(); // eslint-disable-line
        //         pdf.addImage(image, 'PNG', 0, 0);
        //         pdf.save('boat.pdf');
        //     });
        // };

        const oldElement = document.getElementById('save-png');
        const newElement = oldElement.cloneNode(true);
        oldElement.parentNode.replaceChild(newElement, oldElement);
        document.querySelector('#save-png').addEventListener('click', () => savePNG(saveAs), true);

        // oldElement = document.getElementById('save-pdf');
        // newElement = oldElement.cloneNode(true);
        // oldElement.parentNode.replaceChild(newElement, oldElement);
        // document.querySelector('#save-pdf').addEventListener('click', savePDF, true);

    }

    drawLegend(canvas, elem) {
        const legend = canvas.append('g');

        const borderMargin = 20;
        const origin = [elem.clientWidth - borderMargin, elem.clientHeight - borderMargin];

        const legendWidth = 280;
        const legendHeight = 180;
        // Draw the border box
        // right side
        legend.append('line')
            .attr('x1', origin[0])
            .attr('y1', origin[1])
            .attr('x2', origin[0])
            .attr('y2', origin[1] - legendHeight)
            .attr('stroke-width', 2)
            .attr('stroke', 'black');
        // top side
        legend.append('line')
            .attr('x1', origin[0])
            .attr('y1', origin[1] - legendHeight)
            .attr('x2', origin[0] - legendWidth)
            .attr('y2', origin[1] - legendHeight)
            .attr('stroke-width', 2)
            .attr('stroke', 'black');
        // left side
        legend.append('line')
            .attr('x1', origin[0] - legendWidth)
            .attr('y1', origin[1])
            .attr('x2', origin[0] - legendWidth)
            .attr('y2', origin[1] - legendHeight)
            .attr('stroke-width', 2)
            .attr('stroke', 'black');
        // bottom side
        legend.append('line')
            .attr('x1', origin[0])
            .attr('y1', origin[1])
            .attr('x2', origin[0] - legendWidth)
            .attr('y2', origin[1])
            .attr('stroke-width', 2)
            .attr('stroke', 'black');

        const borderPad = 30;
        const lineHeight = 30;
        const lineLength = 60;
        const textMargin = 20;

        // Title
        legend.append('text')
            .attr('x', origin[0] - legendWidth / 2 - 30)
            .attr('y', origin[1] - legendHeight + lineHeight)
            .attr('fill', 'black')
            .attr('font-size', '20px')
            .attr('font-family', 'sans-serif')
            .text('Legend');

        // Draw line elements

        // panel edge
        legend.append('line')
            .attr('x1', origin[0] - legendWidth + borderPad)
            .attr('y1', origin[1] - legendHeight + lineHeight * 2)
            .attr('x2', origin[0] - legendWidth + borderPad + lineLength)
            .attr('y2', origin[1] - legendHeight + lineHeight * 2)
            .attr('stroke-width', 4)
            .attr('stroke', 'red');

        legend.append('text')
            .attr('x', origin[0] - legendWidth + borderPad + lineLength + textMargin)
            .attr('y', origin[1] - legendHeight + lineHeight * 2 + 5)
            .attr('fill', 'red')
            .attr('font-size', '20px')
            .attr('font-family', 'sans-serif')
            .text('Panel Edge');

        // bounding box
        legend.append('line')
            .attr('x1', origin[0] - legendWidth + borderPad)
            .attr('y1', origin[1] - legendHeight + lineHeight * 3)
            .attr('x2', origin[0] - legendWidth + borderPad + lineLength)
            .attr('y2', origin[1] - legendHeight + lineHeight * 3)
            .attr('stroke-width', 4)
            .attr('stroke', 'blue');

        legend.append('text')
            .attr('x', origin[0] - legendWidth + borderPad + lineLength + textMargin)
            .attr('y', origin[1] - legendHeight + lineHeight * 3 + 5)
            .attr('fill', 'blue')
            .attr('font-size', '20px')
            .attr('font-family', 'sans-serif')
            .text('Bounding Box');

        // Guide line
        legend.append('line')
            .attr('x1', origin[0] - legendWidth + borderPad)
            .attr('y1', origin[1] - legendHeight + lineHeight * 4)
            .attr('x2', origin[0] - legendWidth + borderPad + lineLength)
            .attr('y2', origin[1] - legendHeight + lineHeight * 4)
            .attr('stroke-width', 4)
            .attr('stroke', 'black');

        legend.append('text')
            .attr('x', origin[0] - legendWidth + borderPad + lineLength + textMargin)
            .attr('y', origin[1] - legendHeight + lineHeight * 4 + 5)
            .attr('fill', 'black')
            .attr('font-size', '20px')
            .attr('font-family', 'sans-serif')
            .text('Guide Line');

        // Note about units
        legend.append('text')
            .attr('x', origin[0] - legendWidth + borderPad)
            .attr('y', origin[1] - legendHeight + lineHeight * 5 + 5)
            .attr('fill', 'black')
            .attr('font-size', '20px')
            .attr('font-family', 'sans-serif')
            .text('(All units are in inches)');
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
