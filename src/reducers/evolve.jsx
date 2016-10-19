import {SET_INPUT_IMAGE} from '../actions/types'

const evolve = (state = {}, action) => {
    switch (action.type) {
        case SET_INPUT_IMAGE:
            return Object.assign({}, state, {
                inputImage: action.inputImage
            });
        default:
            return state
    }
};

export default evolve;
