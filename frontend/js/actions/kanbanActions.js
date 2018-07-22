import axios from 'axios';

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

export function cardDetail(column_index, card_index) {
  return {
    card_index,
    column_index,
    type: 'CARD_DETAIL',
  };
};

export function cardOrder(source, destination) {
  const destination_column_parts = destination.droppableId.split("kanban_column_");
  const destination_column_id = parseInt(destination_column_parts[1]);
  const source_column_parts = source.droppableId.split("kanban_column_");
  const source_column_id = parseInt(source_column_parts[1]);
  return {
    destination_card_index: destination.index,
    destination_column_id,
    source_card_index: source.index,
    source_column_id,
    type: 'CARD_ORDER',
  };
};

export function load(method, url, type_begin, type_success, type_error, data = {}) {
  const params = {
    data,
    method,
    url,
  };
  return dispatch => {
    dispatch(loadBegin(type_begin));
    return axios(params)
      .then(response => {
        return dispatch(loadSuccess(type_success, response.data));
      })
      .catch(error => {
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
