
// Utility to convert Markdown syntax tree to React components.
// Basically a stripped down, customized version of NPM remark-react.

import React from 'react';
import mdastToHast from 'mdast-util-to-hast';
import hastSanitize from 'hast-util-sanitize';
import hastToHyper from 'hast-to-hyperscript';

// Wrapper for React.createElement
const elementTransform = {
    'div': '',
    'a': '',
    'strong': '',
    'ul': 'dbp-ul',
    'ol': 'dbp-ol',
    'li': 'dbp-li',
    'code': 'dbp-code',
    'p': 'dbp-p',
    'h1': 'dbp-wiki-title',
    'h2': 'dbp-wiki-title',
};

const createElement = (name, props, children) => {
    if (elementTransform.hasOwnProperty(name)) {
        // Default functionality for links in Markdown
        if (name == 'a') {
            props['target'] = '_blank';
        }

        return React.createElement(
            name,
            {
                ...props,
                className: elementTransform[name],
            },
            children,
        );
    } else {
        console.log(name, props, children)
        return React.createElement(
            'span',
            props,
            children,
        );
    }
};

export default function() {
    this.Compiler = node => {
        const hastLoader = hastSanitize(
            {
                type: 'element',
                properties: {},
                tagName: 'div',
                children: mdastToHast(
                    node,
                    {},
                ).children,
            },
            {},
        );

        return hastToHyper(
            createElement,
            hastLoader,
        );
    };
};
