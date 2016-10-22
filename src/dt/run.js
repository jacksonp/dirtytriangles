import Evolver from './evolver'
import {drawPolySet} from './render'
import {getTimeStamp} from './utils'

let startMillis = null,
    totMillis,
    ctxDisplay,
    evolver;

function calculateScale(sliderScale) {
    return Math.pow(2, (4 - sliderScale));
}

export function eCreate(state) {

    ctxDisplay = document.getElementById('canvas-display').getContext('2d', {alpha: false});

    const scale = calculateScale(state.scale);

    evolver = new Evolver(state.inputImage, state.canvasWidth / scale, state.canvasHeight / scale, 0,
        '24-bit', true, true, 0.75,
        state.stepsBeforeHeuristics, scale, ctxDisplay
    );
    totMillis = 0;
    startMillis = null;

}

export function eStep(state) {

    if (startMillis === null) {
        startMillis = getTimeStamp();
    }

    const scale = calculateScale(state.scale);

    if (scale !== evolver.scale) {
        evolver.updateScale(scale);
    }

    return evolver.step(state);
}

export function eDraw() {
    drawPolySet(ctxDisplay, evolver.polySetBest, evolver.imgWidth, evolver.imgHeight, evolver.scale);
    return {
        secondsRun: (totMillis + getTimeStamp() - startMillis) / 1000,
        numSteps: evolver.stats.numSteps,
        numPolygons: evolver.polySetBest.length
    }
}

export function ePause() {
    totMillis += getTimeStamp() - startMillis;
    startMillis = null;
}

export function eSVG() {
    let svgStr = '<?xml version="1.0" encoding="utf-8"?>';
    svgStr += '<!-- Made with dirtytriangles.com -->';
    svgStr += '<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">';
    svgStr += '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" xmlns:ev="http://www.w3.org/2001/xml-events" version="1.1" baseProfile="full" width="' + evolver.imgWidth + 'px" height="' + evolver.imgHeight + 'px">';

    evolver.polySetBest.forEach(function (poly) {
        svgStr += '<polygon points="';
        for (let j = 0; j < poly.coords.length; j += 2) {
            svgStr += poly.coords[j] + ' ' + poly.coords[j + 1] + ' ';
        }
        svgStr += '" fill="rgb(';
        svgStr += poly.colour.r + ',';
        svgStr += poly.colour.g + ',';
        svgStr += poly.colour.b + ')" opacity="';
        svgStr += poly.colour.a + '" />';
    });
    svgStr += '<\/svg>';

    return svgStr;

}
