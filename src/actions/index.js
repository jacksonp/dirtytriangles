import {SET_INPUT_IMAGE, EVOLUTION_STATE} from './types'
import {eCreate, eStep} from '../dt/run'

let evolveIntervalId;

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
                    dispatch(evolutionRun());
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

export function evolutionRun() {

    return function (dispatch, getState) {

        dispatch(evolutionSetState('EVOLUTION_GO'));

        const step = function () {
            const state = getState();
            if (eStep(state) === 0) { // Perfect fitness, say a blank canvas.
                clearInterval(evolveIntervalId);
                dispatch(evolutionSetState('EVOLUTION_DONE'));

            }
        };

        evolveIntervalId = setInterval(step, 0); // 0 means go as fast as you can, could be limited to ~4ms intervals

        // start(getState());

    }
}
