import React, {PropTypes} from 'react';

const Canvas = ({inputImage}) => (
    <canvas width={inputImage.width} height={inputImage.height}/>
);

Canvas.propTypes = {
    inputImage: PropTypes.instanceOf(HTMLImageElement)
};

export default Canvas
