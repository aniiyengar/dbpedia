
import React from 'react';

import markdownCompiler from '../../modules/markdown';
import about from '../../about.md';

export default class WikiAbout extends React.Component {
    constructor(props) {
        super(props);
    }
    render() {
        return markdownCompiler(about, true);
    }
}
