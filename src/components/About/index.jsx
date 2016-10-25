import './index.css';

import React from 'react'

const About = () => (
    <div id="dt-about">
        <h2>About</h2>
        <div className="illustration">
            <img src="/img/rand_polys.png" alt="Some random polygons"/>
            <div className="down-arrow">⇓</div>
            <img src="/img/mini_taj.png" alt="Polygons forming an image of the Taj Mahal"/>
            <p>Given a target image, Dirty Triangles will evolve a set of polygons that resemble the target. At each
                step, a polygon is added, mutated, or removed: the modification is preserved only if it makes the set of
                polygons look more like the target.</p>
            <p>Roger Johansson came up with the idea of evolving a picture from polygons, see <a
                href="https://rogeralsing.com/2008/12/07/genetic-programming-evolution-of-mona-lisa/">Evolving Mona
                Lisa</a>. Altered Qualia implemented the <a href="http://alteredqualia.com/visualization/evolve/">first
                version in JavaScript</a>.</p>
        </div>
    </div>
);

export default About
