import React from 'react';
import { DragDropContext } from 'react-beautiful-dnd';
import { connect } from 'react-redux';
import CardDetail from './CardDetail';
import KanbanColumn from './KanbanColumn';
import { cardAdd, cardDetail, cardMove, load, projectSlug } from '../actions/kanbanActions';

class Kanban extends React.Component {
  static getDerivedStateFromProps(props, state) {
    if (!props.is_loading) {

      if (props.kanban_column_id && (props.current_card === null || props.current_card.id !== null)) {
        props.onCardAdd(props.kanban_column_id);

      } else if (props.card_id) {
        const card_revision_id = (props.current_card_revision && props.current_card_revision.id) || 0;
        if (!props.current_card
          || props.current_card.id != props.card_id
          || card_revision_id != props.card_revision_id) {
          props.onCardDetail(props.card_id, props.card_revision_id);
        }
      }
    }

    return state;
  }

  state = {};

  componentDidMount() {
    this.props.load(this.props.token, this.props.slug);
  }

  onDragEnd(result) {
    if(!result.destination) {
       return;
    }

    this.props.onCardMove(result.source, result.destination);
    this.props.onOrder(this.props.token, this.props.slug, this.props.columns);
  }

  render() {
    const onDragEnd = this.onDragEnd.bind(this);
    const is_editing = (this.props.current_card !== null && this.props.current_card.id === null);
    return (
      <div className={`Kanban ${this.props.current_card ? '-card-detail' : ''}`}>
        <div className="Kanban_container">
          <DragDropContext onDragEnd={onDragEnd}>
            {
              this.props.columns.map((column, index) => (
                <KanbanColumn
                  column={column}
                  index={index}
                  key={`kanban_column_${index}`} />
              ))
            }
          </DragDropContext>
        </div>
        <CardDetail is_editing={is_editing} />
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    columns: state.kanban.kanban_columns,
    current_card: state.kanban.current_card,
    current_card_revision: state.kanban.current_card_revision,
    is_loading: state.kanban.is_loading,
    token: state.kanban.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: function(token, slug) {
      dispatch(projectSlug(slug));
      dispatch(
        load(
          token,
          'get',
          `/api/kanbans/${slug}.json`,
          "LOAD_KANBAN_BEGIN",
          "LOAD_KANBAN_SUCCESS",
          "LOAD_KANBAN_ERROR"
        )
      );
    },

    onCardAdd: (kanban_column) => {
      dispatch(cardAdd(kanban_column));
    },

    onCardDetail: (card_id, card_revision_id) => {
      dispatch(cardDetail(card_id, card_revision_id));
    },

    onCardMove: (source, destination) => {
      dispatch(cardMove(source, destination));
    },

    onOrder: (token, slug, kanban_columns) => {
      const data = {
        kanban_columns,
        slug
      };
      dispatch(
        load(
          token,
          'put',
          `/api/kanbans/${slug}/order.json`,
          "LOAD_KANBAN_BEGIN",
          "ORDER_KANBAN_SUCCESS",
          "LOAD_KANBAN_ERROR",
          data
        )
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Kanban);
