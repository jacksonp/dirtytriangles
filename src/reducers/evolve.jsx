import {
    SET_INPUT_IMAGE,
    EVOLUTION_STATE,
    CHANGE_MAX_POLYGONS,
    CHANGE_NUM_VERTICES,
    CHANGE_POLYGON_SIZE
} from '../actions/types'

const MAX_CANVAS_DIMENSION = 512;

const initialState = {
    inputImage: null,
    canvasWidth: null,
    canvasHeight: null,
    evolutionState: 'EVOLUTION_PAUSE',
    maxPolygons: 100,
    minVertices: 3,
    maxVertices: 4,
    minPolygonSize: 5,
    maxPolygonSize: 20,
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
        case CHANGE_MAX_POLYGONS:
            return Object.assign({}, state, {
                maxPolygons: action.maxPolygons
            });
        case CHANGE_NUM_VERTICES:
            return Object.assign({}, state, {
                minVertices: action.minVertices,
                maxVertices: action.maxVertices
            });
        case CHANGE_POLYGON_SIZE:
            return Object.assign({}, state, {
                minPolygonSize: action.minPolygonSize,
                maxPolygonSize: action.maxPolygonSize
            });
        default:
            return state
    }
};

export default evolve;
