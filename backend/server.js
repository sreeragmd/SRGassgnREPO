const express = require('express');
const axios = require('axios');
const mysql = require('mysql');

const app = express();
const port = 5000;

const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sreeragmd991',
  database: 'github_data'
});

app.use(express.json());

app.get('/api/github/:username', async (req, res) => {
  const { username } = req.params;

  connection.query('SELECT * FROM users WHERE username = ?', [username], async (error, results) => {
    if (error) throw error;

    if (results.length === 0) {

      try {
        const userResponse = await axios.get(`https://api.github.com/users/${username}`);
        const reposResponse = await axios.get(`https://api.github.com/users/${username}/repos`);

        connection.query('INSERT INTO users SET ?', {
          username: username,
          avatar_url: userResponse.data.avatar_url
        });

        reposResponse.data.forEach(repo => {
          connection.query('INSERT INTO repositories SET ?', {
            user_id: results.insertId,
            name: repo.name,
          });
        });

        res.json({ userInfo: userResponse.data, repositories: reposResponse.data });
      } catch (error) {
        console.error('Error:', error);
        res.status(500).send('Internal server error');
      }
    } else {
      const user = results[0];
      connection.query('SELECT * FROM repositories WHERE user_id = ?', [user.id], (error, repos) => {
        if (error) throw error;
        res.json({ userInfo: user, repositories: repos });
      });
    }
  });
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
