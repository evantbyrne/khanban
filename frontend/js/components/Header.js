import Cookies from "js-cookie";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ContextMenu from './ContextMenu';
import ContextMenuLink from './ContextMenuLink';
import { load, viewDashboard } from '../actions/kanbanActions';

class Header extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!props.is_loading && !props.user && props.token) {
      props.loadUser(props.token);
    }

    return state;
  }

  state = {
    is_context_menu: false
  };

  onContextMenu = (event) => {
    event.preventDefault();
    this.setState({
      is_context_menu: !this.state.is_context_menu
    });
  };

  onViewDashboard = (event) => {
    event.preventDefault();
    this.props.viewDashboard();
  }

  onLogOut = (event) => {
    event.preventDefault();
    this.props.logOut(this.props.token);
  };

  render() {
    if (!this.props.token) {
      return null;
    }

    return (
      <header className="Header">
        <nav className="Header_nav">
          <a className="Header_nav-link" href="/" id="HeaderNav_dashboard" onClick={this.onViewDashboard}>Dashboard</a>
          {this.props.title && (
            <React.Fragment>
              / <Link className="Header_nav-link" id="HeaderNav_project" to={`/${this.props.slug}`}>{this.props.title}</Link>
            </React.Fragment>
          )}
          {this.props.user && (
            <a className="Header_nav-link-right"
              id="HeaderNav_user"
              href="#"
              onClick={this.onContextMenu}>
              <u>{this.props.user.username}</u> <span>{this.state.is_context_menu ? "↑" : "↓"}</span>
            </a>
          )}
        </nav>
        {this.state.is_context_menu && (
          <ContextMenu right={20} top={30}>
            <ContextMenuLink id="ContextMenu_logout" onClick={this.onLogOut}>Log Out</ContextMenuLink>
          </ContextMenu>
        )}
      </header>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    is_loading: state.kanban.loading_count > 0,
    slug: state.kanban.slug,
    title: state.kanban.title,
    token: state.kanban.token,
    user: state.kanban.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
    loadUser: function(token) {
      dispatch(
        load(
          token,
          "get",
          "/auth/user/?format=json",
          "LOAD_USER_BEGIN",
          "LOAD_USER_SUCCESS",
          "LOAD_KANBAN_ERROR"
        )
      );
    },

    logOut: function(token) {
      dispatch(
        load(
          token,
          "get",
          "/auth/logout/?format=json",
          "LOGOUT_BEGIN",
          "LOGOUT_SUCCESS",
          "LOAD_KANBAN_ERROR"
        )
      );
    },

    viewDashboard: function() {
      dispatch(viewDashboard());
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
