require('rc-slider/assets/index.css');
require('./index.css');

import React, {PropTypes} from 'react';
import Rcslider from 'rc-slider'
import About from '../About/';
import {eSVG} from '../../dt/run'
import base64 from 'base-64'

const MIN_POLYGONS = 10;
const MAX_POLYGONS = 500;

const MIN_VERTICES = 3;
const MAX_VERTICES = 15;

const MIN_POLYGON_SIZE = 1;
const MAX_POLYGON_SIZE = 100;

export const MAX_SCALE = 4;

function getPNG(e) {
    e.target.href = document.getElementById('canvas-display').toDataURL('image/png');
}

function getSVG(e) {
    e.target.href = 'data:image/svg+xml;base64,\n' + base64.encode(eSVG());
}

const Evolve = ({
    inputImage,
    canvasWidth, canvasHeight, scale, evolutionState,
    maxPolygons, minVertices, maxVertices, minPolygonSize, maxPolygonSize, secondsRun, numSteps, numPolygons,
    onInputImageChange, onPlay, onPause, onMaxPolygonsChange, onNumVerticesChange, onPolygonSizeChange, onScaleChange
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
            <div className="play-pause-get">

                <svg width="20" height="20" onClick={onPlay}>
                    <polygon points="0,0 0,20 20,10" fill={evolutionState === 'EVOLUTION_GO' ? '#45bff6' : '#666'}/>
                </svg>
                <svg width="20" height="20" onClick={onPause}>
                    <path d="M0,0 L0,20 L5,20 L5,0 L0,0 M10,0 L10,20 L15,20 L15,0, L10,0"
                          fill={evolutionState === 'EVOLUTION_PAUSE' ? '#45bff6' : '#666'}/>
                </svg>
                <span className="download-image">
                    <a className="get-png" title="Save this image as a png file." download="dirtytriangles.png"
                       onClick={getPNG}>PNG</a> <a clalossName="get-svg" title="Save this image as an svg file."
                                                   download="dirtytriangles.svg" onClick={getSVG}>SVG</a>
                </span>
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
            <p>Target Scale</p>
            <Rcslider defaultValue={scale} min={0} max={MAX_SCALE} onChange={onScaleChange} included={false}
                      marks={{0: '1/256', 1: '1/64', 2: '1/16', 3: '1/4', 4: '1/1'}}/>
            <table className="stats">
                <tbody>
                <tr>
                    <td>Steps/sec</td>
                    <td className="num">{secondsRun ? Math.round(numSteps / secondsRun) : 0}</td>
                </tr>
                <tr>
                    <td>Polygons</td>
                    <td className="num">{numPolygons}</td>
                </tr>
                </tbody>
            </table>
            <p>
                <label className="input-target-file">
                    New Target Image <input type="file" accept="image/*" onChange={onInputImageChange}/>
                </label>
            </p>
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
    onScaleChange: PropTypes.func.isRequired
};

export default Evolve;
