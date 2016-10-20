import {SET_INPUT_IMAGE, EVOLUTION_STATE} from './types'
import {eCreate, eStep, eDraw} from '../dt/run'

const STEPS_PER_INTERVAL = 5; // 100

let evolveIntervalId = null;

export function loadInputImage(inputImage) {
    return {
        type: SET_INPUT_IMAGE,
        inputImage: inputImage
    }
}

export function setInputImage(e) {

    return function (dispatch, getState) {
        // could dispatch something to say file load started.

        const reader = new FileReader();
        reader.onload = function (event) {
            const inputImage = new Image();
            inputImage.src = event.target.result;
            inputImage.onload = function () {

                if (inputImage.width === 0) {
                    alert('Image could not be loaded.');
                } else {
                    dispatch(loadInputImage(inputImage));
                    eCreate(getState());
                    dispatch(evolutionChangeState('EVOLUTION_GO'));
                }

            }
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

export function evolutionChangeState(evolutionState) {

    return function (dispatch, getState) {

        switch (evolutionState) {
            case 'EVOLUTION_PAUSE':
                if (evolveIntervalId) {
                    clearInterval(evolveIntervalId);
                    evolveIntervalId = null;
                }
                break;
            case 'EVOLUTION_GO':
                if (!evolveIntervalId) {
                    const step = function () {
                        const state = getState();
                        for (let i = 0; i < STEPS_PER_INTERVAL; i++) {
                            if (eStep() === 0) { // Perfect fitness, say a blank canvas.
                                evolutionChangeState('EVOLUTION_PAUSE');
                            }
                        }
                        eDraw();
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
