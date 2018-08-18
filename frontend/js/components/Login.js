import React from 'react';
import { connect } from 'react-redux';
import { load, viewIndex } from '../actions/kanbanActions';

class Login extends React.Component {
  state = {
    password: "",
    username: "",
  };

  static getDerivedStateFromProps(props, state) {
    if (props.token) {
      props.viewIndex();
    }

    return state;
  }

  componentDidMount() {
    this.setState({
      password: "",
      username: "",
    })
  }

  mutate(event, key) {
    const obj = {};
    obj[key] = event.target.value;
    this.setState(obj);
  }

  onLogin = (event) => {
    event.preventDefault();
    this.props.onLogin(this.state.username, this.state.password);
  }

  render() {
    const mutate = this.mutate.bind(this);

    return (
      <div className="Login">
        <input className="Login_field"
          onChange={(e) => mutate(e, 'username')}
          placeholder="Username..."
          value={this.state.username} />
        <input className="Login_field"
          onChange={(e) => mutate(e, 'password')}
          placeholder="Password..."
          type="password"
          value={this.state.password} />
        <button className="Login_button"
          disabled={false}
          onClick={this.onLogin}>Log In</button>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    token: state.kanban.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onLogin: (username, password) => {
      const data = {
        username,
        password
      };
      dispatch(
        load(
          null,
          'post',
          `/api/token/`,
          "LOGIN_BEGIN",
          "LOGIN_SUCCESS",
          "LOGIN_ERROR",
          data
        )
      );
    },

    viewIndex: () => dispatch(viewIndex())
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Login);
