import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from "react-redux";
import Dashboard from './components/Dashboard.js';
import Header from './components/Header.js';
import Kanban from './components/Kanban.js';
import Loading from './components/Loading.js';
import Login from './components/Login.js';
import history from './history'
import { store } from "./store";

import { Router, Route, Switch } from 'react-router-dom'

const AuthView = ({ match }) => (
  <div>
    <Login />
  </div>
);

const DashboardView = ({ match }) => (
  <div>
    <Dashboard />
  </div>
);

const NotFoundView = ({ match }) => (
  <div>Page not found.</div>
);

const KanbanView = ({ match }) => (
  <div>
    <Header />
    <Kanban
      card_id={match.params.card_id || null}
      card_revision_id={match.params.card_revision_id || null}
      kanban_column_id={match.params.kanban_column_id || null}
      path={match.path}
      slug={match.params.project_slug}
    />
  </div>
);

const app = (
  <Router history={history}>
    <Provider store={store}>
      <React.Fragment>
        <Switch>
          <Route exact path='/' component={DashboardView}/>
          <Route exact path='/auth/login' component={AuthView}/>
          <Route exact path='/:project_slug' component={KanbanView}/>
          <Route exact path='/:project_slug/add/:kanban_column_id' component={KanbanView}/>
          <Route exact path='/:project_slug/card/:card_id' component={KanbanView}/>
          <Route exact path='/:project_slug/card/:card_id/revision/:card_revision_id' component={KanbanView}/>
          <Route component={NotFoundView}/>
        </Switch>
        <Loading />
      </React.Fragment>
    </Provider>
  </Router>
);

ReactDOM.render(app, document.getElementById('root'));
