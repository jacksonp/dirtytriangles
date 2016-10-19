import {SET_INPUT_IMAGE} from './types'
import start from '../dt/run'

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
                    start(getState());
                }

            }
        };
        reader.readAsDataURL(e.target.files[0]);

    }

}
