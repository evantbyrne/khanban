import React from 'react';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';

const StyleContainer = {
  display: 'flex',
  flexDirection: 'row',
  marginRight: 10,
};

class Tag extends React.Component {
  render() {
    const StyleCircle = {
      background: this.props.tag.color,
      borderRadius: 3,
      display: 'block',
      height: 12,
      marginRight: 5,
      transform: 'translateY(3px)',
      width: 12,
    };

    return (
      <span style={StyleContainer}>
        <span style={StyleCircle}></span>
        <a href="#">{this.props.tag.title}</a>
      </span>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    index: ownProps.index,
    tag: ownProps.tag,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Tag);
