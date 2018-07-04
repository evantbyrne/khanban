import React from 'react';
import { connect } from 'react-redux';
import { ticketAdd } from '../actions/kanbanActions';
import Tag from './Tag';

class CardDetail extends React.Component {
  constructor(props) {
    super(props);

    this.onCancel = this.onCancel.bind(this);
    this.onEdit = this.onEdit.bind(this);

    this.state = {
      is_editing: false,
    };
  }

  componentWillReceiveProps(newProps) {
    this.setState({
      is_editing: false,
    });
  }

  mutate(event, key) {
    const obj = {};
    obj[key] = event.target.value;
    this.setState(obj);
  }

  onCancel(event) {
    event.preventDefault();

    this.setState({
      is_editing: false,
    });
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
          <input className="CardDetail_field"
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
        {(!this.state.is_editing && (
          <React.Fragment>
            <button className="CardDetail_button" onClick={this.onEdit}>Edit Card</button>
            <button className="CardDetail_button -secondary">Archive Card</button>
          </React.Fragment>
        )) || (
          <React.Fragment>
            <button className="CardDetail_button">Save</button>
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
  };
}

function mapDispatchToProps(dispatch) {
  return {};
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CardDetail);
