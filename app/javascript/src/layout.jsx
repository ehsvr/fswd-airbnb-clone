// layout.js
import React from 'react';
import { handleErrors } from '@utils/fetchHelper';

class Layout extends React.Component {
  state = {
    user: null,
  }

  componentDidMount() {
    // Fetch current user information to determine if the user is logged in
    fetch('/api/current_user')
      .then(handleErrors)
      .then(data => {
        this.setState({ user: data.user });
      });
  }

  render() {
    const { user } = this.state;

    return (
      <React.Fragment>
        <nav className="navbar navbar-expand navbar-light bg-light">
          <div className="container-fluid">
            <a className="navbar-brand text-danger" href="/">Airbnb</a>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto">
                <li className="nav-item">
                  <a className="nav-link" href="/">Home</a>
                </li>
              </ul>
              <ul className="navbar-nav ms-auto">
                    <li className="nav-item">
                      <a className="nav-link" href="/new">List on Airbnb</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/login">Login</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/signup">Sign Up</a>
                    </li>
              </ul>
            </div>
          </div>
        </nav>
        {this.props.children}
        <footer className="p-3 bg-light">
          <div>
            <p className="me-3 mb-0 text-secondary">Airbnb Clone</p>
          </div>
        </footer>
      </React.Fragment>
    );
  }
}

export default Layout;
