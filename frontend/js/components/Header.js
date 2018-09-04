import Cookies from "js-cookie";
import React from "react";
import { connect } from "react-redux";
import { Link } from "react-router-dom";
import ContextMenu from './ContextMenu';
import ContextMenuLink from './ContextMenuLink';
import { load } from '../actions/kanbanActions';

class Header extends React.Component {
  state = {
    is_context_menu: false
  };

  onContextMenu = (event) => {
    event.preventDefault();
    this.setState({
      is_context_menu: !this.state.is_context_menu
    });
  };

  onLogOut = (event) => {
    event.preventDefault();
    this.props.logOut(this.props.token);
  };

  render() {
    if (!this.props.user) {
      return null;
    }

    return (
      <header className="Header">
        <nav className="Header_nav">
          <Link className="Header_nav-link" id="HeaderNav_dashboard" to="/">Dashboard</Link> /
          <Link className="Header_nav-link" id="HeaderNav_project" to="/">{this.props.title}</Link> /
          <Link className="Header_nav-link" id="HeaderNav_kanban" to="/">Kanban</Link>
          <a className="Header_nav-link-right"
            id="HeaderNav_user"
            href="#"
            onClick={this.onContextMenu}>
            <u>{this.props.user.username}</u> <span>{this.state.is_context_menu ? "↑" : "↓"}</span>
          </a>
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
    is_loading: state.kanban.is_loading,
    title: state.kanban.title,
    token: state.kanban.token,
    user: state.kanban.user
  };
}

function mapDispatchToProps(dispatch) {
  return {
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
    }
  }
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
