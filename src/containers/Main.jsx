import {connect} from 'react-redux'
import {setInputImage, evolutionChangeState, changeMaxPolygons, changeNumVertices} from '../actions'
import Evolve from '../components/Evolve'

const mapStateToProps = (state) => {
    return {
        inputImage: state.inputImage,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight,
        evolutionState: state.evolutionState,
        maxPolygons: state.maxPolygons,
        minVertices: state.minVertices,
        maxVertices: state.maxVertices,
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
        },
        onMaxPolygonsChange: (maxPolygons) => {
            dispatch(changeMaxPolygons(maxPolygons))
        },
        onNumVerticesChange: (numVertices) => {
            dispatch(changeNumVertices(numVertices))
        }
    }
};

const Main = connect(
    mapStateToProps,
    mapDispatchToProps
)(Evolve);

export default Main

