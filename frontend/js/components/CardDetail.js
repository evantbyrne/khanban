import React from 'react';
import { connect } from 'react-redux';
import { cardClose, cardEditing, load } from '../actions/kanbanActions';
import Tag from './Tag';

class CardDetail extends React.Component {
  constructor(props) {
    super(props);

    this.onArchive = this.onArchive.bind(this);
    this.onCancel = this.onCancel.bind(this);
    this.onEdit = this.onEdit.bind(this);
    this.onSave = this.onSave.bind(this);

    this.state = {
      is_editing: props.is_editing || false,
      title_error: false
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      is_editing: newProps.is_editing || false,
      title_error: false
    });
  }

  mutate(event, key) {
    const obj = {};
    obj[key] = event.target.value;
    obj[`${key}_error`] = false;
    this.setState(obj);
  }

  onArchive(event) {
    event.preventDefault();

    const { card } = this.props;

    this.props.onArchive(card);
  }

  onCancel(event) {
    event.preventDefault();

    this.setState({
      is_editing: false,
    });

    if (this.props.card.id === null) {
      this.props.onClose();
    }
  }

  onEdit(event) {
    event.preventDefault();

    const { card } = this.props;

    this.setState({
      description: card.description,
      is_editing: true,
      title: card.title,
    });
  }

  onSave(event) {
    event.preventDefault();

    if (!this.state.title) {
      this.setState({
        title_error: true
      });
      return;
    }

    const { card } = this.props;

    card.description = this.state.description;
    card.title = this.state.title;

    if (this.props.card.id === null) {
      this.props.onCreate(card);
    } else {
      this.props.onUpdate(card);
    }
  }

  render() {
    const { card } = this.props;
    const mutate = this.mutate.bind(this);

    if (card === null) {
      return null;
    }

    return (
      <div className="CardDetail">
        {(!this.state.is_editing && (
          <div className="CardDetail_title">
            #{card.id} {card.title}
          </div>
        )) || (
          <input className={`CardDetail_field ${this.state.title_error ? '-error' : ''}`}
            onChange={(e) => mutate(e, 'title')}
            placeholder="Title..."
            value={this.state.title} />
        )}
        {!this.state.is_editing && card.description && (
          <div className="CardDetail_description">
            {card.description}
          </div>
        )}
        {this.state.is_editing && (
          <textarea className="CardDetail_field -text"
            onChange={(e) => mutate(e, 'description')}
            placeholder="Description..."
            value={this.state.description} />
        )}
        {card.tags && card.tags.length > 0 && (
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
        {((!this.state.is_editing || this.props.is_saving) && (
          <React.Fragment>
            <button className="CardDetail_button"
              disabled={this.props.is_saving}
              onClick={this.onEdit}>Edit Card</button>
            <button className="CardDetail_button -secondary"
              disabled={this.props.is_saving}
              onClick={this.onArchive}>Archive Card</button>
          </React.Fragment>
        )) || (
          <React.Fragment>
            <button className="CardDetail_button" onClick={this.onSave}>Save</button>
            <button className="CardDetail_button -secondary" onClick={this.onCancel}>Cancel</button>
          </React.Fragment>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    card: state.kanban.current_card,
    is_saving: state.kanban.is_detail_saving
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onArchive: (card) => {
      card.is_archived = true;
      dispatch(
        load(
          'put',
          `/api/cards/${card.id}.json`,
          "CARD_UPDATE_BEGIN",
          "CARD_ARCHIVE_SUCCESS",
          "CARD_UPDATE_ERROR",
          card
        )
      );
    },

    onClose: () => {
      dispatch(cardClose());
    },

    onCreate: (card) => {
      dispatch(
        load(
          'post',
          `/api/cards.json`,
          "CARD_CREATE_BEGIN",
          "CARD_CREATE_SUCCESS",
          "CARD_CREATE_ERROR",
          card
        )
      );
    },

    onUpdate: (card) => {
      dispatch(
        load(
          'put',
          `/api/cards/${card.id}.json`,
          "CARD_UPDATE_BEGIN",
          "CARD_UPDATE_SUCCESS",
          "CARD_UPDATE_ERROR",
          card
        )
      );
    },
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);
