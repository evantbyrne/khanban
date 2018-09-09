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
    const project_slug = this.props.project_slug;

    return (
      <div className="KanbanColumn">
        <div className="KanbanColumn_header">
          {this.props.column.title}
          <a
            className="KanbanColumn_header-add"
            href="#"
            onClick={(e) => onViewCardAdd(e, project_slug, column.id)}>+</a>
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
                          id={`KanbanCard_${card.id}`}
                          onClick={(e) => onViewCard(e, project_slug, card.id)}
                          ref={provided.innerRef}>
                          <span>#{card.id}</span> <a href="#">{card.card_revisions[0].title}</a>
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
    project_slug: state.kanban.slug
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onViewCard: (event, project_slug, card_id) => {
      event.preventDefault();
      dispatch(viewCard(project_slug, card_id));
    },

    onViewCardAdd: (event, project_slug, kanban_column) => {
      event.preventDefault();
      dispatch(viewCardAdd(project_slug, kanban_column));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KanbanColumn);
