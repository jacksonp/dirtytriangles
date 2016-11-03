import {connect} from 'react-redux'
import {
    setInputImage,
    evolutionChangeState,
    changeMaxPolygons,
    changeNumVertices,
    changePolygonSize,
    changeScale,
    changeMutationType,
    changeCullQualityThreshold
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
        mutateFn: state.mutateFn,
        secondsRun: state.secondsRun,
        numSteps: state.numSteps,
        numPolygons: state.numPolygons,
        stepsPerSec: state.stepsPerSec,
        cullQualityThreshold: state.cullQualityThreshold
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
        onMutationTypeChange: (event) => {
            dispatch(changeMutationType(event.target.value))
        },
        onCullQualityThresholdChange: (cullQualityThreshold) => {
            dispatch(changeCullQualityThreshold(cullQualityThreshold))
        }
    }
};

const Main = connect(
    mapStateToProps,
    mapDispatchToProps
)(Evolve);

export default Main

