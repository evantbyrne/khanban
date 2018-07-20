import React from 'react';
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
        <div className="KanbanColumn_container">
          {
            this.props.column.cards.map((card, card_index) => (
              <div
                className="KanbanColumn_ticket"
                onClick={(e) => onCardDetail(e, column_index, card_index)}
                key={`kanban_card_${card_index}`}>
                #{card.id} <a href="#">{card.title}</a>
              </div>
            ))
          }
        </div>
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
