require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();
const db = require("./models");

const userRoutes = require('./routes/usersrouter.js');
const taskRoutes = require('./routes/tasksrouter');

db.sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
    return db.Users.findOrCreate({
      where: { username: 'testuser' },
      defaults: {
        password: 'testpass', 
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com'
      }
    });
  })
  .then(([user, created]) => {
    if (created) {
      console.log("Test user created successfully.");
    } else {
      console.log("Test user already exists.");
    }
  })
  .catch((err) => {
    console.error("Unable to connect to the database or create test user:", err);
  });

// Sync the models
db.sequelize
  .sync({ alter: true })
  .then(() => console.log("Database synced"))
  .catch((err) => console.error("Unable to sync the database:", err));

app.use(cors());
app.use(express.json());
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

const PORT = process.env.PORT || 4025;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});