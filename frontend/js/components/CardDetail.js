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

    const { card, card_revision, project_slug, token } = this.props;

    card.description = card_revision.description;
    card.title = card_revision.title;

    this.props.onArchive(token, project_slug, card);
  }

  onCancel(event) {
    event.preventDefault();

    this.setState({
      is_editing: false,
    });

    if (this.props.card.id === null) {
      this.props.onClose(this.props.project_slug);
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

    const { card, project_slug, token } = this.props;

    card.description = this.state.description;
    card.title = this.state.title;

    if (this.props.card.id === null) {
      this.props.onCreate(token, card);
    } else {
      this.props.onUpdate(token, project_slug, card);
    }
  }

  render() {
    const { card, card_revision, onViewCard, project_slug } = this.props;

    if (card === null) {
      return null;
    }

    const is_latest_revision = card_revision.id === card.card_revisions[0].id;
    const is_loading = !this.state.is_editing || this.props.is_saving;
    const mutate = this.mutate.bind(this);

    return (
      <form className="CardDetail" onSubmit={this.onEdit}>
        {(!this.state.is_editing && (
          <div>
            <label className="CardDetail_revisions">
              <span className="CardDetail_revisions-label">Revision: </span>
              <select
                className="CardDetail_revisions-select"
                onChange={(e) => onViewCard(project_slug, card.id, e.target.value)}
                value={card_revision.id}>
                {card.card_revisions.map(revision => (
                  <option
                    key={revision.id}
                    value={revision.id}>{revision.created_at} by {revision.user.username}</option>
                ))}
              </select>
            </label>
            <div className="CardDetail_title">
              #{card.id} {card_revision.title}
            </div>
          </div>
        )) || (
          <input className={`CardDetail_field ${this.state.title_error ? '-error' : ''}`}
            name="title"
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
            name="description"
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
        {is_loading && is_latest_revision && (
          <React.Fragment>
            <button className="CardDetail_button"
              disabled={this.props.is_saving}
              name="edit"
              onClick={this.onEdit}>Edit Card</button>
            <button className="CardDetail_button -secondary"
              disabled={this.props.is_saving}
              name="archive"
              onClick={this.onArchive}>Archive Card</button>
          </React.Fragment>
        )}
        {!is_loading && is_latest_revision && (
          <React.Fragment>
            <button className="CardDetail_button"
              name="save"
              onClick={this.onSave}>Save</button>
            <button className="CardDetail_button -secondary"
              name="cancel"
              onClick={this.onCancel}>Cancel</button>
          </React.Fragment>
        )}
      </form>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    card: state.kanban.current_card,
    card_revision: state.kanban.current_card_revision,
    is_saving: state.kanban.is_detail_saving,
    project_slug: state.kanban.slug,
    token: state.kanban.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onArchive: (token, project_slug, card) => {
      card.is_archived = true;
      dispatch(viewIndex(project_slug));
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

    onClose: (project_slug) => {
      dispatch(cardClose());
      dispatch(viewIndex(project_slug));
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

    onUpdate: (token, project_slug, card) => {
      dispatch(viewCard(project_slug, card.id));
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

    onViewCard: (project_slug, card_id, card_revision_id) => {
      dispatch(viewCard(project_slug, card_id, card_revision_id));
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);
