import { combineReducers, createStore } from "redux";
import kanbanReducer from "./reducers/kanbanReducer";

const reducers = combineReducers({
  kanban: kanbanReducer,
});

export const store = createStore(reducers);
