import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import Header from './components/Header.js';
import Kanban from './components/Kanban.js';
import Login from './components/Login.js';
import history from './history'
import { store } from "./store";

import { Router, Route, Switch } from 'react-router-dom'

const AuthView = ({ match }) => (
  <div>
    <Login />
  </div>
);

const KanbanView = ({ match }) => (
  <div>
    <Header />
    <Kanban
      card_id={match.params.card_id || null}
      card_revision_id={match.params.card_revision_id || null}
    />
  </div>
);

const app = (
  <Router history={history}>
    <Provider store={store}>
      <Switch>
        <Route exact path='/' component={KanbanView}/>
        <Route exact path='/card/:card_id' component={KanbanView}/>
        <Route exact path='/card/:card_id/revision/:card_revision_id' component={KanbanView}/>
        <Route path='/auth/login' component={AuthView}/>
      </Switch>
    </Provider>
  </Router>
);

ReactDOM.render(app, document.getElementById('root'));
