
import React from 'react';
import remark from 'remark';

import markdownCompiler from '../../modules/markdown';
import about from '../../about.md';

export default class WikiAbout extends React.Component {
    constructor(props) {
        super(props);
        this.renderer = remark().use(markdownCompiler);
    }
    render() {
        return (
            <div>{ this.renderer.processSync(about).contents }</div>
        )
    }
}
