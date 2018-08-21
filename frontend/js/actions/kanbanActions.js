import axios from 'axios';
import history from '../history';

export function cardAdd(kanban_column) {
  return {
    kanban_column,
    type: 'CARD_ADD',
  };
};

export function cardClose() {
  return {
    type: 'CARD_CLOSE',
  };
};

export function cardDetail(card_id, card_revision_id) {
  return {
    card_id,
    card_revision_id,
    type: 'CARD_DETAIL',
  };
};

export function cardMove(source, destination) {
  const destination_column_parts = destination.droppableId.split("kanban_column_");
  const destination_column_id = parseInt(destination_column_parts[1]);
  const source_column_parts = source.droppableId.split("kanban_column_");
  const source_column_id = parseInt(source_column_parts[1]);
  return {
    destination_card_index: destination.index,
    destination_column_id,
    source_card_index: source.index,
    source_column_id,
    type: 'CARD_MOVE',
  };
};

export function load(token, method, url, type_begin, type_success, type_error, data = {}) {
  let params = {
    data,
    method,
    url,
  };
  if (token) {
    params.headers = {
      Authorization: `Token ${token}`
    };
  }
  return dispatch => {
    dispatch(loadBegin(type_begin));
    return axios(params)
      .then(response => {
        return dispatch(loadSuccess(type_success, response.data));
      })
      .catch(error => {
        if (error.response.status === 401) {
          return dispatch(viewLogin());
        }
        return dispatch(loadError(type_error, error));
      });
  };
}

export function loadBegin(type) {
  return {
    type
  };
}

export function loadSuccess(type, json) {
  return {
    type,
    json
  };
}

export function loadError(type, error) {
  return {
    type,
    error
  };
}

export function viewCard(id, revision_id = null) {
  if (revision_id) {
    history.push(`/card/${id}/revision/${revision_id}`);
  } else {
    history.push(`/card/${id}`);
  }
  return {
    type: 'VIEW_CARD'
  };
}

export function viewIndex() {
  history.push('/');
  return {
    type: 'VIEW_INDEX'
  };
}

export function viewLogin() {
  history.push('/auth/login');
  return {
    type: 'VIEW_LOGIN'
  };
}
