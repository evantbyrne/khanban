import React from 'react';
import { connect } from 'react-redux';
import { ticketAdd } from '../actions/kanbanActions';
import KanbanColumn from './KanbanColumn';

const StyleContainer = {
  display: 'flex',
  flexDirection: 'row',
  height: 'calc(100vh - 42px)',
};

class Kanban extends React.Component {
  render() {
    return (
      <div style={StyleContainer}>
        {
          this.props.columns.map((column, index) => (
            <KanbanColumn
              column={column}
              index={index}
              key={`kanban_column_${index}`} />
          ))
        }
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    columns: state.kanban.columns,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanban);
