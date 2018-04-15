// Global imports
import * as d3 from 'd3';
/* Original sidepanel coordinates
const sidePanel = [
    {x: 1, y: 1}, {x: 500, y: 1},
    {x: 500, y: 1}, {x: 500, y: 20},
    {x: 250, y: 150}, {x: 1, y: 170},
    {x: 1, y: 170}, {x: 1, y: 1},
];
*/


export default class BlueprintEditor {
    constructor($scope, $timeout, boatParametersService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
    }

    applyOffsets(curve, key) {
        // Define offsets
        let lengthOffset = key.toLowerCase().includes('aft') ? -this.boat.length : this.boat.length;
        let heightOffset = key.toLowerCase().includes('beam') ? this.boat.height : -this.boat.height;
        const widthOffset = key.toLowerCase().includes('keel') ? 0 : this.boat.width;

        if (key.toLowerCase().includes('frame')) {
            heightOffset = this.boat.height;
        }
        if (key.toLowerCase().includes('mid')) {
            lengthOffset = 0;
        }

        // Apply offsets
        const curveCoordinates = curve;
        if (! key.toLowerCase().includes('edge')) {
            curveCoordinates.start[0] += widthOffset;
        }
        curveCoordinates.end[0] += widthOffset;

        curveCoordinates.start[1] += heightOffset;
        if (key.toLowerCase().includes('frame')) {
            heightOffset = -heightOffset;
        }
        curveCoordinates.end[1] += heightOffset;

        curveCoordinates.end[2] += lengthOffset;
        if (key.toLowerCase().includes('edge') || key.toLowerCase().includes('frame')) {
            curveCoordinates.start[2] += lengthOffset;
        }
        return curveCoordinates;
    }

    drawBlueprints(boat) {

        // Coordinates for first panel
        // Get Coordinates for foreBeam
        this.applyOffsets(this.boat.foreBeam, 'foreBeam');
        const y1 = Math.abs(Math.abs(this.boat.foreBeam.end[0] - this.boat.foreBeam.start[0]) - 20);
        const x1 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreBeam.start[2]) + 15;
        const scy1 = Math.abs(this.boat.foreBeam.endControl[0] - 20);
        const scx1 = Math.abs(this.boat.foreBeam.endControl[2] - 15);
        const ecy1 = Math.abs(this.boat.foreBeam.startControl[0] - y1);
        const ecx1 = Math.abs(this.boat.foreBeam.startControl[2] - x1);

        // Get Coordinates for aftBeam
        this.applyOffsets(this.boat.aftBeam, 'aftBeam');
        const y2 = Math.abs(this.boat.aftBeam.start[0] - this.boat.aftBeam.end[0]) + y1;
        const x2 = Math.abs(this.boat.aftBeam.start[2] - this.boat.aftBeam.end[2]) + x1;
        const scy2 = Math.abs(this.boat.aftBeam.startControl[0] - y1);
        const scx2 = Math.abs(this.boat.aftBeam.startControl[2] - x1);
        const ecy2 = Math.abs(this.boat.aftBeam.endControl[0] - y2);
        const ecx2 = Math.abs(this.boat.aftBeam.endControl[2] - x2);

