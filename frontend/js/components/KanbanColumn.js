import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { cardAdd, cardDetail } from '../actions/kanbanActions';

class KanbanColumn extends React.Component {
  render() {
    const onCardAdd = this.props.onCardAdd.bind(this);
    const onCardDetail = this.props.onCardDetail.bind(this);
    const column = this.props.column;
    const column_index = this.props.index;

    return (
      <div className="KanbanColumn">
        <div className="KanbanColumn_header">
          {this.props.column.title}
          <a
            className="KanbanColumn_header-add"
            href="#"
            onClick={(e) => onCardAdd(e, column.id)}>+</a>
        </div>
        <Droppable droppableId={`kanban_column_${column.id}`}>
          {(provided, snapshot) => (
            <div
              {...provided.droppableProps}
              className="KanbanColumn_container"
              ref={provided.innerRef}>
              {
                this.props.column.cards.map((card, card_index) => (
                  <Draggable
                    index={card_index}
                    draggableId={card.id}
                    key={`kanban_card_${column_index}_${card_index}`}>
                    {(provided, snapshot) => (
                      <div>
                        <div
                          {...provided.dragHandleProps}
                          {...provided.draggableProps}
                          className="KanbanColumn_ticket"
                          onClick={(e) => onCardDetail(e, column_index, card_index)}
                          ref={provided.innerRef}>
                          #{card.id} <a href="#">{card.title}</a>
                        </div>
                        {provided.placeholder}
                      </div>
                    )}
                  </Draggable>
                ))
              }
            </div>
          )}
        </Droppable>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    column: ownProps.column,
    index: ownProps.index,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onCardAdd: (event, kanban_column) => {
      event.preventDefault();
      dispatch(cardAdd(kanban_column));
    },

    onCardDetail: (event, column_index, card_index) => {
      event.preventDefault();
      dispatch(cardDetail(column_index, card_index));
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KanbanColumn);
