import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout'; // Assuming Layout is shared across pages
import { handleErrors } from '@utils/fetchHelper';
import './property.scss';

class EditProperty extends React.Component {
  state = {
    property: {},
    loading: true,
  };

  componentDidMount() {
    // Fetch the property to edit based on the property ID
    const propertyId = this.props.property_id;

    fetch(`/api/properties/${propertyId}`)
      .then(handleErrors)
      .then(data => {
        this.setState({
          property: data.property,
          loading: false,
        });
      });
  }

  handleUpdate = (event) => {
    event.preventDefault();
    const { property } = this.state;

    fetch(`/api/properties/${property.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRF-Token': document.querySelector('meta[name="csrf-token"]').getAttribute('content'),
      },
      body: JSON.stringify({ property }),
    })
      .then(response => {
        if (response.ok) {
          window.location.href = `/property/${property.id}`;
        } else {
          console.error('Error updating property');
        }
      });
  };

  render() {
    const { property, loading } = this.state;

    if (loading) {
      return <p>Loading...</p>;
    }

    return (
      <Layout>
        <div className="container">
          <h1>Edit Property</h1>
          <form onSubmit={this.handleUpdate}>
            <div className="mb-3">
              <label htmlFor="title" className="form-label">Title</label>
              <input
                type="text"
                id="title"
                value={property.title}
                onChange={(e) => this.setState({ property: { ...property, title: e.target.value } })}
                className="form-control"
              />
            </div>
            {/* Other form fields for editing property */}
            <button type="submit" className="btn btn-primary">Update Property</button>
          </form>
        </div>
      </Layout>
    );
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const propertyId = document.getElementById('edit-property-root').dataset.propertyId;
  ReactDOM.render(<EditProperty property_id={propertyId} />, document.getElementById('edit-property-root'));
});
