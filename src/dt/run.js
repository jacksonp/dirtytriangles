import Evolver from './evolver'
import {drawPolySet} from './render'

let
    ctxDisplay,
    evolver;

export function eCreate(state) {

    ctxDisplay = document.getElementById('canvas-display').getContext('2d', {alpha: false});

    evolver = new Evolver(state.inputImage, state.canvasWidth, state.canvasHeight, 0,
        10,
        0, 100,
        '24-bit', true, true, 0.75,
        state.stepsBeforeHeuristics, 1, ctxDisplay
    );

    evolver.iniRandomPolySet(state);

}

export function eStep(state) {
    return evolver.step(state);
}

export function eDraw() {
    drawPolySet(ctxDisplay, evolver.polySetBest, evolver.imgWidth, evolver.imgHeight, evolver.scale);
}
