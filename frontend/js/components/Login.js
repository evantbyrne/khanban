import React from 'react';
import { connect } from 'react-redux';
import { isLoading, load, viewIndex } from '../actions/kanbanActions';

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
    });

    if (this.props.is_loading) {
      this.props.onIsLoading(false);
    }
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
      <form className="Login" onSubmit={this.onLogin}>
        <input className="Login_field"
          name="username"
          onChange={(e) => mutate(e, 'username')}
          placeholder="Username..."
          value={this.state.username} />
        <input className="Login_field"
          name="password"
          onChange={(e) => mutate(e, 'password')}
          placeholder="Password..."
          type="password"
          value={this.state.password} />
        <button className="Login_button"
          disabled={false}
          onClick={this.onLogin}>Log In</button>
      </form>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    is_loading: state.kanban.is_loading,
    token: state.kanban.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onIsLoading: (is_loading) => dispatch(isLoading(is_loading)),

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
