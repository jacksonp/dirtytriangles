import './index.css';

import React from 'react'
import FaTwitter from 'react-icons/lib/fa/twitter'
import FaEnvelopeO from 'react-icons/lib/fa/envelope-o'
import FaGithubAlt from 'react-icons/lib/fa/github-alt'

const Footer = () => (
    <footer id="dt-footer">
        <div className="links">
            <a href="https://github.com/jacksonp/dirtytriangles" title="GitHub"><FaGithubAlt width="30" height="30"/></a>
            <a href="https://twitter.com/DirtyTriangles" title="Twitter"><FaTwitter width="30" height="30"/></a>
            <a href="mailto:dirtytriangles@jacksonpauls.com" title="Email"><FaEnvelopeO width="30" height="30"/></a>
        </div>
        <span className="version">v1.0</span>
    </footer>
);

export default Footer
