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
            <p>Roger Johansson came up with the idea of evolving a picture from polygons, check out his article on <a
                href="https://rogeralsing.com/2008/12/07/genetic-programming-evolution-of-mona-lisa/">Evolving Mona
                Lisa</a>. Altered Qualia implemented the <a href="http://alteredqualia.com/visualization/evolve/">first
                version in JavaScript</a>.</p>
        </div>
    </div>
);

export default About
