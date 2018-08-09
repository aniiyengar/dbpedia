
import React from 'react';
import Spinner from 'react-spinkit';

export default class extends React.Component {
    render() {
        return (
            <div className='fp-spinner-container'>
                <Spinner
                    name='ball-grid-pulse'
                    style={{zoom: 0.6}}
                    fadeIn='none' />

                <p className='fp-p'>
                    <b>{this.props.text}</b>
                </p>
            </div>
        );
    }
};
