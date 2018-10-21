import React from 'react';
import { connect } from 'react-redux';
import { Link } from "react-router-dom";
import { load } from '../actions/kanbanActions';
import ContextMenu from './ContextMenu';
import ContextMenuLink from './ContextMenuLink';

class Dashboard extends React.Component {
  state = {
    context_menu: null,
    current_project: null,
    title_error: false
  };

  componentDidMount() {
    this.props.load(this.props.token);
  }

  onArchive = (event, project) => {
    event.preventDefault();

    this.props.onArchive(this.props.token, project)

    this.setState({
      context_menu: null
    });
  };

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

  onContextMenu = (event, project_slug) => {
    event.preventDefault();
    this.setState({
      context_menu: this.state.context_menu === project_slug ? null : project_slug
    });
  };

  onEdit = (event, current_project) => {
    event.preventDefault();
    this.setState({
      context_menu: null,
      current_project
    });
  };

  onSave = (event) => {
    event.preventDefault();

    const project = this.state.current_project;

    if (!project || !project.title) {
      this.setState({
        title_error: true
      });
      return;
    }

    if (project.slug === null) {
      this.props.onCreate(this.props.token, project);
    } else {
      this.props.onUpdate(this.props.token, project);
    }

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
        <div className="Dashboard_column" id="Dashboard_projects">
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
                <Link className="Dashboard_card-link"
                  to={`/${project.slug}`}>{project.title}</Link>
                <a className="Dashboard_card-context-link"
                  href="#"
                  id="Dashboard_project-archive"
                  onClick={e => this.onContextMenu(e, project.slug)}>
                  {this.state.context_menu === project.slug ? "↑" : "↓"}
                </a>
                {this.state.context_menu === project.slug && (
                  <ContextMenu right={-10} top={30}>
                    <ContextMenuLink id={`ContextMenu_project-edit_${project.slug}`} onClick={e => this.onEdit(e, project)}>Edit</ContextMenuLink>
                    <ContextMenuLink id={`ContextMenu_project-archive_${project.slug}`} onClick={e => this.onArchive(e, project)}>Archive</ContextMenuLink>
                  </ContextMenu>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="Dashboard_column" id="Dashboard_users">
          <div className="Dashboard_header">
            Users
          </div>
          <div className="Dashboard_container">
            {this.props.users.map(user => (
              <div key={`Dashboard_user_${user.id}`}
                className="Dashboard_card"
                id={`User_${user.username}`}>
                <React.Fragment>{user.username}</React.Fragment>
                {user.is_staff && (
                  <React.Fragment> (admin)</React.Fragment>
                )}
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
    is_loading: state.kanban.loading_count > 0,
    projects: state.kanban.projects,
    token: state.kanban.token,
    users: state.kanban.users
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
          "LOAD_PROJECTS_SUCCESS"
        )
      );
      dispatch(
        load(
          token,
          'get',
          `/api/users.json`,
          "LOAD_USERS_BEGIN",
          "LOAD_USERS_SUCCESS"
        )
      );
    },

    onArchive: (token, project) => {
      project.is_archived = true;
      dispatch(
        load(
          token,
          'put',
          `/api/projects/${project.slug}.json`,
          null,
          "PROJECT_ARCHIVE_SUCCESS",
          null,
          project
        )
      );
    },

    onCreate: (token, project) => {
      dispatch(
        load(
          token,
          'post',
          `/api/projects.json`,
          null,
          "PROJECT_CREATE_SUCCESS",
          null,
          project
        )
      );
    },

    onUpdate: (token, project) => {
      dispatch(
        load(
          token,
          'put',
          `/api/projects/${project.slug}.json`,
          null,
          "PROJECT_UPDATE_SUCCESS",
          null,
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
