import React, {PropTypes} from 'react';

const Canvas = ({canvasWidth, canvasHeight}) => (
    <div>
        <div>
            <img src="/img/play-active.png" alt="play"/>
            <img src="/img/pause.png" alt="pause"/>
        </div>
        <div>
            <canvas id="canvas-display" width={canvasWidth} height={canvasHeight}/>
        </div>
        <div>
            <h2>Stats</h2>
            Steps/sec:
            <h2>Configuration</h2>
        </div>
    </div>
);

Canvas.propTypes = {
    canvasWidth: PropTypes.number.isRequired,
    canvasHeight: PropTypes.number.isRequired
};

export default Canvas
