import React from 'react';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';

class Tag extends React.Component {
  render() {
    return (
      <span className="Tag">
        <span className="Tag_circle" style={ {background: this.props.tag.color} }></span>
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
