require('./index.css');

import React from 'react'

const About = () => (
    <div id="dt-about">
        <h2>Evolve Images from Polygons</h2>
        <div id="illustration">
            <img src="/img/rand_polys.png" alt="Some random polygons"/>
            <div className="down-arrow">⇓</div>
            <img src="/img/mini_taj.png" alt="Polygons forming an image of the Taj Mahal"/>
            <p>Given a target image, Dirty Triangles will evolve random polygons to match the target as closely as
                possible. At each step, a polygon is added, modified, or removed: a change is kept only if it makes the
                set of polygons look more like the target.</p>
        </div>
    </div>
);

export default About
