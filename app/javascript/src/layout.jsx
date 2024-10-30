// layout.jsx
import React from 'react';
import { handleErrors } from '@utils/fetchHelper';

class Layout extends React.Component {
  state = {
    userCheck: null,
  };

  componentDidMount() {
    fetch('/api/current_user')
      .then(handleErrors)
      .then(data => {
        if (data.user) {
          console.log("Fetched user:", data.user);
          this.setState({ userCheck: data.user });
        } else {
          console.error("No user data returned from /api/current_user");
        }
      })
      .catch(error => console.error('Error fetching current user:', error));
  }

  handleLogout = () => {
    fetch('/api/logout', {
      method: 'DELETE',
      headers: {
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
    })
    .then(response => {
      if (response.ok) {
        window.location.href = '/';
      } else {
        console.error('Error logging out');
      }
    })
    .catch(error => console.error('Logout request failed:', error));
  };

  render() {
    const { userCheck } = this.state;

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
                {userCheck ? (
                  <>
                    <li className="nav-item">
                      <span className="nav-link">Hi, <b>{userCheck.username}</b></span>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/profile">Profile</a>
                    </li>
                    <li className="nav-item">
                      <button className="nav-link btn btn-link" onClick={this.handleLogout}>Logout</button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="nav-item">
                      <a className="nav-link" href="/new">List on Airbnb</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/login">Login</a>
                    </li>
                    <li className="nav-item">
                      <a className="nav-link" href="/signup">Sign Up</a>
                    </li>
                  </>
                )}
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
