import Evolver from './evolver'
import {drawPolySet} from './render'

let
    ctxDisplay,
    evolver;

export function eCreate(state) {

    ctxDisplay = document.getElementById('canvas-display').getContext('2d', {alpha: false});

    evolver = new Evolver(state.inputImage, state.canvasWidth, state.canvasHeight, 0,
        10,
        100, 100,
        3, 3,
        '24-bit', true, true, 0.75,
        20000, 'randomFn', 1, ctxDisplay
    );

    evolver.iniRandomPolySet();

}

export function eStep() {
    return evolver.step();
}

export function eDraw() {
    drawPolySet(ctxDisplay, evolver.polySetBest, evolver.imgWidth, evolver.imgHeight, evolver.scale);
}
