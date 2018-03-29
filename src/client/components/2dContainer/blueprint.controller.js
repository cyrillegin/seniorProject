// Global imports
import * as d3 from 'd3';

const sidePanel = [
    {x: 1, y: 1}, {x: 500, y: 1},
    {x: 500, y: 1}, {x: 500, y: 20},
    {x: 250, y: 150}, {x: 1, y: 170},
    {x: 1, y: 170}, {x: 1, y: 1},
];

const aftBeam = [
    {x: 1, y: 11}, {x: 6, y: 1},
    {x: 20, y: 1}, {x: -8, y: 1}, {x: 5, y: 0},
    
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
        
         iterate through json file keys 
         Object.keys(data).forEach((key) => {
             if (i !== 'width') {
                const curve = getCoords(i);
            }
         });
        */
        const elem = $('#blueprint-container')[0];	
        this.svgContainer = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', 600);
        
        const lineFunction = d3.line()
            .x((d) => d.x)
            .y((d) => d.y)
            .curve(d3.curveLinear);
            
        const lineFunc = d3.line()
            .x((d) => d.x)
            .y((d) => d.y)
            .curve(d3.curveBasis);
            
        this.svgContainer.append('path')
            .attr('d', lineFunction(aftBeam))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
        this.svgContainer.append('path')
            .attr('d', lineFunc(aftBeam))
            .attr('stroke', 'red')
            .attr('stroke-width', 2)
            .attr('fill', 'none');
    }
}
