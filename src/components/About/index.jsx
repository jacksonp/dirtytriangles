import 'rc-collapse/assets/index.css';
import './index.css';

import Collapse, {Panel} from 'rc-collapse';
import React from 'react'

const About = () => (

    <Collapse defaultActiveKey="0">
        <Panel header="About" className="stats-header">
            <div id="dt-about">
                <div className="illustration">
                    <img src="/img/polygon_marilyn.gif" alt="Animation: random polygons evolve into Marilyn Monroe"/>
                    <p>Given a target image, Dirty Triangles will evolve a set of polygons that resemble the target. At
                        each step, a polygon is added, mutated, or removed: the modification is preserved only if it
                        makes the set of polygons look more like the target.</p>
                    <p>Roger Johansson came up with the idea of evolving a picture from polygons, see <a
                        href="https://rogeralsing.com/2008/12/07/genetic-programming-evolution-of-mona-lisa/">Evolving
                        Mona Lisa</a>. Altered Qualia implemented the <a
                        href="http://alteredqualia.com/visualization/evolve/">first version in JavaScript</a>.</p>
                </div>
            </div>
        </Panel>
    </Collapse>
);

export default About
