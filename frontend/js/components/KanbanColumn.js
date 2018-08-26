import React from 'react';
import { Draggable, Droppable } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import { viewCard, viewCardAdd } from '../actions/kanbanActions';

class KanbanColumn extends React.Component {
  render() {
    const onViewCardAdd = this.props.onViewCardAdd.bind(this);
    const onViewCard = this.props.onViewCard.bind(this);
    const column = this.props.column;
    const column_index = this.props.index;

    return (
      <div className="KanbanColumn">
        <div className="KanbanColumn_header">
          {this.props.column.title}
          <a
            className="KanbanColumn_header-add"
            href="#"
            onClick={(e) => onViewCardAdd(e, column.id)}>+</a>
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
                          onClick={(e) => onViewCard(e, card.id)}
                          ref={provided.innerRef}>
                          #{card.id} <a href="#">{card.card_revisions[0].title}</a>
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
    onViewCard: (event, card_id) => {
      event.preventDefault();
      dispatch(viewCard(card_id));
    },

    onViewCardAdd: (event, kanban_column) => {
      event.preventDefault();
      dispatch(viewCardAdd(kanban_column));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KanbanColumn);
