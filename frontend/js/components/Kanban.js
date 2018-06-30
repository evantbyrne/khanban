import React from 'react';
import { connect } from 'react-redux';
import { ticketAdd } from '../actions/kanbanActions';

const StyleContainer = {
  display: 'flex',
  flexDirection: 'column',
  maxWidth: 300,
};

const StyleTicket = {
  border: '1px solid #333',
  borderRadius: 5,
  marginBottom: 5,
  padding: 3,
};

class Kanban extends React.Component {
  onTicketAdd(event) {
    event.preventDefault();
    this.props.ticketAdd();
  }

  render() {
    const onTicketAdd = this.onTicketAdd.bind(this);

    return (
      <div>
        <button onClick={onTicketAdd}>Add Ticket</button>
        <div style={StyleContainer}>
          {
            this.props.tickets.map((ticket, index) => (
              <div key={`ticket_${index}`} style={StyleTicket}>
                {ticket.title}
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
    tickets: state.kanban.tickets,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    ticketAdd: () => dispatch(ticketAdd()),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanban);
