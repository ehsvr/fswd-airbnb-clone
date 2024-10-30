import React from 'react';
import ReactDOM from 'react-dom';
import Profile from './profile';

import './profile.scss';

const ProfilePage = () => {
  return (
    <div>
      <Profile />
    </div>
  );
};

// Render the component once the DOM is fully loaded
document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('profile-page'); // Ensure this ID matches your HTML
  if (element) {
    ReactDOM.render(<ProfilePage />, element);
  }
});
