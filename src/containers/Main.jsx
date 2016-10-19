import {connect} from 'react-redux'
import {setInputImage} from '../actions'
import Welcome from '../components/Welcome'

const mapStateToProps = (state) => {
    return {
        inputImage: state.inputImage
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

