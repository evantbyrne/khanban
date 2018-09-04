import Cookies from "js-cookie";

const initialState = {
  current_card: null,
  current_card_revision: null,
  error: null,
  id: 1,
  is_loading: true,
  is_detail_saving: false,
  kanban_columns: [],
  title: null,
  token: Cookies.get("token", null),
  user: null
};

export default function kanbanReducer(state = initialState, action) {
  switch (action.type) {
    case 'CARD_ADD':
      return (() => {
        return Object.assign({}, state, {
          current_card: {
            card_revisions: [
              {
                description: '',
                title: ''
              }
            ],
            id: null,
            kanban_column: action.kanban_column,
          },
          current_card_revision: {
            description: '',
            title: ''
          }
        });
      })();

    case "CARD_ARCHIVE_SUCCESS":
      return (function() {
        const kanban_columns = state.kanban_columns.map((column) => {
          return Object.assign({}, column, {
            cards: column.cards.filter((card) => {
              return !card.is_archived;
            })
          });
        });
        return Object.assign({}, state, {
          current_card: null,
          current_card_revision: null,
          is_detail_saving: false,
          kanban_columns
        });
      })();

    case 'CARD_CLOSE':
      return (() => {
        return Object.assign({}, state, {
          current_card: null,
          current_card_revision: null
        });
      })();

    case 'CARD_DETAIL':
      return (() => {
        const card_id = parseInt(action.card_id);
        const card_revision_id = parseInt(action.card_revision_id);
        let current_card = null;
        state.kanban_columns.map(column => {
          column.cards.map(card => {
            if (card.id === card_id) {
              current_card = card;
            }
          });
        });
        const current_card_revision = (action.card_revision_id
          ? current_card.card_revisions.find(revision => (revision.id === card_revision_id))
          : current_card.card_revisions[0]);
        return Object.assign({}, state, {
          current_card,
          current_card_revision
        });
      })();

    case "CARD_CREATE_BEGIN":
      return (function() {
        return Object.assign({}, state, {
          is_detail_saving: true
        });
      })();

    case "CARD_CREATE_ERROR":
      return (function() {
        console.log("ERROR", action.error);
        return Object.assign({}, state, {
          error: action.error,
          is_detail_saving: false
        });
      })();

    case "CARD_CREATE_SUCCESS":
      return (function() {
        const kanban_columns = state.kanban_columns.map((column) => {
          if (column.id === action.json.kanban_column) {
            column.cards.unshift(action.json);
            return Object.assign({}, column, {
              cards: column.cards.slice()
            });
          }
          return column;
        });
        return Object.assign({}, state, {
          current_card: null,
          is_detail_saving: false,
          kanban_columns
        });
      })();

    case 'CARD_MOVE':
      return (() => {
        let card = null;
        const kanban_columns = state.kanban_columns.map((column, column_index) => {
          // Remove card from old spot.
          if (column.id === action.source_column_id) {
            [card] = column.cards.splice(action.source_card_index, 1);
          }
          return Object.assign({}, column);
        }).map((column, column_index) => {
          // Insert card into new spot.
          if (card !== null && column.id === action.destination_column_id) {
            column.cards.splice(action.destination_card_index, 0, card);
          }
          return Object.assign({}, column);
        });
        return Object.assign({}, state, {
          kanban_columns
        });
      })();

    case "CARD_UPDATE_BEGIN":
      return (function() {
        return Object.assign({}, state, {
          is_detail_saving: true
        });
      })();

    case "CARD_UPDATE_ERROR":
      return (function() {
        console.log("ERROR", action.error);
        return Object.assign({}, state, {
          error: action.error,
          is_detail_saving: false
        });
      })();

    case "CARD_UPDATE_SUCCESS":
      return (function() {
        let current_card = null;
        const kanban_columns = state.kanban_columns.map((column) => {
          return Object.assign({}, column, {
            cards: column.cards.map((card) => {
              if (card.id == action.json.id) {
                current_card = action.json;
                return action.json;
              }
              return card;
            })
          });
        });
        return Object.assign({}, state, {
          current_card: state.current_card ? current_card : null,
          is_detail_saving: false,
          kanban_columns
        });
      })();

    case "LOAD_KANBAN_BEGIN":
      return (function() {
        return Object.assign({}, state, {
          is_loading: true
        });
      })();

    case "LOAD_KANBAN_ERROR":
      return (function() {
        console.log("ERROR", action.error);
        return Object.assign({}, state, {
          error: action.error,
          is_loading: false
        });
      })();

    case "LOAD_KANBAN_SUCCESS":
      return (function() {
        return Object.assign({}, state, {
          is_loading: false,
          kanban_columns: action.json.kanban_columns,
          title: action.json.title,
          user: action.json.user
        });
      })();

    case "LOGIN_BEGIN":
      return (function() {
        return Object.assign({}, state, {
          is_loading: true
        });
      })();

    case "LOGIN_ERROR":
      return (function() {
        let error = null
        if (action.error.response.data && action.error.response.data.non_field_errors) {
          error = action.error.response.data.non_field_errors;
        } else {
          error = action.error;
        }
        alert(error);
        console.log("ERROR", action.error);
        return Object.assign({}, state, {
          error,
          is_loading: false
        });
      })();

    case "LOGIN_SUCCESS":
      return (function() {
        Cookies.set("token", action.json.token)
        return Object.assign({}, state, {
          is_loading: false,
          token: action.json.token
        });
      })();

    case "ORDER_KANBAN_SUCCESS":
      return (function() {
        return Object.assign({}, state, {
          is_loading: false
        });
      })();

    case "VIEW_LOGIN":
      return (function() {
        return Object.assign({}, state, {
          token: null
        });
      })();
  }

  return state;
}