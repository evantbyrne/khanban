import React from 'react';
import { connect } from 'react-redux';

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
    return (
      <div style={StyleContainer}>
        <div style={StyleHeader}>{this.props.column.title}</div>
        <div style={StyleTicketContainer}>
          {
            this.props.column.tickets.map((ticket, index) => (
              <div key={`kanban_ticket_${index}`} style={StyleTicket}>
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
    column: ownProps.column,
    index: ownProps.index,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(KanbanColumn);
