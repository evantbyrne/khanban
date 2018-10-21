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

export function isLoading(is_loading) {
  return {
    is_loading,
    type: 'IS_LOADING',
  };
};

export function load(token, method, url, type_begin = null, type_success = null, type_error = null, data = {}) {
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
    dispatch(loadBegin('AJAX_BEGIN'));
    if (type_begin) {
      dispatch(loadBegin(type_begin));
    }

    return axios(params)
      .then(response => {
        dispatch(loadBegin('AJAX_END'));
        if (type_success) {
          dispatch(loadSuccess(type_success, response.data));
        }
      })
      .catch(error => {
        if (error.response.status === 401) {
          dispatch(loadBegin('AJAX_END'));
          return dispatch(viewLogin());
        }
        dispatch(loadError('AJAX_ERROR', error));
        if (type_error) {
          dispatch(loadError(type_error, error));
        }
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

export function projectSlug(slug) {
  return {
    slug,
    type: 'PROJECT_SLUG',
  };
};

export function viewCard(project_slug, id, revision_id = null) {
  if (revision_id) {
    history.push(`/${project_slug}/card/${id}/revision/${revision_id}`);
  } else {
    history.push(`/${project_slug}/card/${id}`);
  }
  return {
    type: 'VIEW_CARD'
  };
}

export function viewCardAdd(project_slug, kanban_column_id) {
  history.push(`/${project_slug}/add/${kanban_column_id}`);
  return {
    type: 'VIEW_CARD_ADD'
  };
}

export function viewDashboard() {
  history.push("/");
  return {
    type: 'VIEW_DASHBOARD'
  };
}

export function viewIndex(project_slug) {
  history.push(`/${project_slug}`);
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
