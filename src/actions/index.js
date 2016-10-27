import {
    SET_INPUT_IMAGE,
    EVOLUTION_STATE,
    CHANGE_MAX_POLYGONS,
    CHANGE_NUM_VERTICES,
    CHANGE_POLYGON_SIZE,
    CHANGE_SCALE,
    EVOLUTION_REDRAW
} from './types'
import {eCreate, eStep, eDraw, ePause} from '../dt/run'

const STEPS_PER_INTERVAL = 10; // 100

let evolveIntervalId = null;

export function loadInputImage(inputImage) {
    return {
        type: SET_INPUT_IMAGE,
        inputImage: inputImage
    }
}

export function setImageSrc(src) {
    return function (dispatch, getState) {
        // could dispatch something to say file load started.

        const inputImage = new Image();
        inputImage.src = src;
        inputImage.onload = function () {

            if (inputImage.width === 0) {
                alert('Image could not be loaded.');
            } else {
                dispatch(loadInputImage(inputImage));
                eCreate(getState());
                dispatch(evolutionChangeState('EVOLUTION_GO'));
            }

        }

    }
}

export function setInputImage(e) {
    return function (dispatch) {
        // could dispatch something to say file load started.
        const reader = new FileReader();
        reader.onload = function (event) {
            dispatch(setImageSrc(event.target.result));
        };
        reader.readAsDataURL(e.target.files[0]);
    }
}

export function evolutionSetState(evolutionState) {
    return {
        type: EVOLUTION_STATE,
        evolutionState: evolutionState
    }
}

export function evolutionRedraw({secondsRun, numSteps, numPolygons, stepsPerSec}) {
    return {
        type: EVOLUTION_REDRAW,
        secondsRun: secondsRun,
        numSteps: numSteps,
        numPolygons: numPolygons,
        stepsPerSec: stepsPerSec
    }
}

export function evolutionChangeState(evolutionState) {

    let
        lastStatsUpdate = performance.now(),
        stepsSinceLastStatsUpdate = 0;

    return function (dispatch, getState) {

        switch (evolutionState) {
            case 'EVOLUTION_PAUSE':
                if (evolveIntervalId) {
                    ePause();
                    clearInterval(evolveIntervalId);
                    evolveIntervalId = null;
                }
                break;
            case 'EVOLUTION_GO':
                if (!evolveIntervalId) {
                    const step = function () {
                        const
                            state = getState(),
                            now = performance.now(),
                            doSteps = STEPS_PER_INTERVAL * Math.pow(2, (4 - state.scale));
                        let stepsPerSec = null;

                        if (now - lastStatsUpdate > 500) { // update stats twice per second
                            stepsPerSec = Math.round(1000 * stepsSinceLastStatsUpdate / (now - lastStatsUpdate));
                            lastStatsUpdate = now;
                            stepsSinceLastStatsUpdate = 0;
                        }

                        for (let i = 0; i < doSteps; i++) {
                            if (eStep(state) === 0) { // Perfect fitness, say a blank canvas.
                                evolutionChangeState('EVOLUTION_PAUSE');
                            }
                        }

                        stepsSinceLastStatsUpdate += doSteps;

                        const newStats = eDraw();
                        if (stepsPerSec !== null) {
                            newStats.stepsPerSec = stepsPerSec;
                            dispatch(evolutionRedraw(newStats));
                        }
                    };
                    // 0 means go as fast as you can, could be limited to ~4ms intervals
                    evolveIntervalId = setInterval(step, 0);
                }
                break;
            default:
                throw 'Unexpected evolutionState';
        }

        dispatch(evolutionSetState(evolutionState));

    }
}

export function changeMaxPolygons(maxPolygons) {
    return {
        type: CHANGE_MAX_POLYGONS,
        maxPolygons: maxPolygons
    }
}

export function changeNumVertices([minVertices, maxVertices]) {
    return {
        type: CHANGE_NUM_VERTICES,
        minVertices: minVertices,
        maxVertices: maxVertices,
    }
}

export function changePolygonSize([minPolygonSize, maxPolygonSize]) {
    return {
        type: CHANGE_POLYGON_SIZE,
        minPolygonSize: minPolygonSize,
        maxPolygonSize: maxPolygonSize,
    }
}

export function changeScale(scale) {
    return {
        type: CHANGE_SCALE,
        scale: scale
    }
}
