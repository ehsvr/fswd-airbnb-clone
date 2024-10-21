import React from 'react';
import ReactDOM from 'react-dom';
import EditProperty from './edit';

document.addEventListener('DOMContentLoaded', () => {
  const propertyId = window.location.pathname.split('/').pop();

  ReactDOM.render(
    <EditProperty property_id={propertyId} />,
    document.body.appendChild(document.createElement('div')),
  );
});