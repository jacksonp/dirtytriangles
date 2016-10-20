import {connect} from 'react-redux'
import {setInputImage} from '../actions'
import Welcome from '../components/Welcome'

const mapStateToProps = (state) => {
    return {
        inputImage: state.inputImage,
        canvasWidth: state.canvasWidth,
        canvasHeight: state.canvasHeight
    }
};

const mapDispatchToProps = (dispatch) => {
    return {
        onInputImageChange: (e) => {
            dispatch(setInputImage(e))
        }
    }
};

const Main = connect(
    mapStateToProps,
    mapDispatchToProps
)(Welcome);

export default Main

