import { applyMiddleware, combineReducers, createStore } from "redux";
import thunk from 'redux-thunk';
import kanbanReducer from "./reducers/kanbanReducer";

const reducers = combineReducers({
  kanban: kanbanReducer,
});

export const store = createStore(reducers, applyMiddleware(thunk));
