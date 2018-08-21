import React from 'react';
import { connect } from 'react-redux';
import { cardClose, cardEditing, load, viewCard, viewIndex } from '../actions/kanbanActions';
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
      description: newProps.card ? newProps.card_revision.description : this.state.description,
      is_editing: newProps.is_editing || false,
      title: newProps.card ? newProps.card_revision.title: this.state.title,
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

    const { card, card_revision, token } = this.props;

    card.description = card_revision.description;
    card.title = card_revision.title;

    this.props.onArchive(token, card);
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

    const { card, card_revision } = this.props;

    this.setState({
      description: card_revision.description,
      is_editing: true,
      title: card_revision.title,
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

    const { card, token } = this.props;

    card.description = this.state.description;
    card.title = this.state.title;

    if (this.props.card.id === null) {
      this.props.onCreate(token, card);
    } else {
      this.props.onUpdate(token, card);
    }
  }

  render() {
    const { card, card_revision, onViewCard } = this.props;
    const mutate = this.mutate.bind(this);

    if (card === null) {
      return null;
    }

    return (
      <div className="CardDetail">
        {(!this.state.is_editing && (
          <div>
            <label className="CardDetail_revisions">
              <span className="CardDetail_revisions-label">Revision: </span>
              <select
                className="CardDetail_revisions-select"
                onChange={(e) => onViewCard(card.id, e.target.value)}
                value={card_revision.id}>
                {card.card_revisions.map(revision => (
                  <option
                    key={revision.id}
                    value={revision.id}>{revision.created_at}</option>
                ))}
              </select>
            </label>
            <div className="CardDetail_title">
              #{card.id} {card_revision.title}
            </div>
          </div>
        )) || (
          <input className={`CardDetail_field ${this.state.title_error ? '-error' : ''}`}
            onChange={(e) => mutate(e, 'title')}
            placeholder="Title..."
            value={this.state.title} />
        )}
        {!this.state.is_editing && card_revision.description && (
          <div className="CardDetail_description">
            {card_revision.description}
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
    card_revision: state.kanban.current_card_revision,
    is_saving: state.kanban.is_detail_saving,
    token: state.kanban.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onArchive: (token, card) => {
      card.is_archived = true;
      dispatch(viewIndex());
      dispatch(
        load(
          token,
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

    onCreate: (token, card) => {
      dispatch(
        load(
          token,
          'post',
          `/api/cards.json`,
          "CARD_CREATE_BEGIN",
          "CARD_CREATE_SUCCESS",
          "CARD_CREATE_ERROR",
          card
        )
      );
    },

    onUpdate: (token, card) => {
      dispatch(
        load(
          token,
          'put',
          `/api/cards/${card.id}.json`,
          "CARD_UPDATE_BEGIN",
          "CARD_UPDATE_SUCCESS",
          "CARD_UPDATE_ERROR",
          card
        )
      );
    },

    onViewCard: (card_id, card_revision_id) => {
      dispatch(viewCard(card_id, card_revision_id));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);
