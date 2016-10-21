import Evolver from './evolver'
import {drawPolySet} from './render'
import {getTimeStamp} from './utils'

let startMillis = null,
    totMillis,
    ctxDisplay,
    evolver;

export function eCreate(state) {

    ctxDisplay = document.getElementById('canvas-display').getContext('2d', {alpha: false});

    evolver = new Evolver(state.inputImage, state.canvasWidth, state.canvasHeight, 0,
        10,
        '24-bit', true, true, 0.75,
        state.stepsBeforeHeuristics, 1, ctxDisplay
    );

    totMillis = 0;
    startMillis = null;

}

export function eStep(state) {
    if (startMillis === null) {
        startMillis = getTimeStamp();
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
