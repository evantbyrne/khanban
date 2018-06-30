import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import Kanban from './components/Kanban.js';
import { store } from "./store";

const app = (
  <Provider store={store}>
    <Kanban />
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
