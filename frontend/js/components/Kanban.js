import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';
import { cardOrder, load } from '../actions/kanbanActions';

class Kanban extends React.Component {
  constructor(props) {
    super(props);
    props.load(props.id);
  }

  onDragEnd(result) {
    // Dropped outside the list.
    if(!result.destination) {
       return;
    }

    // console.log('>>>', result.source, result.destination)
    this.props.onCardOrder(result.source, result.destination);
  }

  render() {
    const onDragEnd = this.onDragEnd.bind(this);
    const is_editing = (this.props.current_card !== null && this.props.current_card.id === null);
    return (
      <div className="Kanban">
        <div className="Kanban_container">
          <DragDropContext onDragEnd={onDragEnd}>
            {
              this.props.columns.map((column, index) => (
                <KanbanColumn
                  column={column}
                  index={index}
                  key={`kanban_column_${index}`} />
              ))
            }
          </DragDropContext>
        </div>
        <CardDetail is_editing={is_editing} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    columns: state.kanban.kanban_columns,
    current_card: state.kanban.current_card,
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
    },

    onCardOrder: (source, destination) => {
      dispatch(cardOrder(source, destination));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanban);
