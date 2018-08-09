
import React from 'react';
import { connect } from 'react-redux';

class Login extends React.Component {
    handleFbRedirect() {
        const clientId = '607165666132899';
        const redirectUri = 'http://localhost:8080/fb_redirect';
        const state = 'user: ani';

        window.location =
            'https://www.facebook.com/v3.1/dialog/oauth?'
                + 'client_id=' + clientId + '&'
                + 'redirect_uri=' + redirectUri + '&'
                + 'state=' + state + '';
    }

    render() {
        return (
            <div className='fp-small-container'>
                <h1 className='fp-wiki-title'>Login</h1>
                <p className='fp-p'>
                    fbpedia uses your Facebook account to generate and retrieve
                    Facebook posts. To use it, you need to authorize Facebook to <b>post on
                    your behalf</b>, <b>read your posts and comments</b>,
                    and <b>retrieve basic personal info</b>.
                </p>
                <button
                    className='fp-button-prominent'
                    onClick={this.handleFbRedirect}>
                    Login with Facebook
                </button>
            </div>
        );
    }
};

export default connect()(Login);
