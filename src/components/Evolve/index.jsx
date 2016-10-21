require('rc-slider/assets/index.css');
require('./index.css');

import React, {PropTypes} from 'react';
import Rcslider from 'rc-slider'
import About from '../About/';

const MIN_POLYGONS = 10;
const MAX_POLYGONS = 500;

const MIN_VERTICES = 3;
const MAX_VERTICES = 15;

const MIN_POLYGON_SIZE = 5;
const MAX_POLYGON_SIZE = 100;

const Evolve = ({
    inputImage,
    canvasWidth, canvasHeight, evolutionState,
    maxPolygons, minVertices, maxVertices, minPolygonSize, maxPolygonSize, secondsRun, numSteps, numPolygons,
    onInputImageChange, onPlay, onPause, onMaxPolygonsChange, onNumVerticesChange, onPolygonSizeChange
}) => (
    <div id="dt-dash">
        <div className="left-col">
            <About/>
        </div>
        <div className="canvasContainer">
            { inputImage ? <canvas id="canvas-display" width={canvasWidth} height={canvasHeight}/> : null }
        </div>
        <div className="right-col">
            <h2>Controls</h2>
            <div>
                <span className={'play ' + evolutionState} onClick={onPlay}>▶️</span> <span
                className={'pause ' + evolutionState} onClick={onPause}>⏸</span>
            </div>
            <p>Max Polygon Count</p>
            <Rcslider defaultValue={maxPolygons} step={10} min={MIN_POLYGONS} max={MAX_POLYGONS}
                      onChange={onMaxPolygonsChange}/>
            <p>Polygon Vertices</p>
            <Rcslider range={true} defaultValue={[minVertices, maxVertices]} min={MIN_VERTICES} max={MAX_VERTICES}
                      onChange={onNumVerticesChange}/>
            <p>Polygon Size %</p>
            <Rcslider range={true} defaultValue={[minPolygonSize, maxPolygonSize]} min={MIN_POLYGON_SIZE}
                      max={MAX_POLYGON_SIZE} onChange={onPolygonSizeChange}/>
            <p>
                <label className="input-target-file">
                    Set target image <input type="file" accept="image/*" onChange={onInputImageChange}/>
                </label>
            </p>
            Steps/sec: {secondsRun ? Math.round(numSteps / secondsRun) : 0}<br/>
            Polygons: {numPolygons}
        </div>
    </div>
);

Evolve.propTypes = {
    inputImage: PropTypes.instanceOf(HTMLImageElement),
    canvasWidth: PropTypes.number,
    canvasHeight: PropTypes.number,
    evolutionState: PropTypes.string.isRequired,
    secondsRun: PropTypes.number,
    numSteps: PropTypes.number,
    numPolygons: PropTypes.number,
    onInputImageChange: PropTypes.func.isRequired,
    onPlay: PropTypes.func.isRequired,
    onPause: PropTypes.func.isRequired,
    onMaxPolygonsChange: PropTypes.func.isRequired,
    onNumVerticesChange: PropTypes.func.isRequired,
    onPolygonSizeChange: PropTypes.func.isRequired,
};

export default Evolve;
