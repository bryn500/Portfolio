import { Texture } from 'three';
import { select } from 'd3-selection';
import { geoPath, geoEquirectangular } from 'd3-geo';

var projection = geoEquirectangular()
    .translate([1024, 512])
    .scale(325);

export function getCountriesTexture(geojson, color) {
    let texture, context, canvas;

    canvas = select('body').append('canvas')
        .style('display', 'none')
        .attr('width', '2048px')
        .attr('height', '1024px');

    context = canvas.node().getContext('2d');

    var mappedPath = geoPath()
        .projection(projection)
        .context(context);

    context.strokeStyle = '#333';
    context.lineWidth = 1;
    context.fillStyle = color || '#cccccc'; //'rgba(0,0,0,.2)';

    context.beginPath();

    mappedPath(geojson);

    if (color) {
        context.fill();
    }

    context.stroke();

    texture = new Texture(canvas.node());
    texture.needsUpdate = true;

    canvas.remove();
    canvas = null;

    return texture;
}
