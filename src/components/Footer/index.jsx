import './index.css';

import React from 'react'
import {FaTwitter, FaEnvelopeOpen, FaGithubAlt }from 'react-icons/fa'

const Footer = () => (
    <footer id="dt-footer">
        <div className="links">
            <a href="https://github.com/jacksonp/dirtytriangles" title="GitHub"><FaGithubAlt width="30" height="30"/></a>
            <a href="https://twitter.com/DirtyTriangles" title="Twitter"><FaTwitter width="30" height="30"/></a>
            <a href="mailto:jacksonpauls@gmail.com" title="Email"><FaEnvelopeOpen width="30" height="30"/></a>
        </div>
        <span className="version">v1.0</span>
    </footer>
);

export default Footer
