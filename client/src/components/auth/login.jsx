
import React from 'react';
import { connect } from 'react-redux';

class Login extends React.Component {
    handleDropboxRedirect() {
        const clientId = 'yvgitye8tkofczl';
        const redirectUri = DBPEDIA_HOSTNAME + '/dropbox_redirect';
        const state = 'nil';

        window.location =
            'https://www.dropbox.com/oauth2/authorize?'
                + 'response_type=' + 'code' + '&'
                + 'require_role=' + 'personal' + '&'
                + 'client_id=' + clientId + '&'
                + 'redirect_uri=' + redirectUri + '&'
                + 'state=' + state + '&';
    }

    render() {
        return (
            <div className='dbp-small-container'>
                <h1 className='dbp-wiki-title'>Login</h1>
                <p className='dbp-p'>
                    dbpedia uses your Dropbox account.
                </p>
                <button
                    className='dbp-button-prominent'
                    onClick={this.handleDropboxRedirect}>
                    Login with Dropbox
                </button>
            </div>
        );
    }
};

export default connect()(Login);
