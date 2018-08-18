import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';
import { cardMove, load } from '../actions/kanbanActions';

class Kanban extends React.Component {
  componentDidMount() {
    this.props.load(this.props.token, this.props.id);
  }

  onDragEnd(result) {
    if(!result.destination) {
       return;
    }

    this.props.onCardMove(result.source, result.destination);
    this.props.onOrder(this.props.token, this.props.id, this.props.columns);
  }

  render() {
    const onDragEnd = this.onDragEnd.bind(this);
    const is_editing = (this.props.current_card !== null && this.props.current_card.id === null);
    return (
      <div className={`Kanban ${this.props.current_card ? '-card-detail' : ''}`}>
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
    is_loading: state.kanban.is_loading,
    token: state.kanban.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: function(token, id) {
      dispatch(
        load(
          token,
          'get',
          `/api/kanbans/${id}.json`,
          "LOAD_KANBAN_BEGIN",
          "LOAD_KANBAN_SUCCESS",
          "LOAD_KANBAN_ERROR"
        )
      );
    },

    onCardMove: (source, destination) => {
      dispatch(cardMove(source, destination));
    },

    onOrder: (token, id, kanban_columns) => {
      const data = {
        id,
        kanban_columns
      };
      dispatch(
        load(
          token,
          'put',
          `/api/kanbans/${id}/order.json`,
          "LOAD_KANBAN_BEGIN",
          "ORDER_KANBAN_SUCCESS",
          "LOAD_KANBAN_ERROR",
          data
        )
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanban);
