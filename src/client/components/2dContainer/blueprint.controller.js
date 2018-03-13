// Global imports
import * as d3 from 'd3';

const sidePanel = [
    {x: 1, y: 1}, {x: 500, y: 1},
    {x: 500, y: 1}, {x: 500, y: 20},
    {x: 250, y: 150}, {x: 1, y: 170},
    {x: 1, y: 170}, {x: 1, y: 1},
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
        })
        /*index of key
        data['aftBeam']
        data.aftBeam.start
        */
	const elem = $('#blueprint-container')[0];	
        this.svgContainer = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', '200');
        //iterate through json file keys 
         Object.keys(data).forEach((key) => {
             if (i !== "width) {
                const curve = getCoords(i);
             
        }
         })
        const lineFunction = d3.line()
            .data.aftBeam.start[0]((d) => d.x)
            .data.aftBeam.end[1]((d) => d.y)
            .curve(d3.curveBasis);
        this.svgContainer.append('path')
            .attr('d', lineFunction(curve))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }
    //function to translate 3d points to 2d 
    getCoors(3dCoord) {
        return {x: 4, y:7}
}
