
import React from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../spinner';

import {
    sendDropboxAuthRequest,
} from '../../modules/auth';

class DropboxRedirect extends React.Component {
    constructor(props) {
        super(props)

        this.state = {
            success: undefined,
        };
    }

    componentDidMount() {
        // Send the request so we can get out of here.
        const {
            code,
            state,
        } = queryString.parse(this.props.location.search);

        if (!this.props.dropboxAuthRequestOut) {
            this.props.sendDropboxAuthRequest(
                code,
                state,
            )
            .then(() => {
                this.setState({
                    success: true,
                });
            })
            .catch(() => {
                this.setState({
                    success: false,
                });
            });
        }
    }

    render() {
        if (this.state.success === undefined) {
            return (
                <div className='dbp-small-container'>
                    <Spinner text='Authenticating...' />
                </div>
            );
        } else if (this.state.success) {
            // It worked!
            return <Redirect to='/' />
        } else {
            // It workn't!
            return <div>Nop</div>
        }
    }
};

const mapStateToProps = state => ({
    dropboxAuthRequestOut: state.dropboxAuthRequestOut,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendDropboxAuthRequest,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(DropboxRedirect);
