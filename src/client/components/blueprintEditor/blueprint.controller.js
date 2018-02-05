// Global imports
import * as d3 from 'd3';
// Component imports
import template from './blueprint.template.html';
import './blueprint.style.scss';


const sidePanel = [
    {x: 1, y: 5}, {x: 20, y: 20},
    {x: 40, y: 10}, {x: 60, y: 40},
    {x: 80, y: 5}, {x: 100, y: 60},
];

class BlueprintEditor extends HTMLElement {
    constructor() {
        super();
        console.log('constructing blueprint editor');
    }

    createdCallback() {
        this.innerHTML = template;
        const elem = $('#blueprint-container')[0];
        this.svgContainer = d3.select('blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', '600');

        const lineFunction = d3.line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .curve(d3.curveBasis);
        const graph = this.svgContainer.append('path')
            .attr('d', lineFunction(sidePanel))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none')

    }
}

document.registerElement('blueprint-container', BlueprintEditor);
