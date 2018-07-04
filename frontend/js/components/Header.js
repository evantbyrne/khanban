import React from 'react';
import { connect } from 'react-redux';

class Header extends React.Component {
  render() {
    return (
      <header className="Header">
        <nav className="Header_nav">
          <a className="Header_nav-link" href="#">Dashboard</a> /
          <a className="Header_nav-link" href="#">Foobar</a> /
          <a className="Header_nav-link" href="#">Kanban</a>
          <a className="Header_nav-link-right" href="#">
            <u>evantbyrne</u> <span>↓</span>
          </a>
        </nav>
      </header>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {};
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Header);
