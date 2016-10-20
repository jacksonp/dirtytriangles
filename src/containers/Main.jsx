import {connect} from 'react-redux'
import {setInputImage, evolutionChangeState} from '../actions'
import Evolve from '../components/Evolve'

const mapStateToProps = (state) => {
    return {
        inputImage: state.inputImage,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight,
        evolutionState: state.evolutionState
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onInputImageChange: (e) => {
            dispatch(setInputImage(e))
        },
        onPlay: () => {
            dispatch(evolutionChangeState('EVOLUTION_GO'))
        },
        onPause: () => {
            dispatch(evolutionChangeState('EVOLUTION_PAUSE'))
        }
    }
};

const Main = connect(
    mapStateToProps,
    mapDispatchToProps
)(Evolve);

export default Main

