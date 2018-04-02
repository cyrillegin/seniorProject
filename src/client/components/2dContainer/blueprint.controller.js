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
const aftForeBeam = [
    {x: 10, y: 10}, {x: 15, y: 9},
    {x: 30, y: 7.5}, {x: 40, y: 7.5},
    {x: 55, y: 9}, {x: 60, y: 10},
];

const aftForeChine = [
    {x: 14, y: 15}, {x: 19, y: 16},
    {x: 30, y: 17.5}, {x: 40, y: 17.5},
    {x: 55, y: 16}, {x: 61, y: 15},
];

const bowCon = [
    {x: 10, y: 10}, {x: 14, y: 15},
];

const sternCon = [
    {x: 60, y: 10}, {x: 61, y: 15},
];

const aftForeChine2 = [
    {x: 10, y: 26.5}, {x: 15, y: 24},
    {x: 23, y: 22.5}, {x: 39, y: 22.5},
    {x: 52, y: 24}, {x: 57, y: 26},
];

const lowBow = [
    {x: 10, y: 26.5}, {x: 10, y: 28},
];

const lowStern = [
    {x: 57, y: 26}, {x: 57, y: 28},
];

const keel = [
    {x: 10, y: 28}, {x: 57, y: 28},
];

const stern = [
    {x: 10, y: 33}, {x: 20, y: 33},
    {x: 18, y: 39}, {x: 12, y: 39},
    {x: 10, y: 33},
];

const bow = [
    {x: 25, y: 33}, {x: 31, y: 33},
    {x: 30, y: 39}, {x: 26, y: 39},
    {x: 25, y: 33},
];

const frame0 = [
    {x: 36, y: 33}, {x: 38, y: 39},
    {x: 52, y: 39}, {x: 54, y: 33},
];

const box0 = [
    {x: 10, y: 7.5}, {x: 61, y: 7.5},
    {x: 61, y: 17.5}, {x: 10, y: 17.5},
    {x: 10, y: 7.5},
];

const box1 = [
    {x: 10, y: 22.5}, {x: 57, y: 22.5},
    {x: 57, y: 28}, {x: 10, y: 28},
    {x: 10, y: 22.5},
];

export default class BlueprintEditor {
    constructor($scope, $timeout, boatParametersService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
    }

    $onInit() {
        this.$timeout(() => {
            // const data = this.boatParametersService.getBoat();
            // console.log(data);
        });

        const elem = $('#blueprint-container')[0];
        this.canvas = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', 900);

        // Scale for svg window sizing
        const scale = 0.015;

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

        // Creae dimensional boxes around panels
        this.canvas.append('path')
            .attr('d', lineFunction(box0))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunction(box1))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create the fore and aft Beam curves (simplified for now)
        this.canvas.append('path')
            .attr('d', lineFunc(aftForeBeam))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create the for and aft Chine curves (simplified for now)
        this.canvas.append('path')
            .attr('d', lineFunc(aftForeChine))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Connect the Beam and Chine curves
        this.canvas.append('path')
	          .attr('d', lineFunction(bowCon))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunction(sternCon))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create aft fore chine curve for bottom panel
        this.canvas.append('path')
            .attr('d', lineFunc(aftForeChine2))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Connect bow and stern points
        this.canvas.append('path')
            .attr('d', lineFunction(lowBow))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunction(lowStern))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create keel line
        this.canvas.append('path')
            .attr('d', lineFunction(keel))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create Stern panel
        this.canvas.append('path')
            .attr('d', lineFunction(stern))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create bow panel
        this.canvas.append('path')
            .attr('d', lineFunction(bow))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create inner frame
        this.canvas.append('path')
            .attr('d', lineFunction(frame0))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }
}
