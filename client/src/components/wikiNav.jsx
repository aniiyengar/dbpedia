
import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faSearch } from '@fortawesome/free-solid-svg-icons'

export default class extends React.Component {
    render() {
        return (
            <div className='fp-wiki-nav'>
                <div className='fp-wiki-nav-item fp-wiki-nav-title'>
                    fbpedia
                </div>
                <div className='fp-wiki-nav-item fp-wiki-nav-right'>
                    <FontAwesomeIcon icon={faPlus} />
                </div>
                <div className='fp-wiki-nav-item fp-wiki-nav-right'>
                    <FontAwesomeIcon icon={faSearch} />
                </div>
            </div>
        );
    }
};
