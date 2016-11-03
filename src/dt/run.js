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
        '24-bit', true, true,
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
    const s = evolver.scale;
    return `<?xml version="1.0" encoding="utf-8"?>
<!-- Made with dirtytriangles.com -->
<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" width="${evolver.imgWidth * s}px" height="${evolver.imgHeight * s}px">
${evolver.polySetBest.map(function (poly) {
        return `<polygon points="${poly.coords.map(function (c) {
            return c * s
        }).join(' ')}" fill="rgb(${poly.colour.r},${poly.colour.g},${poly.colour.b})" opacity="${poly.colour.a}"/>`;
    }).join()}</svg>`;
}
