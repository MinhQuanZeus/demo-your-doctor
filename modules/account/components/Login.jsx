import React from 'react';
import {Layout, Form, Icon, Input, Button, Checkbox, notification} from 'antd';

const FormItem = Form.Item;
const {Content} = Layout;

class LoginForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            submitLoading: false,
            username: '',
            password: ''
        };
        this.handleUsernameChange = this.handleUsernameChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
    }

    handleUsernameChange(event) {
        this.setState({username: event.target.value});
    }
    handlePasswordChange(event) {
        this.setState({password: event.target.value});
    }

    handleSubmit = (e) => {
        this.setState({
            submitLoading: true
        });
        e.preventDefault();
        Meteor.loginWithPassword(this.state.username, this.state.password, loginError => {
            this.setState({
                submitLoading: false
            });
            if (loginError)
                notification.error(loginError);
        });
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <input placeholder='Username' type="text" value={this.state.username} onChange={this.handleUsernameChange} className="form-control" id="username"/>
                </div>
                <div className="form-group">
                    <input placeholder="Password" type="password" value={this.state.password} onChange={this.handlePasswordChange} className="form-control" id="password"/>
                </div>
                <div className="checkbox">
                    <label><input type="checkbox"/> Remember me</label>
                </div>
                <button type="submit" className="btn btn-default">Login</button>
            </form>
        );
    }
}

export default Form.create()(LoginForm);