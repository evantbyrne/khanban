import React from 'react';
import { connect } from 'react-redux';
import { cardDetail } from '../actions/kanbanActions';

class KanbanColumn extends React.Component {
  render() {
    const onCardDetail = this.props.onCardDetail.bind(this);
    const column_index = this.props.index;

    return (
      <div className="KanbanColumn">
        <div className="KanbanColumn_header">{this.props.column.title}</div>
        <div className="KanbanColumn_container">
          {
            this.props.column.tickets.map((ticket, card_index) => (
              <div
                className="KanbanColumn_ticket"
                onClick={(e) => onCardDetail(e, column_index, card_index)}
                key={`kanban_ticket_${card_index}`}>
                #{ticket.id} <a href="#">{ticket.title}</a>
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