        // Get Coordinates for foreChine
        this.applyOffsets(this.boat.foreChine, 'foreChine');
        const y3 = Math.abs(this.boat.foreBeam.end[1] - this.boat.foreChine.end[1]) + 20;
        const x3 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreChine.end[2]) + 15;
        const ecy3 = Math.abs(this.boat.foreChine.endControl[0]) + y3;
        const ecx3 = Math.abs(this.boat.foreChine.endControl[2]) + x3;
        const y4 = Math.abs(this.boat.foreChine.end[0] - this.boat.foreChine.start[0]) + y3;
        const x4 = Math.abs(this.boat.foreChine.end[2] - this.boat.foreChine.start[2]) + x3;
        const scy3 = this.boat.foreChine.startControl[0] + y4;
        const scx3 = x4 - this.boat.foreChine.startControl[2];

        // Get Coordinates for aftChine
        this.applyOffsets(this.boat.aftChine, 'aftChine');
        const y5 = y4 - Math.abs(this.boat.aftChine.start[0] - this.boat.aftChine.end[0]);
        const x5 = Math.abs(this.boat.aftChine.start[2] - this.boat.aftChine.end[2]) + x4;
        const scy4 = this.boat.aftChine.startControl[0] + y4;
        const scx4 = Math.abs(this.boat.aftChine.startControl[2]) + x4;
        const ecy4 = this.boat.aftChine.endControl[0] + y5;
        const ecx4 = x5 - this.boat.aftChine.endControl[2];

        // Coordinates for second second panel
        // Get coordinates for foreChine (mirror along x-asix)
        const y6 = Math.abs(this.boat.foreBeam.end[1] - this.boat.foreChine.end[1]) + scy4 + 10;
        const x6 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreChine.end[2]) + 15;
        const ecy5 = y6 - Math.abs(this.boat.foreChine.endControl[0]);
        const ecx5 = Math.abs(this.boat.foreChine.endControl[2]) + x6;
        const y7 = y6 - Math.abs(this.boat.foreChine.end[0] - this.boat.foreChine.start[0]);
        const x7 = Math.abs(this.boat.foreChine.end[2] - this.boat.foreChine.start[2]) + x6;
        const scy5 = y7 - this.boat.foreChine.startControl[0];
        const scx5 = x7 - this.boat.foreChine.startControl[2];

        // Get coordinates for aftChine (mirror along x-axis)
        const y8 = Math.abs(this.boat.aftChine.start[0] - this.boat.aftChine.end[0]) + y7;
        const x8 = Math.abs(this.boat.aftChine.start[2] - this.boat.aftChine.end[2]) + x7;
        const scy6 = y7 - this.boat.aftChine.startControl[0];
        const scx6 = Math.abs(this.boat.aftChine.startControl[2]) + x7;
        const ecy6 = y8 - this.boat.aftChine.endControl[0];
        const ecx6 = x8 - this.boat.aftChine.endControl[2];

        // Get coordinates for foreKeel
        this.applyOffsets(this.boat.foreKeel, 'foreKeel');
        const y9 = Math.abs(this.boat.foreKeel.end[0] - this.boat.foreChine.end[0]) + y6;
        const x9 = x6 - Math.abs(this.boat.foreKeel.end[2] - this.boat.foreChine.end[2]);
        const ecy7 = y9 - this.boat.foreKeel.endControl[0];
        const ecx7 = x9 + Math.abs(this.boat.foreKeel.endControl[2]);
        const y10 = y9 + (this.boat.foreKeel.end[0] - this.boat.foreKeel.start[0]);
        const x10 = x9 + (this.boat.foreKeel.end[2] - this.boat.foreKeel.start[2]);
        const scy7 = y9 - Math.abs(this.boat.foreKeel.startControl[0]);
        const scx7 = x9 - Math.abs(this.boat.foreKeel.startControl[2]);

        // Get coordinates for aftKeel
        this.applyOffsets(this.boat.aftKeel, 'aftKeel');
        const y11 = y10 + (this.boat.aftKeel.end[0] - this.boat.aftKeel.start[0]);
        const x11 = x10 + Math.abs(this.boat.aftKeel.end[2] - this.boat.aftKeel.start[2]);
        const ecy8 = y11 - this.boat.aftKeel.endControl[0];
        const ecx8 = x11 - Math.abs(this.boat.aftKeel.endControl[2]);
        const scy8 = y11 - Math.abs(this.boat.aftKeel.startControl[0]);
        const scx8 = x11 + Math.abs(this.boat.aftKeel.startControl[2]);


        // Coordinates put into usable structures for d3
        const beamFore = [
            {x: 15, y: 20}, {x: scx1, y: scy1},
            {x: ecx1, y: ecy1}, {x: x1, y: y1},
        ];

        const beamAft = [
            {x: x1, y: y1}, {x: scx2, y: scy2},
            {x: ecx2, y: ecy2}, {x: x2, y: y2},
        ];

        const chineFor = [
            {x: x3, y: y3}, {x: ecx3, y: ecy3},
            {x: scx3, y: scy3}, {x: x4, y: y4},
        ];

        const chineAf = [
            {x: x4, y: y4}, {x: scx4, y: scy4},
            {x: ecx4, y: ecy4}, {x: x5, y: y5},
        ];

        const foreCon = [
            {x: 15, y: 20}, {x: x3, y: y3},
        ];

        const sternCon = [
            {x: x2, y: y2}, {x: x5, y: y5},
        ];

        const forChine = [
            {x: x6, y: y6}, {x: ecx5, y: ecy5},
            {x: scx5, y: scy5}, {x: x7, y: y7},
        ];

        const afChine = [
            {x: x7, y: y7}, {x: scx6, y: scy6},
            {x: ecx6, y: ecy6}, {x: x8, y: y8},
        ];

        const forKeel = [
            {x: x9, y: y9}, {x: ecx7, y: ecy7},
            {x: scx7, y: scy7}, {x: x10, y: y10},
        ];

        const afKeel = [
            {x: x10, y: y10}, {x: scx8, y: scy8},
            {x: ecx8, y: ecy8}, {x: x11, y: y11},
        ];

        const forKeelCon = [
            {x: x6, y: y6}, {x: x9, y: y9},
        ];

        const aftKeelCon = [
            {x: x8, y: y8}, {x: x11, y: y11},
        ];

        const panel1Box = [
            {x: 15, y: y1}, {x: x2, y: y1},
            {x: x2, y: y4}, {x: 15, y: y4},
            {x: 15, y: ecy1},
        ];

        const panel2Box = [
            {x: x6, y: y7}, {x: x8, y: y7},
            {x: x8, y: y10}, {x: x6, y: y10},
            {x: x6, y: y7},
        ];

        const elem = $('#blueprint-container')[0];
        this.canvas = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', 700);


        // Scale for svg window sizing
        const scale = 0.008;
        /*
        const svgText = this.canvas.append('text')
            .attr('x', 15)
            .attr('y', y1)
            .text('Port and Starboard Panels');
        console.log(svgText);

        const svgText1 = this.canvas.append('text')
            .attr('x', x6)
            .attr('y', y7)
            .text('Keel Panels');
        console.log(svgText1); */

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

        // Create dimensional boxes
        this.canvas.append('path')
            .attr('d', lineFunction(panel1Box))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.canvas.append('path')
            .attr('d', lineFunction(panel2Box))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create aft and fore beam curves
        this.canvas.append('path')
            .attr('d', lineFunc(beamFore))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.canvas.append('path')
            .attr('d', lineFunc(beamAft))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create fore and aft chine curves
        this.canvas.append('path')
            .attr('d', lineFunc(chineFor))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.canvas.append('path')
            .attr('d', lineFunc(chineAf))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create connections between chine and beam curves
        this.canvas.append('path')
            .attr('d', lineFunction(sternCon))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.canvas.append('path')
            .attr('d', lineFunction(foreCon))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create for and aft chine curve (mirror along x-axis)
        this.canvas.append('path')
            .attr('d', lineFunc(forChine))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.canvas.append('path')
            .attr('d', lineFunc(afChine))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create for and aft keel curves
        this.canvas.append('path')
            .attr('d', lineFunc(forKeel))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.canvas.append('path')
            .attr('d', lineFunc(afKeel))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create connection between chine and keel curves
        this.canvas.append('path')
            .attr('d', lineFunction(aftKeelCon))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        this.canvas.append('path')
            .attr('d', lineFunction(forKeelCon))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }

    $onInit() {
        // this.$timeout(() => {
        const data = this.boatParametersService.getBoat().then((data) => {
            this.boat = JSON.parse(JSON.stringify(data));
            this.drawBlueprints(this.boat);
        });
        console.log(data);

    }
}
