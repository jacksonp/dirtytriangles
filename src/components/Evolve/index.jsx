import 'rc-slider/assets/index.css';
import 'rc-collapse/assets/index.css';
import './index.css';

import Collapse, {Panel} from 'rc-collapse';
import React from 'react';
import PropTypes from 'prop-types';
import Slider, { Range } from 'rc-slider'
import base64 from 'base-64'
import About from '../About/';
import {eSVG} from '../../dt/run'
import {MUTATION} from '../../dt/mutate'

const POLYGONS_MIN = 10;
const POLYGONS_MAX = 500;

const VERTICES_MIN = 3;
const VERTICES_MAX = 15;

const POLYGON_SIZE_MIN = 1;
const POLYGON_SIZE_MAX = 100;

const CULL_QUALITY_THRESHOLD_MIN = 0;
const CULL_QUALITY_THRESHOLD_MAX = 75;
const CULL_QUALITY_THRESHOLD_STEP = 5;

export const SCALE_MAX = 4;

function getPNG(e) {
    e.target.href = document.getElementById('canvas-display').toDataURL('image/png');
}

function getSVG(e) {
    e.target.href = 'data:image/svg+xml;base64,\n' + base64.encode(eSVG());
}

const Evolve = ({
    inputImage,
    canvasWidth, canvasHeight, scale, evolutionState,
    maxPolygons, minVertices, maxVertices, minPolygonSize, maxPolygonSize, mutateFn, cullQualityThreshold,
    secondsRun, numSteps, numPolygons, stepsPerSec,
    onInputImageChange, onPlay, onPause, onMaxPolygonsChange, onNumVerticesChange, onPolygonSizeChange, onScaleChange, onMutationTypeChange, onCullQualityThresholdChange
}) => (
    <div id="dt-dash">
        <div className="left-col">
            <About/>
        </div>
        <div className="canvasContainer">
            { inputImage ? <canvas id="canvas-display" width={canvasWidth} height={canvasHeight}/> : null }
        </div>
        <div className="right-col">

            <Collapse defaultActiveKey="0">
                <Panel header="Controls">
                    <div className="play-pause-get">

                        <svg width="20" height="20" onClick={onPlay}>
                            <polygon points="0,0 0,20 20,10"
                                     fill={evolutionState === 'EVOLUTION_GO' ? '#45bff6' : '#666'}/>
                        </svg>
                        <svg width="20" height="20" onClick={onPause}>
                            <path d="M0,0 L0,20 L5,20 L5,0 L0,0 M10,0 L10,20 L15,20 L15,0, L10,0"
                                  fill={evolutionState === 'EVOLUTION_PAUSE' ? '#45bff6' : '#666'}/>
                        </svg>
                        <span className="download-image">
                    <a title="Save this image as a png file." download="dirtytriangles.png" onClick={getPNG}>PNG</a> <a
                            title="Save this image as an svg file." download="dirtytriangles.svg"
                            onClick={getSVG}>SVG</a>
                </span>
                    </div>
                    <p>Max Polygon Count</p>
                    <Slider defaultValue={maxPolygons} step={10} min={POLYGONS_MIN} max={POLYGONS_MAX}
                            onChange={onMaxPolygonsChange}/>
                    <p>Polygon Vertices</p>
                    <Range range={true} defaultValue={[minVertices, maxVertices]} min={VERTICES_MIN}
                            max={VERTICES_MAX} onChange={onNumVerticesChange}/>
                    <p>Polygon Size %</p>
                    <Range range={true} defaultValue={[minPolygonSize, maxPolygonSize]} min={POLYGON_SIZE_MIN}
                            max={POLYGON_SIZE_MAX} onChange={onPolygonSizeChange}/>
                    <p>Target Scale</p>
                    <Slider defaultValue={scale} min={0} max={SCALE_MAX} onChange={onScaleChange} included={false}
                            tipFormatter={(v) => `1/${Math.pow(2, 2 * (4 - v))}`}/>
                    <p>Mutation</p>
                    <select defaultValue={mutateFn}
                            onChange={onMutationTypeChange}>{Object.keys(MUTATION).map(function (k) {
                        return <option value={MUTATION[k]} key={MUTATION[k]}>{k}</option>
                    })}</select>
                    <p>Cull Quality Threshold</p>
                    <Slider defaultValue={cullQualityThreshold} step={CULL_QUALITY_THRESHOLD_STEP}
                            min={CULL_QUALITY_THRESHOLD_MIN} max={CULL_QUALITY_THRESHOLD_MAX}
                            onChange={onCullQualityThresholdChange}
                            tipFormatter={(v) => v === 0 ? 'Cull Nothing' : '<' + v + '%'}/>
                    <p>
                        <label className="input-target-file">
                            New Target Image <input type="file" accept="image/*" onChange={onInputImageChange}/>
                        </label>
                    </p>
                </Panel>
                <Panel header="Stats" className="stats-header">
                    <table className="stats">
                        <tbody>
                        <tr>
                            <td>Steps/sec</td>
                            <td className="num">{stepsPerSec}</td>
                        </tr>
                        <tr>
                            <td>Polygons</td>
                            <td className="num">{numPolygons}</td>
                        </tr>
                        </tbody>
                    </table>
                </Panel>
            </Collapse>
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
    onScaleChange: PropTypes.func.isRequired,
    onMutationTypeChange: PropTypes.func.isRequired,
    onCullQualityThresholdChange: PropTypes.func.isRequired,
};

export default Evolve;
