
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import {
    sendPageReadRequest,
} from '../../modules/page';

class WikiPage extends React.Component {
    componentDidMount() {
        const { title } = this.props.match.params;
        this.props.sendPageReadRequest(title);
    }

    render() {
        return (
            <div>
                <h1 className='dbp-wiki-title'>
                    { this.props.page.pageName }
                </h1>
                <p className='dbp-p'>
                    { this.props.page.pageData }
                </p>
            </div>
        )
    }
};

const mapStateToProps = state => ({
    page: state.page,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendPageReadRequest,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WikiPage);
