require('rc-slider/assets/index.css');

import React, {PropTypes} from 'react';
import Rcslider from 'rc-slider'

const MIN_VERTICES = 3;
const MAX_VERTICES = 15;

const Evolve = ({inputImage, canvasWidth, canvasHeight, evolutionState, minVertices, maxVertices, onInputImageChange, onPlay, onPause, onNumVerticesChange}) => (
    <div>
        <h3>Start a New Image</h3>
        <p>
            Select an image
            <input type="file" accept="image/*" onChange={onInputImageChange}/>
        </p>

        <div>
            <img src={'/img/play-' + evolutionState + '.png'} alt="play" onClick={onPlay}/>
            <img src={'/img/pause-' + evolutionState + '.png'} alt="pause" onClick={onPause}/>
        </div>
        <div>
            { inputImage ? <canvas id="canvas-display" width={canvasWidth} height={canvasHeight}/> : null }
        </div>
        <div>
            <h2>Stats</h2>
            Steps/sec:
            <h2>Configuration</h2>
            <Rcslider range={true} defaultValue={[minVertices, maxVertices]} min={MIN_VERTICES} max={MAX_VERTICES}
                      onChange={onNumVerticesChange}/>
        </div>
    </div>
);

Evolve.propTypes = {
    inputImage: PropTypes.instanceOf(HTMLImageElement),
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number,
    evolutionState: PropTypes.string.isRequired,
    onInputImageChange: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onNumVerticesChange: PropTypes.func.isRequired,
};

export default Evolve;
