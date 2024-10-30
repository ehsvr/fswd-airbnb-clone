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

document.addEventListener('DOMContentLoaded', () => {
  const element = document.getElementById('profile-page');
  if (element) {
    ReactDOM.render(<ProfilePage />, element);
  }
});
