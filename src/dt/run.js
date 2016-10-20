import * as rng from './rng'
import Evolver from './evolver'

let evolver;

export function eCreate(state) {

    console.log(state);

    evolver = new Evolver(state.inputImage, state.canvasWidth, state.canvasHeight, 0,
        10,
        100, 100,
        3, 3,
        '24-bit', true, true, 0.75,
        20000, 'randomFn', 1, document.getElementById('canvas-display').getContext('2d', {alpha: false})
    );

    evolver.iniRandomPolySet();

}

export function eStep(state) {

    // console.log(state);

    evolver.step();

    return 1;

}
