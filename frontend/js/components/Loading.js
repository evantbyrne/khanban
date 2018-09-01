import React from 'react';
import { connect } from 'react-redux';

class Loading extends React.Component {
  render() {
    return this.props.is_loading && (
      <div className="Loading">Loading...</div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    is_loading: state.kanban.is_loading
  };
}

export default connect(
  mapStateToProps,
  null
)(Loading);
