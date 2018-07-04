import React from 'react';
import { connect } from 'react-redux';
import { cardDetail } from '../actions/kanbanActions';

const StyleContainer = {
  borderRight: '2px solid black',
  position: 'relative',
  minWidth: 300,
};

const StyleHeader = {
  borderBottom: '1px solid black',
  padding: '10px 20px',
};

const StyleTicket = {
  border: '1px solid black',
  marginBottom: 10,
  padding: 10,
};

const StyleTicketContainer = {
  bottom: 0,
  left: 0,
  overflowY: 'auto',
  padding: 20,
  position: 'absolute',
  right: 0,
  top: 40,
};

class KanbanColumn extends React.Component {
  render() {
    const onCardDetail = this.props.onCardDetail.bind(this);
    const column_index = this.props.index;

    return (
      <div style={StyleContainer}>
        <div style={StyleHeader}>{this.props.column.title}</div>
        <div style={StyleTicketContainer}>
          {
            this.props.column.tickets.map((ticket, card_index) => (
              <div
                onClick={(e) => onCardDetail(e, column_index, card_index)}
                key={`kanban_ticket_${card_index}`}
                style={StyleTicket}>
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
