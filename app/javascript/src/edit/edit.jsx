import React from 'react';
import ReactDOM from 'react-dom';
import Layout from '@src/layout';
import { handleErrors } from '@utils/fetchHelper';
import '../property/property.scss';

class EditProperty extends React.Component {
  state = {
    property: {
      title: '',
      description: '',
      city: '',
      country: '',
      property_type: '',
      price_per_night: 0,
      max_guests: 0,
      bedrooms: 0,
      beds: 0,
      baths: 0,
    },
    loading: true,
  };

  componentDidMount() {
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

  handleChange = (e) => {
    const { name, value } = e.target;
    this.setState({
      property: {
        ...this.state.property,
        [name]: name === 'price_per_night' || name === 'max_guests' || name === 'bedrooms' || name === 'beds' || name === 'baths'
          ? parseInt(value) || 0  
          : value,
      },
    });
  };

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
                name="title"
                value={property.title}
                onChange={this.handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                id="description"
                name="description"
                value={property.description}
                onChange={this.handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="city" className="form-label">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={property.city}
                onChange={this.handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="country" className="form-label">Country</label>
              <input
                type="text"
                id="country"
                name="country"
                value={property.country}
                onChange={this.handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="property_type" className="form-label">Property Type</label>
              <input
                type="text"
                id="property_type"
                name="property_type"
                value={property.property_type}
                onChange={this.handleChange}
                className="form-control"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="price_per_night" className="form-label">Price per Night</label>
              <input
                type="number"
                id="price_per_night"
                name="price_per_night"
                value={property.price_per_night}
                onChange={this.handleChange}
                className="form-control"
                min="0" 
              />
            </div>
            <div className="mb-3">
              <label htmlFor="max_guests" className="form-label">Max Guests</label>
              <input
                type="number"
                id="max_guests"
                name="max_guests"
                value={property.max_guests}
                onChange={this.handleChange}
                className="form-control"
                min="0"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="bedrooms" className="form-label">Bedrooms</label>
              <input
                type="number"
                id="bedrooms"
                name="bedrooms"
                value={property.bedrooms}
                onChange={this.handleChange}
                className="form-control"
                min="0"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="beds" className="form-label">Beds</label>
              <input
                type="number"
                id="beds"
                name="beds"
                value={property.beds}
                onChange={this.handleChange}
                className="form-control"
                min="0"
              />
            </div>
            <div className="mb-3">
              <label htmlFor="baths" className="form-label">Baths</label>
              <input
                type="number"
                id="baths"
                name="baths"
                value={property.baths}
                onChange={this.handleChange}
                className="form-control"
                min="0"
              />
            </div>
            <button type="submit" className="btn btn-primary">Update Property</button>
          </form>
        </div>
      </Layout>
    );
  }
}

export default EditProperty;

document.addEventListener('DOMContentLoaded', () => {
  const propertyId = document.getElementById('edit-property-root').dataset.propertyId;
  ReactDOM.render(<EditProperty property_id={propertyId} />, document.getElementById('edit-property-root'));
});
