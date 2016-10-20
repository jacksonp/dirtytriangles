import React from 'react'

const About = () => (
    <div>
        <h2>Evolve Images from Random Polygons</h2>
        <div id="illustration">
            <img src="/img/rand_polys.png" alt="Some random polygons"/>
            <span id="arrow">➔</span>
            <img src="/img/mini_taj.png" alt="Polygons forming an image of the Taj Mahal"/>
            <p>Starting with a bunch of random polygons, Dirty Triangles will evolve a picture, like this view of
                the Taj Mahal. At each step, one of the polygons is randomly modified, or "mutated": this change is
                kept only if it makes the set of polygons look more like the target image, otherwise the mutation is
                discarded.</p>
        </div>
    </div>
);

export default About
