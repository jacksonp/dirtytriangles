import React, {PropTypes} from 'react';

const Evolve = ({inputImage, canvasWidth, canvasHeight, evolutionState, onInputImageChange, onPlay, onPause}) => (
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
        </div>
    </div>
);

Evolve.propTypes = {
    inputImage: PropTypes.instanceOf(HTMLImageElement),
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number,
    evolutionState: PropTypes.string,
    onInputImageChange: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired
};

export default Evolve;
