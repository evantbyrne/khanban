export function cardDetail(column_index, card_index) {
  return {
    card_index,
    column_index,
    type: 'CARD_DETAIL',
  };
};

export function load(url, type_begin, type_success, type_error) {
  return dispatch => {
    dispatch(loadBegin(type_begin));
    return fetch(url)
      .then(handleHttpErrors)
      .then(response => response.json())
      .then(json => {
        return dispatch(loadSuccess(type_success, json));
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

// Handle HTTP errors since fetch won't.
function handleHttpErrors(response) {
  if (!response.ok) {
    throw Error(response.statusText);
  }
  return response;
}
