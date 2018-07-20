const initialState = {
  current_card: null,
  error: null,
  id: 1,
  is_loading: true,
  is_detail_saving: false,
  kanban_columns: []
};

export default function kanbanReducer(state = initialState, action) {
  switch (action.type) {
    case 'CARD_ADD':
      return (() => {
        return Object.assign({}, state, {
          current_card: {
            id: null,
            kanban_column: action.kanban_column
          }
        });
      })();

    case 'CARD_CLOSE':
      return (() => {
        return Object.assign({}, state, {
          current_card: null
        });
      })();

    case 'CARD_DETAIL':
      return (() => {
        const current_card = state.kanban_columns[action.column_index].cards[action.card_index];
        return Object.assign({}, state, {
          current_card
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
        const kanban_columns = state.kanban_columns.map((column) => {
          return Object.assign({}, column, {
            cards: column.cards.map((card) => {
              if (card.id == action.json.id) {
                return action.json;
              }
              return card;
            })
          });
        });
        return Object.assign({}, state, {
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
          kanban_columns: action.json.kanban_columns
        });
      })();
  }

  return state;
}