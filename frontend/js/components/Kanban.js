import React from 'react';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';
import { load } from '../actions/kanbanActions';

class Kanban extends React.Component {
  constructor(props) {
    super(props);
    props.load(props.id);
  }

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
    columns: state.kanban.kanban_columns,
    id: state.kanban.id,
    is_loading: state.kanban.is_loading
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: function(id) {
      dispatch(
        load(
          'get',
          `/api/kanbans/${id}.json`,
          "LOAD_KANBAN_BEGIN",
          "LOAD_KANBAN_SUCCESS",
          "LOAD_KANBAN_ERROR"
        )
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanban);
