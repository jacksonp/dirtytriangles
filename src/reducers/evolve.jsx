import {SET_INPUT_IMAGE, EVOLUTION_STATE, CHANGE_NUM_VERTICES} from '../actions/types'

const MAX_CANVAS_DIMENSION = 512;

const initialState = {
    inputImage: null,
    canvasWidth: null,
    canvasHeight: null,
    evolutionState: 'EVOLUTION_PAUSE',
    minVertices: 3,
    maxVertices: 4,
    mutateFn: 'randomFn',
    stepsBeforeHeuristics: 20000
};

const evolve = (state = initialState, action) => {
    switch (action.type) {
        case SET_INPUT_IMAGE:
            let
                width = action.inputImage.width,
                height = action.inputImage.height;

            if (width > height) {
                if (width > MAX_CANVAS_DIMENSION) {
                    height = Math.round(height * MAX_CANVAS_DIMENSION / width);
                    width = MAX_CANVAS_DIMENSION;
                }
            } else {
                if (height > MAX_CANVAS_DIMENSION) {
                    width = Math.round(width * MAX_CANVAS_DIMENSION / height);
                    height = MAX_CANVAS_DIMENSION;
                }
            }
            return Object.assign({}, state, {
                inputImage: action.inputImage,
                canvasWidth: width,
                canvasHeight: height
            });
        case EVOLUTION_STATE:
            return Object.assign({}, state, {
                evolutionState: action.evolutionState
            });
        case CHANGE_NUM_VERTICES:
            return Object.assign({}, state, {
                minVertices: action.minVertices,
                maxVertices: action.maxVertices,
            });
        default:
            return state
    }
};

export default evolve;
