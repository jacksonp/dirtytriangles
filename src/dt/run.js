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
