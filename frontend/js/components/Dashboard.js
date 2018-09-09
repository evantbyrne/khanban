import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { load } from '../actions/kanbanActions';

class Dashboard extends React.Component {
  componentDidMount() {
    this.props.load(this.props.token);
  }

  render() {
    if (this.props.is_loading) {
      return null;
    }

    return (
      <div className="Dashboard">
        <div className="Dashboard_header">Projects</div>
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
    }
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Dashboard);
