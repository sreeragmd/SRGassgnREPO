// App.js

import React, { useState } from 'react';
import axios from 'axios';

function App() {
  const [username, setUsername] = useState('');
  const [userInfo, setUserInfo] = useState(null);
  const [repositories, setRepositories] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.get(`/api/github/${username}`);
      setUserInfo(response.data.userInfo);
      setRepositories(response.data.repositories);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter GitHub username"
        />
        <button type="submit">Search</button>
      </form>
      {userInfo && (
        <div>
          <h2>User Info</h2>
          <p>Username: {userInfo.username}</p>
          <p>Avatar: <img src={userInfo.avatar_url} alt="User Avatar" /></p>
        </div>
      )}
      <h2>Repositories</h2>
      <ul>
        {repositories.map(repo => (
          <li key={repo.id}>{repo.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
