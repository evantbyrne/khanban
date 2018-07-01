import React from 'react';
import { connect } from 'react-redux';
import { ticketAdd } from '../actions/kanbanActions';
import Tag from './Tag';

const StyleButton = {
  appearance: 'none',
  background: 'white',
  border: '1px solid black',
  borderRadius: 3,
  display: 'block',
  fontSize: 16,
  margin: '20px 60px 10px',
  padding: '12px',
  cursor: 'pointer',
  textAlign: 'center',
  width: 'calc(100% - 120px)',
};

const StyleButtonSecondary = {
  appearance: 'none',
  background: 'black',
  border: '0',
  borderRadius: 3,
  color: 'white',
  display: 'block',
  fontSize: 16,
  margin: '10px 60px',
  padding: '12px',
  cursor: 'pointer',
  textAlign: 'center',
  width: 'calc(100% - 120px)',
};

const StyleContainer = {
  borderLeft: '3px solid black',
  borderTop: '2px solid black',
  height: '100%',
  marginLeft: 'auto',
  minWidth: 500,
  overflowY: 'auto',
};

const StyleDescription = {
  borderBottom: '1px solid black',
  padding: 20,
};

const StyleTags = {
  borderBottom: '1px solid black',
  display: 'flex',
  flexDirection: 'row',
  padding: 20,
};

const StyleTitle = {
  borderBottom: '1px solid black',
  fontSize: 24,
  padding: 20,
};

class CardDetail extends React.Component {
  render() {
    if (this.props.card === null) {
      return null;
    }

    return (
      <div style={StyleContainer}>
        <div style={StyleTitle}>
          #{this.props.card.id} {this.props.card.title}
        </div>
        <div style={StyleDescription}>
          {this.props.card.description}
        </div>
        <div style={StyleTags}>
          {
            this.props.card.tags.map((tag, index) => (
              <Tag
                index={index}
                key={`tag_${index}`}
                tag={tag} />
            ))
          }
        </div>
        <button style={StyleButton}>Edit Card</button>
        <button style={StyleButtonSecondary}>Archive Card</button>
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    card: state.kanban.current_card,
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);
