const initialState = {
  current_card: null,
  id: 1,
  is_loading: true,
  kanban_columns: []
};

export default function kanbanReducer(state = initialState, action) {
  switch (action.type) {
    case 'CARD_DETAIL':
      return (() => {
        const current_card = state.kanban_columns[action.column_index].cards[action.card_index];
        return Object.assign({}, state, {
          current_card
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