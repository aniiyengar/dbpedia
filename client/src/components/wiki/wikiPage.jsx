
import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import TextareaAutosize from 'react-autosize-textarea';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPencilAlt, faSave } from '@fortawesome/free-solid-svg-icons'

import {
    sendPageReadRequest,
    sendPageWriteRequest,
} from '../../modules/page';

import markdownCompiler from '../../modules/markdown';

import {
    titleCase,
} from '../../modules/utils';

import Spinner from '../spinner';

class WikiPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            editing: false,
        }

        this.textDisplay = this.textDisplay.bind(this);
        this.changeClientPageData = this.changeClientPageData.bind(this);
        this.startEditing = this.startEditing.bind(this);
        this.saveEdits = this.saveEdits.bind(this);
        this.getLoadingScreen = this.getLoadingScreen.bind(this);
    }

    componentDidMount() {
        const { title } = this.props.match.params;
        this.props.sendPageReadRequest(title).then(() => {
            this.setState({
                clientPageData: this.props.page.pageData,
            });
        });
    }

    startEditing() {
        this.setState({
            editing: true,
        });
    }

    saveEdits() {
        this.props.sendPageWriteRequest(
            this.state.clientPageData,
        ).then(() => {
            this.setState({
                editing: false,
            });
        });
    }

    changeClientPageData(event) {
        this.setState({
            clientPageData: event.target.value,
        });
    }

    textDisplay() {
        if (this.state.editing) {
            return (
                <TextareaAutosize
                    className='dbp-editing-area'
                    value={this.state.clientPageData}
                    onChange={this.changeClientPageData}
                    rows={6}
                    onResize={(e) => {}} />
            )
        } else if (
            this.props.auth.dropboxAuthSecret === '' ||
            this.props.page.pageRequestOut ||
            this.props.page.pageWriteRequestOut
        ) {
            return null;
        } else if (this.props.page.pageData === '') {
            return (
                <p>
                    Looks like this page hasn't been created yet.
                    Click the pencil above to write the first edit.
                </p>
            )
        } else {
            return markdownCompiler(this.props.page.pageData);
        }
    }

    getEditIcon() {
        if (
            this.props.auth.dropboxAuthSecret === '' ||
            this.props.page.pageRequestOut ||
            this.props.page.pageWriteRequestOut
        ) {
            return null;
        } else if (this.state.editing) {
            return (
                <span
                    onClick={this.saveEdits}
                    className='dbp-edit-icon'>
                    <FontAwesomeIcon icon={faSave} />
                </span>
            );
        } else {
            return (
                <span
                    onClick={this.startEditing}
                    className='dbp-edit-icon'>
                    <FontAwesomeIcon icon={faPencilAlt} />
                </span>
            );
        }
    }

    getLoadingScreen() {
        if (
            this.props.page.pageRequestOut ||
            this.props.page.pageWriteRequestOut
        ) {
            return (
                <div className='dbp-loading'>
                    <div className='dbp-small-container dbp-centered'>
                        <Spinner text='Loading...' />
                    </div>
                </div>
            );
        } else {
            return null;
        }
    }

    render() {
        return (
            <div>
                { this.getLoadingScreen() }
                <div className='dbp-title-level'>
                    <h1 className='dbp-wiki-title'>
                        { titleCase(this.props.page.pageName) }
                    </h1>
                    { this.getEditIcon() }
                </div>

                <p className='dbp-p'>
                    { this.textDisplay() }
                </p>
            </div>
        )
    }
};

const mapStateToProps = state => ({
    page: state.page,
    auth: state.auth,
});

const mapDispatchToProps = dispatch => bindActionCreators({
    sendPageReadRequest,
    sendPageWriteRequest,
}, dispatch);

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(WikiPage);
