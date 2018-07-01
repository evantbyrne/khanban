import React from 'react';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';

const StyleContainer = {
  display: 'flex',
  flexDirection: 'row',
  height: '100%',
  overflowX: 'auto',
};

const StyleWrapper = {
  display: 'flex',
  flexDirection: 'row',
  height: 'calc(100vh - 42px)',
};

class Kanban extends React.Component {
  render() {
    return (
      <div style={StyleWrapper}>
        <div style={StyleContainer}>
          {
            this.props.columns.map((column, index) => (
              <KanbanColumn
                column={column}
                index={index}
                key={`kanban_column_${index}`} />
            ))
          }
        </div>
        <CardDetail />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    columns: state.kanban.columns,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanban);
