import React from 'react';
import { connect } from 'react-redux';
import { ticketAdd } from '../actions/kanbanActions';
import Tag from './Tag';

class CardDetail extends React.Component {
  render() {
    const { card } = this.props;

    if (card === null) {
      return null;
    }

    return (
      <div className="CardDetail">
        <div className="CardDetail_title">
          #{card.id} {card.title}
        </div>
        {card.description && (
          <div className="CardDetail_description">
            {card.description}
          </div>
        )}
        {card.tags.length > 0 && (
          <div className="CardDetail_tags">
            {
              card.tags.map((tag, index) => (
                <Tag
                  index={index}
                  key={`tag_${index}`}
                  tag={tag} />
              ))
            }
          </div>
        )}
        <button className="CardDetail_button">Edit Card</button>
        <button className="CardDetail_button -secondary">Archive Card</button>
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
