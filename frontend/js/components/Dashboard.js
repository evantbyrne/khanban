import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { load } from '../actions/kanbanActions';

class Dashboard extends React.Component {
  state = {
    current_project: null,
    title_error: false
  };

  componentDidMount() {
    this.props.load(this.props.token);
  }

  onCancel = (event) => {
    event.preventDefault();
    this.setState({
      current_project: null,
      title_error: false
    });
  };

  onChangeTitle = (event) => {
    const current_project = Object.assign({}, this.state.current_project, {
      title: event.target.value
    });
    this.setState({
      current_project,
      title_error: false
    })
  };

  onSave = (event) => {
    event.preventDefault();

    if (!this.state.current_project || !this.state.current_project.title) {
      this.setState({
        title_error: true
      });
      return;
    }

    this.props.onCreate(this.props.token, this.state.current_project);

    this.setState({
      current_project: null
    });
  };

  onViewProjectAdd = (event) => {
    event.preventDefault();
    this.setState({
      current_project: {
        id: null,
        slug: null,
        title: ""
      },
      title_error: false
    });
  };

  render() {
    if (this.props.is_loading) {
      return null;
    }

    return (
      <div className="Dashboard">
        <div className="Dashboard_column">
          <div className="Dashboard_header">
            Projects
            <a
              className="Dashboard_header-add"
              href="#"
              onClick={this.onViewProjectAdd}>+</a>
          </div>
          <div className="Dashboard_container">
            {this.props.projects.map(project => (
              <div key={`Dashboard_project_${project.id}`}
                className="Dashboard_card"
                id={`Project_${project.slug}`}>
                <Link to={`/${project.slug}`}>{project.title}</Link>
              </div>
            ))}
          </div>
        </div>
        {this.state.current_project && (
          <form className="CardDetail" onSubmit={this.onSave}>
            <input className={`CardDetail_field ${this.state.title_error ? '-error' : ''}`}
              name="title"
              onChange={this.onChangeTitle}
              placeholder="Title..."
              value={this.state.current_project.title}/>
            <button className="CardDetail_button"
              name="save"
              onClick={this.onSave}>Save</button>
            <button className="CardDetail_button -secondary"
              name="cancel"
              onClick={this.onCancel}>Cancel</button>
          </form>
        )}
      </div>
    );
  }
}

function mapStateToProps(state, ownProps) {
  return {
    is_loading: state.kanban.is_loading,
    projects: state.kanban.projects,
    token: state.kanban.token
  };
}

function mapDispatchToProps(dispatch) {
  return {
    load: function(token) {
      dispatch(
        load(
          token,
          'get',
          `/api/projects.json`,
          "LOAD_PROJECTS_BEGIN",
          "LOAD_PROJECTS_SUCCESS",
          "LOAD_KANBAN_ERROR"
        )
      );
    },

    onCreate: (token, project) => {
      dispatch(
        load(
          token,
          'post',
          `/api/projects.json`,
          "PROJECT_CREATE_BEGIN",
          "PROJECT_CREATE_SUCCESS",
          "PROJECT_CREATE_ERROR",
          project
        )
      );
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
