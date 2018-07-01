import React from 'react';
import { connect } from 'react-redux';

const StyleBlack = {
  color: 'black',
};

const StyleContainer = {
  borderBottom: '2px solid black',
  padding: '10px 20px 10px 15px',
};

const StyleNav = {
  display: 'flex',
  flexDirection: 'row',
  position: 'relative',
};

const StyleNavLink = {
  margin: '0 5px',
};

const StyleNavLinkRight = {
  position: 'absolute',
  right: 0,
  textDecoration: 'none',
  top: 0,
};

class Header extends React.Component {
  render() {
    return (
      <header style={StyleContainer}>
        <nav style={StyleNav}>
          <a style={StyleNavLink} href="#">Dashboard</a> /
          <a style={StyleNavLink} href="#">Foobar</a> /
          <a style={StyleNavLink} href="#">Kanban</a>
          <a style={StyleNavLinkRight} href="#">
            <u>evantbyrne</u> <span style={StyleBlack}>↓</span>
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
