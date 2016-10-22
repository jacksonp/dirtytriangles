import {connect} from 'react-redux'
import {
    setInputImage,
    evolutionChangeState,
    changeMaxPolygons,
    changeNumVertices,
    changePolygonSize,
    changeScale
} from '../actions'
import Evolve from '../components/Evolve/'

const mapStateToProps = (state) => {
    return {
        inputImage: state.inputImage,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight,
        scale: state.scale,
        evolutionState: state.evolutionState,
        maxPolygons: state.maxPolygons,
        minVertices: state.minVertices,
        maxVertices: state.maxVertices,
        minPolygonSize: state.minPolygonSize,
        maxPolygonSize: state.maxPolygonSize,
        secondsRun: state.secondsRun,
        numSteps: state.numSteps,
        numPolygons: state.numPolygons
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
        },
        onPolygonSizeChange: (polygonSize) => {
            dispatch(changePolygonSize(polygonSize))
        },
        onScaleChange: (scale) => {
            dispatch(changeScale(scale))
        },
        getSVG: (scale) => {
            dispatch(changeScale(scale))
        }
    }
};

const Main = connect(
    mapStateToProps,
    mapDispatchToProps
)(Evolve);

export default Main

