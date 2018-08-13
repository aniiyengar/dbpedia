
import React from 'react';
import Spinner from 'react-spinkit';

export default class extends React.Component {
    render() {
        return (
            <div className='dbp-spinner-container'>
                <Spinner
                    name='ball-grid-pulse'
                    style={{zoom: 0.6}}
                    fadeIn='none' />

                <p className='dbp-p'>
                    <b>{this.props.text}</b>
                </p>
            </div>
        );
    }
};
