// Global imports
import * as d3 from 'd3';
// Component imports
import template from './blueprint.template.html';
import './blueprint.style.scss';


const sidePanel = [
    {x: 1, y: 1}, {x: 500, y: 1},
    {x: 500, y: 1}, {x: 500, y: 20},
    {x: 250, y: 150}, {x: 1, y: 170},
    {x: 1, y: 170}, {x: 1, y: 1},
];

class BlueprintEditor extends HTMLElement {
    constructor() {
        super();
        console.log('constructing blueprint editor');
    }

    createdCallback() {
        this.innerHTML = template;
        const elem = $('#blueprint-container')[0];
        this.svgContainer = d3.select('#blueprint-container')
            .append('svg')
            .attr('width', elem.clientWidth)
            .attr('height', '600');

        const lineFunction = d3.line()
            .x((d) => d.x)
            .y((d) => d.y)
            .curve(d3.curveBasis);
        this.svgContainer.append('path')
            .attr('d', lineFunction(sidePanel))
            .attr('stroke', 'blue')
            .attr('stroke-width', 2)
            .attr('fill', 'none');

    }
}

document.registerElement('blueprint-container', BlueprintEditor);
