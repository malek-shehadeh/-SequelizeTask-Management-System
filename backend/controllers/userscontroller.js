const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const db = require("../models");
const { JWT_SECRET } = require("../config/config");

exports.signup = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { username, password, first_name, last_name, email } = req.body;
    console.log('Received data:', { username, first_name, last_name, email });
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = await db.Users.create({
      username,
      password: hashedPassword,
      first_name,
      last_name,
      email
    }, { transaction });
    
    await transaction.commit();
    console.log('User created:', newUser.toJSON());
    res.status(201).json({ message: "User created successfully", user: newUser });
  } catch (error) {
    await transaction.rollback();
    console.error('Error during sign up:', error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      res.status(400).json({ error: "Username or email already exists" });
    } else {
      res.status(500).json({ error: "An error occurred during sign up" });
    }
  }
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await db.Users.findOne({ where: { username } });
    
    if (user) {
      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        const token = jwt.sign(
          { id: user.user_id, username: user.username },
          JWT_SECRET
        );
        res.json({ token });
      } else {
        res.status(400).json({ error: "Invalid credentials" });
      }
    } else {
      res.status(400).json({ error: "User not found" });
    }
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: "An error occurred during login" });
  }
};