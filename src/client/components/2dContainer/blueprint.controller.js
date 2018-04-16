// Global imports
import * as d3 from 'd3';
import {applyOffsets} from '../../utility/calculations';

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
        'ngInject';

        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
    }

    drawBlueprints(boat) {

        // Coordinates for first panel
        // Get Coordinates for foreBeam
        applyOffsets(this.boat, this.boat.foreBeam, 'foreBeam');
        const y1 = Math.abs(Math.abs(this.boat.foreBeam.end[0] - this.boat.foreBeam.start[0]) - 20);
        const x1 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreBeam.start[2]) + 15;
        const scy1 = Math.abs(this.boat.foreBeam.endControl[0] - 20);
        const scx1 = Math.abs(this.boat.foreBeam.endControl[2] - 15);
        const ecy1 = Math.abs(this.boat.foreBeam.startControl[0] - y1);
        const ecx1 = Math.abs(this.boat.foreBeam.startControl[2] - x1);

        // Get Coordinates for aftBeam
        applyOffsets(this.boat, this.boat.aftBeam, 'aftBeam');
        const y2 = Math.abs(this.boat.aftBeam.start[0] - this.boat.aftBeam.end[0]) + y1;
        const x2 = Math.abs(this.boat.aftBeam.start[2] - this.boat.aftBeam.end[2]) + x1;
        const scy2 = Math.abs(this.boat.aftBeam.startControl[0] - y1);
        const scx2 = Math.abs(this.boat.aftBeam.startControl[2] - x1);
        const ecy2 = Math.abs(this.boat.aftBeam.endControl[0] - y2);
        const ecx2 = Math.abs(this.boat.aftBeam.endControl[2] - x2);

        // Get Coordinates for foreChine
        applyOffsets(this.boat, this.boat.foreChine, 'foreChine');
        const y3 = Math.abs(this.boat.foreBeam.end[1] - this.boat.foreChine.end[1]) + 20;
        const x3 = Math.abs(this.boat.foreBeam.end[2] - this.boat.foreChine.end[2]) + 15;
        const ecy3 = Math.abs(this.boat.foreChine.endControl[0]) + y3;
        const ecx3 = Math.abs(this.boat.foreChine.endControl[2]) + x3;
        const y4 = Math.abs(this.boat.foreChine.end[0] - this.boat.foreChine.start[0]) + y3;
        const x4 = Math.abs(this.boat.foreChine.end[2] - this.boat.foreChine.start[2]) + x3;
        const scy3 = this.boat.foreChine.startControl[0] + y4;
        const scx3 = x4 - this.boat.foreChine.startControl[2];

        // Get Coordinates for aftChine
        applyOffsets(this.boat, this.boat.aftChine, 'aftChine');
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
        applyOffsets(this.boat, this.boat.foreKeel, 'foreKeel');
        const y9 = Math.abs(this.boat.foreKeel.end[0] - this.boat.foreChine.end[0]) + y6;
        const x9 = x6 - Math.abs(this.boat.foreKeel.end[2] - this.boat.foreChine.end[2]);
        const ecy7 = y9 - this.boat.foreKeel.endControl[0];
        const ecx7 = x9 + Math.abs(this.boat.foreKeel.endControl[2]);
        const y10 = y9 + (this.boat.foreKeel.end[0] - this.boat.foreKeel.start[0]);
        const x10 = x9 + (this.boat.foreKeel.end[2] - this.boat.foreKeel.start[2]);
        const scy7 = y9 - Math.abs(this.boat.foreKeel.startControl[0]);
        const scx7 = x9 - Math.abs(this.boat.foreKeel.startControl[2]);

        // Get coordinates for aftKeel
        applyOffsets(this.boat, this.boat.aftKeel, 'aftKeel');
        const y11 = y10 + (this.boat.aftKeel.end[0] - this.boat.aftKeel.start[0]);
        const x11 = x10 + Math.abs(this.boat.aftKeel.end[2] - this.boat.aftKeel.start[2]);
        const ecy8 = y11 - this.boat.aftKeel.endControl[0];
        const ecx8 = x11 - Math.abs(this.boat.aftKeel.endControl[2]);
        const scy8 = y11 - Math.abs(this.boat.aftKeel.startControl[0]);
        const scx8 = x11 + Math.abs(this.boat.aftKeel.startControl[2]);

        // Get coordinates for aft panel
        applyOffsets(this.boat, this.boat.aftBeamEdge, 'aftBeamEdge');
        const y12 = y11 + 15;
        const x12 = 15;
        const y13 = Math.abs(this.boat.aftBeamEdge.start[2] - this.boat.aftBeamEdge.end[2]) * 2 + y12;
        const x13 = Math.abs(this.boat.aftBeamEdge.start[0] - this.boat.aftBeamEdge.end[0]) * 2 + x12;

        applyOffsets(this.boat, this.boat.aftGunEdge, 'aftGunEdge');
        const y14 = Math.abs(this.boat.aftBeamEdge.end[1] - this.boat.aftGunEdge.end[1]) + y12;
        const x14 = x12 + Math.abs(this.boat.aftBeamEdge.end[0] - this.boat.aftGunEdge.end[0]);
        const y15 = Math.abs(this.boat.aftGunEdge.start[2] - this.boat.aftGunEdge.end[2]) * 2 + y14;
        const x15 = Math.abs(this.boat.aftGunEdge.start[0] - this.boat.aftGunEdge.end[0]) * 2 + x14;

        // Get coorindates for fore panel
        applyOffsets(this.boat, this.boat.foreBeamEdge, 'foreBeamEdge');
        const y16 = y15 + 15;
        const x16 = 15;
        const y17 = Math.abs(this.boat.foreBeamEdge.start[2] - this.boat.foreBeamEdge.end[2]) * 2 + y16;
        const x17 = Math.abs(this.boat.foreBeamEdge.start[0] - this.boat.foreBeamEdge.end[0]) * 2 + x16;

        applyOffsets(this.boat, this.boat.foreGunEdge, 'foreGunEdge');
        const y18 = Math.abs(this.boat.foreBeamEdge.end[1] - this.boat.foreGunEdge.end[1]) + y16;
        const x18 = x16 + Math.abs(this.boat.foreBeamEdge.end[0] - this.boat.foreGunEdge.end[0]);
        const y19 = Math.abs(this.boat.foreGunEdge.start[2] - this.boat.foreGunEdge.end[2]) * 2 + y18;
        const x19 = Math.abs(this.boat.foreGunEdge.start[0] - this.boat.foreGunEdge.end[0]) * 2 + x18;


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

        const panel1Label = [
            {x: 15, y: y1 - 2}, {x: x2, y: y1 - 2},
        ];

        const panel1Line = [
            {x: x2 + 2, y: y1}, {x: x2 + 2, y: y4},
        ];

        const panel2Box = [
            {x: x6, y: y7}, {x: x8, y: y7},
            {x: x8, y: y10}, {x: x6, y: y10},
            {x: x6, y: y7},
        ];

        const panel2Label = [
            {x: x6, y: y7 - 2}, {x: x8, y: y7 - 2},
        ];

        const panel2Line = [
            {x: x8 + 2, y: y7}, {x: x8 + 2, y: y10},
        ];

        const beamAftEdge = [
            {x: x12, y: y12}, {x: x13, y: y13},
            {x: x15, y: y15}, {x: x14, y: y14},
            {x: x12, y: y12},
        ];

        const aftHeightLine = [
            {x: x13 + 1, y: y13}, {x: x15 + 1, y: y15},
        ];

        const aftPanel = [
            {x: x12, y: y12 - 1}, {x: x13, y: y12 - 1},
        ];

        const aftPanelTitle = [
            {x: x12, y: y12 - 5}, {x: x13 + 15, y: y12 - 5},
        ];

        const aftPanelLine = [
            {x: x14, y: y14 - 1}, {x: x15, y: y15 - 1},
        ];

        const gunForeEdge = [
            {x: x16, y: y16}, {x: x17, y: y17},
            {x: x19, y: y19}, {x: x18, y: y18},
            {x: x16, y: y16},
        ];

        const foreHeightLine = [
            {x: x17 + 1, y: y17}, {x: x19 + 1, y: y19},
        ];

        const forePanel = [
            {x: x16, y: y16 - 1}, {x: x17, y: y17 - 1},
        ];

        const forePanelLine = [
            {x: x18, y: y18 - 1}, {x: x19, y: y19 - 1},
        ];

        const forePanelTitle = [
            {x: x16, y: y16 - 5}, {x: x17 + 15, y: y17 - 5},
        ];

        // Acquire dimensions
        const panel1Length = Math.abs(15 - x2);
        const panel1Height = Math.abs(y1 - y4);
        const panel2Length = Math.abs(x6 - x8);
        const panel2Height = Math.abs(y7 - y10);
        const aftBeamLength = Math.abs(x12 - x13);
        const aftGunLength = Math.abs(x14 - x15);
        const foreBeamLength = Math.abs(x16 - x17);
        const foreGunLength = Math.abs(x18 - x19);
        const aftHeight = Number((Math.sqrt(Math.pow((Math.abs(x13 - x15)), 2) + Math.pow((Math.abs(y13 - y15)), 2))).toFixed(1));
        const foreHeight = Number((Math.sqrt(Math.pow((Math.abs(x17 - x19)), 2) + Math.pow((Math.abs(y17 - y19)), 2))).toFixed(1));

        const windowHeight = Math.abs(y1 - y19) * 30;
        const elem = $('#blueprint-container')[0];
        this.canvas = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', windowHeight / 2);


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

        // Create dimensional boxes
        this.canvas.append('path')
            .attr('d', lineFunction(panel1Box))
            .attr('stroke', 'blue')
            .attr('stroke-width', 1)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunction(panel2Box))
            .attr('stroke', 'blue')
            .attr('stroke-width', 1)
            .attr('fill', 'none');

        // Create invisible lines for text
        this.canvas.append('path')
            .attr('id', 'Panel1')
            .attr('d', lineFunction(panel1Label))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'Panel1Line')
            .attr('d', lineFunction(panel1Line))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'Panel2')
            .attr('d', lineFunction(panel2Label))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'Panel2Line')
            .attr('d', lineFunction(panel2Line))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'aftPanelTitle')
            .attr('d', lineFunction(aftPanelTitle))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'aftPanel')
            .attr('d', lineFunction(aftPanel))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'aftHeight')
            .attr('d', lineFunction(aftHeightLine))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'aftPanelLine')
            .attr('d', lineFunction(aftPanelLine))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'forePanelTitle')
            .attr('d', lineFunction(forePanelTitle))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'forePanel')
            .attr('d', lineFunction(forePanel))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'foreHeight')
            .attr('d', lineFunction(foreHeightLine))
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('id', 'forePanelLine')
            .attr('d', lineFunction(forePanelLine))
            .attr('fill', 'none');

        // Insert text
        this.canvas.append('text')
            .append('textPath')
            .attr('xlink:href', '#Panel1')
            .text('Port/Starboard panels');
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#Panel1')
            .text(panel1Length);
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#Panel1Line')
            .text(panel1Height);
        this.canvas.append('text')
            .append('textPath')
            .attr('xlink:href', '#Panel2')
            .text('Keel Panels');
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#Panel2')
            .text(panel2Length);
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#Panel2Line')
            .text(panel2Height);
        this.canvas.append('text')
            .append('textPath')
            .attr('xlink:href', '#aftPanelTitle')
            .text('Aft Panel');
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#aftPanel')
            .text(aftBeamLength);
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '40%')
            .attr('xlink:href', '#aftHeight')
            .text(aftHeight);
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#aftPanelLine')
            .text(aftGunLength);
        this.canvas.append('text')
            .append('textPath')
            .attr('xlink:href', '#forePanelTitle')
            .text('Fore Panel');
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#forePanel')
            .text(foreBeamLength);
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '40%')
            .attr('xlink:href', '#foreHeight')
            .text(foreHeight);
        this.canvas.append('text')
            .append('textPath')
            .attr('startOffset', '50%')
            .attr('xlink:href', '#forePanelLine')
            .text(foreGunLength);

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
        this.canvas.append('path')
            .attr('d', lineFunction(beamAftEdge))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunction(gunForeEdge))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none')
            .attr('id', 'gunForeEdge');
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
