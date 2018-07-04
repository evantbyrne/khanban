import React from 'react';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';

class Kanban extends React.Component {
  render() {
    return (
      <div className="Kanban">
        <div className="Kanban_container">
          {
            this.props.columns.map((column, index) => (
              <KanbanColumn
                column={column}
                index={index}
                key={`kanban_column_${index}`} />
            ))
          }
        </div>
        <CardDetail />
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
