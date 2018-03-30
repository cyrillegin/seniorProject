// Global imports
import * as d3 from 'd3';
/* Original sidepanl coordinates
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

const prow = [
    {x: 10, y: 10}, {x: 14, y: 15},
];

const stern = [
    {x: 60, y: 10}, {x: 61, y: 15},
];

export default class BlueprintEditor {
    constructor($scope, $timeout, boatParametersService) {
        this.$scope = $scope;
        this.$timeout = $timeout;
        this.boatParametersService = boatParametersService;
    }

    $onInit() {
        this.$timeout(() => {
            const data = this.boatParametersService.getBoat();
            console.log(data);
        });

        const elem = $('#blueprint-container')[0];
        this.canvas = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', 800)
            .attr('height', 600);

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

        // Create the fore and aft Beam curves (simplified for now)
        this.canvas.append('path')
            .attr('d', lineFunction(aftForeBeam))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunc(aftForeBeam))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Create the for and aft Chine curves (simplified for now)
        this.canvas.append('path')
            .attr('d', lineFunction(aftForeChine))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunc(aftForeChine))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

        // Connect the Beam and Chine curves
        this.canvas.append('path')
            .attr('d', lineFunction(prow))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.canvas.append('path')
            .attr('d', lineFunction(stern))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }
}
