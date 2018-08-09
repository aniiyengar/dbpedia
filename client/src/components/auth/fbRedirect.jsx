
import React from 'react';
import { Redirect } from 'react-router-dom';
import queryString from 'query-string';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Spinner from '../spinner';

import {
    sendFbAuthRequest,
} from '../../modules/auth';

class FbRedirect extends React.Component {
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

        if (!this.props.fbAuthRequestOut) {
            this.props.sendFbAuthRequest(
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
            return <Spinner text='Authenticating...' />;
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
    fbAuthRequestOut: state.fbAuthRequestOut,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendFbAuthRequest,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FbRedirect);
