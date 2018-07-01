import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import Header from './components/Header.js';
import Kanban from './components/Kanban.js';
import { store } from "./store";

const app = (
  <Provider store={store}>
    <div>
      <Header />
      <Kanban />
    </div>
  </Provider>
);

ReactDOM.render(app, document.getElementById('root'));
