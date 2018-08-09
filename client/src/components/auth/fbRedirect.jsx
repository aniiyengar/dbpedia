
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
    componentDidMount() {
        // Send the request so we can get out of here.
        const {
            code,
            state
        } = queryString.parse(this.props.location.search);

        this.props.sendFbAuthRequest(
            code,
            state,
        )
    }

    render() {
        return <Spinner text={'Working...'} />
    }
};

const mapStateToProps = state => ({
    authSuccess: !state.fbAuthRequestOut && !state.fbAuthRequestError
});

const mapDispatchToProps = dispatch => ({
    sendFbAuthRequest,
});

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(FbRedirect);
